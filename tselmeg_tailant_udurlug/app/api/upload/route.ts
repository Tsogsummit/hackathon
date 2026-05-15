import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedImage } from "@/lib/upload";

export async function POST(request: Request) {
  requireAdmin();
  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Файл олдсонгүй." }, { status: 400 });
  }
  const url = await saveUploadedImage(file);
  return NextResponse.json({ url });
}
