import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { jsonError, jsonSuccess } from "@/lib/http";
import { uploadMenuImage, uploadMenuVideo } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin(request);
  if (unauthorized) return unauthorized;
  const form = await request.formData();
  const file = form.get("file") || form.get("image");
  if (!(file instanceof File)) return jsonError("Select a file to upload.");
  try {
    if (file.type.startsWith("video/")) {
      const uploaded = await uploadMenuVideo(file);
      return jsonSuccess({ image: uploaded, file: uploaded, url: uploaded.url, publicId: uploaded.publicId }, 201);
    } else if (file.type.startsWith("image/")) {
      const uploaded = await uploadMenuImage(file);
      return jsonSuccess({ image: uploaded, file: uploaded, url: uploaded.url, publicId: uploaded.publicId }, 201);
    } else {
      return jsonError("Unsupported file type. Only images and videos are supported.");
    }
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : "Upload failed.", 503);
  }
}
