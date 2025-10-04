import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const adminAuth = cookieStore.get("admin_auth")?.value;
  const adminRole = cookieStore.get("admin_role")?.value;
  const isAuthed = adminAuth === "1";
  const isAdminLevel = adminRole === "admin" || adminRole === "superadmin";
  if (isAuthed && isAdminLevel) {
    redirect("/admin/dashboard");
  }
  redirect("/login");
}