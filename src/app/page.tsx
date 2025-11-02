import { redirect } from "next/navigation";

/**
 * Root page - Always redirect to login
 * Admin will be redirected to dashboard after successful login
 */
export default function Home() {
  redirect("/login");
}