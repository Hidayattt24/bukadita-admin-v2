import { Suspense } from "react";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen grid place-items-center">Memuat form...</div>}>
      <LoginForm />
    </Suspense>
  );
}