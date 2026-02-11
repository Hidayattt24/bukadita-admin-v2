"use client";

interface PoinFormFieldsProps {
  title: string;
  durationLabel: string;
  durationMinutes: string;
  onTitleChange: (value: string) => void;
  onDurationLabelChange: (value: string) => void;
  onDurationMinutesChange: (value: string) => void;
}

export default function PoinFormFields({
  title,
  durationLabel,
  durationMinutes,
  onTitleChange,
  onDurationLabelChange,
  onDurationMinutesChange,
}: PoinFormFieldsProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-[#27548A]"
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
          </div>
          Judul Poin
          <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-5 py-4 text-lg text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#578FCA]/50 focus:border-[#27548A] transition-all duration-300 bg-white hover:border-gray-300 placeholder-gray-400"
          placeholder="Masukkan judul poin yang menarik..."
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-[#27548A]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            Label Durasi
          </label>
          <input
            type="text"
            value={durationLabel}
            onChange={(e) => onDurationLabelChange(e.target.value)}
            className="w-full px-5 py-4 text-base text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#578FCA]/50 focus:border-[#27548A] transition-all duration-300 bg-white hover:border-gray-300 placeholder-gray-400"
            placeholder="contoh: Bacaan 5 menit"
          />
        </div>

        <div>
          <label className="block text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#27548A]/10 to-[#578FCA]/10 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-[#27548A]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            Durasi (menit)
          </label>
          <input
            type="number"
            min="0"
            value={durationMinutes}
            onChange={(e) => onDurationMinutesChange(e.target.value)}
            className="w-full px-5 py-4 text-base text-gray-900 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#578FCA]/50 focus:border-[#27548A] transition-all duration-300 bg-white hover:border-gray-300 placeholder-gray-400"
            placeholder="Estimasi waktu dalam menit"
          />
        </div>
      </div>
    </div>
  );
}
