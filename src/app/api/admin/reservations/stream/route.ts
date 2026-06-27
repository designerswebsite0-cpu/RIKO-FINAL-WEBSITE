import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getFirebaseDb } from "@/lib/firebase";
import { jsonError } from "@/lib/http";
import { listReservations } from "@/lib/repository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function event(payload: unknown) {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;

  const encoder = new TextEncoder();

  try {
    const stream = new ReadableStream({
      start(controller) {
        let closed = false;

        const sendReservations = async () => {
          if (closed) return;
          try {
            const page = await listReservations({ perPage: 100 });
            controller.enqueue(encoder.encode(event({ success: true, ...page })));
          } catch (error) {
            controller.enqueue(encoder.encode(event({
              success: false,
              error: error instanceof Error ? error.message : "Unable to stream reservations.",
            })));
          }
        };

        const unsubscribe = getFirebaseDb()
          .collection("reservations")
          .onSnapshot(
            () => {
              void sendReservations();
            },
            (error) => {
              controller.enqueue(encoder.encode(event({ success: false, error: error.message })));
            },
          );

        const keepAlive = setInterval(() => {
          if (!closed) controller.enqueue(encoder.encode(": keep-alive\n\n"));
        }, 25_000);

        request.signal.addEventListener("abort", () => {
          closed = true;
          clearInterval(keepAlive);
          unsubscribe();
          controller.close();
        });
      },
    });

    return new Response(stream, {
      headers: {
        "Cache-Control": "no-cache, no-transform",
        "Content-Type": "text/event-stream; charset=utf-8",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Unable to open reservation stream.", 503);
  }
}
