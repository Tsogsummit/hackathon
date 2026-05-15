import { Storage } from "@google-cloud/storage";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]);

export async function saveUploadedImage(file: File) {
  if (!allowedTypes.has(file.type)) {
    throw new Error("Зөвхөн зураг файл оруулна уу.");
  }

  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
  let url: string;

  if (process.env.GCS_BUCKET_NAME) {
    const storage = new Storage({
      projectId: process.env.GCS_PROJECT_ID,
      credentials: process.env.GCS_CLIENT_EMAIL
        ? {
            client_email: process.env.GCS_CLIENT_EMAIL,
            private_key: process.env.GCS_PRIVATE_KEY?.replace(/\\n/g, "\n")
          }
        : undefined
    });
    const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
    const object = bucket.file(`uploads/${safeName}`);
    await object.save(bytes, { contentType: file.type, resumable: false });
    await object.makePublic();
    url = `https://storage.googleapis.com/${process.env.GCS_BUCKET_NAME}/uploads/${safeName}`;
  } else {
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, safeName), bytes);
    url = `/uploads/${safeName}`;
  }

  await prisma.uploadedFile.create({
    data: { fileName: file.name, url, mimeType: file.type, size: bytes.length }
  });

  return url;
}
