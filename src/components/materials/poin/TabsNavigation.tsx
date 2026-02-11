"use client";

interface TabsNavigationProps {
  activeTab: "manage" | "preview";
  poinsCount: number;
  onTabChange: (tab: "manage" | "preview") => void;
}

export default function TabsNavigation({
  activeTab,
  poinsCount,
  onTabChange,
}: TabsNavigationProps) {
  return (
    <div className="mb-6">
      <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-2 shadow-lg border border-white/50">
        <nav className="flex gap-2">
          <button
            onClick={() => onTabChange("manage")}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${
              activeTab === "manage"
                ? "bg-gradient-to-r from-[#27548A] to-[#578FCA] text-white shadow-lg shadow-[#27548A]/30"
                : "text-gray-600 hover:bg-gray-50 hover:text-[#27548A]"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Kelola Poin
            </span>
          </button>
          <button
            onClick={() => onTabChange("preview")}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${
              activeTab === "preview"
                ? "bg-gradient-to-r from-[#27548A] to-[#578FCA] text-white shadow-lg shadow-[#27548A]/30"
                : "text-gray-600 hover:bg-gray-50 hover:text-[#27548A]"
            }`}
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Preview Materi
              {poinsCount > 0 && (
                <span className="ml-1 px-2.5 py-0.5 text-xs bg-white/20 backdrop-blur-sm rounded-full font-bold">
                  {poinsCount}
                </span>
              )}
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
}
