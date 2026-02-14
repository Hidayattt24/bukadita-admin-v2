'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Root page - Always redirect to login
 * Admin will be redirected to dashboard after successful login
 */
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#578FCA] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <p className="text-gray-600 font-medium">Mengalihkan ke halaman login...</p>
      </div>
    </div>
  );
}