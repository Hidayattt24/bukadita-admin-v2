import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId: string | undefined = body?.userId;
    const roleFromClient: string | undefined = body?.role;

    let role = roleFromClient;

    if (!role && userId) {
      const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false },
      });
      const { data: profile } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", userId)
        .single();
      role = profile?.role;
    }

    const isProd = process.env.NODE_ENV === "production";
    const isAdminLevel = role === "admin" || role === "superadmin";
    const isAuthed = Boolean(userId) || isAdminLevel;

    const res = NextResponse.json({ ok: true, role: role || null });
    res.cookies.set("admin_auth", isAuthed ? "1" : "0", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: isProd,
      maxAge: 60 * 60 * 12,
    });
    res.cookies.set("admin_role", role || "", {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: isProd,
      maxAge: 60 * 60 * 12,
    });
    return res;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const role = req.cookies.get("admin_role")?.value || "";
    const authed = req.cookies.get("admin_auth")?.value === "1";
    return NextResponse.json({ ok: true, authed, role });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
