import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/http";
import { uploadMenuImage } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  const form = await request.formData();
  const image = form.get("image");
  if (!(image instanceof File)) return jsonError("Select an image to upload.");
  try { return jsonSuccess({ image: await uploadMenuImage(image) }, 201); }
  catch (error) { return jsonError(error instanceof Error ? error.message : "Image upload failed.", 503); }
}
