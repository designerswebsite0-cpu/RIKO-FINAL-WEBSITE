import fs from "node:fs";
import path from "node:path";
import { v2 as cloudinary } from "cloudinary";

function cleanEnv(name: string): string | undefined {
  let value = process.env[name]?.trim();
  if (!value) return undefined;
  if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
    value = value.slice(1, -1).trim();
  }
  return value;
}

const cloudName = cleanEnv("CLOUDINARY_CLOUD_NAME");
const apiKey = cleanEnv("CLOUDINARY_API_KEY");
const apiSecret = cleanEnv("CLOUDINARY_API_SECRET");

// Initialize Cloudinary if credentials are provided
if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export async function uploadMenuImage(file: File) {
  if (!file.type.startsWith("image/")) throw new Error("Only image uploads are supported.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Image size must be 8 MB or less.");
  
  if (!storageConfigurationPresent()) {
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

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: cleanEnv("CLOUDINARY_FOLDER") || "riko/menu",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          return reject(new Error(error?.message || "Cloudinary upload failed."));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    uploadStream.end(buffer);
  });
}

export async function deleteMenuImage(publicId?: string) {
  if (!publicId) return;
  
  // Try local file delete first
  const filePath = path.join(process.cwd(), "public", "uploads", publicId);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return;
    }
  } catch (error) {
    console.error(`Failed to delete local image: ${filePath}`, error);
  }

  // If local file doesn't exist, try Cloudinary
  if (storageConfigurationPresent()) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error(`Failed to delete Cloudinary image: ${publicId}`, error);
    }
  }
}

export function storageConfigurationPresent() {
  return !!(
    cleanEnv("CLOUDINARY_CLOUD_NAME") &&
    cleanEnv("CLOUDINARY_API_KEY") &&
    cleanEnv("CLOUDINARY_API_SECRET")
  );
}

export async function uploadMenuVideo(file: File) {
  if (!file.type.startsWith("video/")) throw new Error("Only video uploads are supported.");
  if (file.size > 100 * 1024 * 1024) throw new Error("Video size must be 100 MB or less.");
  
  if (!storageConfigurationPresent()) {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.name) || ".mp4";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const url = `/uploads/${fileName}`;
    return { url, publicId: fileName };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: cleanEnv("CLOUDINARY_FOLDER") || "riko/menu",
        resource_type: "video",
      },
      (error, result) => {
        if (error || !result) {
          return reject(new Error(error?.message || "Cloudinary video upload failed."));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    uploadStream.end(buffer);
  });
}
