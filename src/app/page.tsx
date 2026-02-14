/**
 * Root page - Middleware will handle redirect to /login or /admin/dashboard
 * This page should never be seen by users as middleware redirects immediately
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#578FCA] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <p className="text-gray-600 font-medium">Memuat...</p>
      </div>
    </div>
  );
}
