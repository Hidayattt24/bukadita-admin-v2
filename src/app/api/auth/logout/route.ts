import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  const isProd = process.env.NODE_ENV === "production";
  const cookieOpts = {
    httpOnly: true as const,
    path: "/",
    sameSite: "lax" as const,
    secure: isProd,
    maxAge: 0,
    expires: new Date(0),
  };
  res.cookies.set("admin_auth", "", cookieOpts);
  res.cookies.set("admin_role", "", cookieOpts);
  return res;
}
