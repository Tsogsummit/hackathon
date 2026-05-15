import { NextResponse } from "next/server";
import { createSession, hashPassword, setAdminCookie } from "@/lib/auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  if (email === process.env.ADMIN_EMAIL && hashPassword(password) === hashPassword(process.env.ADMIN_PASSWORD || "")) {
    setAdminCookie(createSession(email));
    return NextResponse.redirect(new URL("/admin", request.url), 303);
  }

  return NextResponse.redirect(new URL("/admin/login?error=1", request.url), 303);
}
