"use client";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
      <div className="max-w-lg w-full bg-white rounded-xl border border-red-200 p-6 text-red-700">
        <h2 className="text-xl font-semibold">Terjadi kesalahan</h2>
        <p className="mt-2 text-sm">{error.message}</p>
        <button className="mt-4 rounded bg-red-600 text-white px-4 py-2" onClick={() => reset()}>
          Coba lagi
        </button>
      </div>
    </div>
  );
}
