import fs from "node:fs";
import path from "node:path";

export async function uploadMenuImage(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Only image uploads are supported.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Image size must be 8 MB or less.");
  
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const ext = path.extname(file.name) || ".webp";
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
  const filePath = path.join(uploadDir, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, buffer);

  const url = `/uploads/${fileName}`;
  return { url, publicId: fileName };
}

export async function deleteMenuImage(publicId?: string) {
  if (!publicId) return;
  const filePath = path.join(process.cwd(), "public", "uploads", publicId);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(`Failed to delete local image: ${filePath}`, error);
  }
}

export function storageConfigurationPresent() {
  return true;
}
