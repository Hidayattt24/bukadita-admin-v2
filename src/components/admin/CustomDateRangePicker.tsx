"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

interface CustomDateRangePickerProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onCustomRangeActive: () => void;
}

export default function CustomDateRangePicker({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onCustomRangeActive,
}: CustomDateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "Pilih tanggal";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (number | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDayClick = (day: number) => {
    const selectedDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const dateStr = selectedDate.toISOString().split("T")[0];

    if (selectingStart) {
      setTempStartDate(dateStr);
      setSelectingStart(false);
    } else {
      // Ensure end date is after start date
      if (new Date(dateStr) < new Date(tempStartDate)) {
        setTempEndDate(tempStartDate);
        setTempStartDate(dateStr);
      } else {
        setTempEndDate(dateStr);
      }
      setSelectingStart(true);
    }
  };

  const handleApply = () => {
    onStartDateChange(tempStartDate);
    onEndDateChange(tempEndDate);
    onCustomRangeActive();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempStartDate(startDate);
    setTempEndDate(endDate);
    setIsOpen(false);
    setSelectingStart(true);
  };

  const isDateInRange = (day: number) => {
    if (!tempStartDate || !tempEndDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = date.toISOString().split("T")[0];
    return dateStr >= tempStartDate && dateStr <= tempEndDate;
  };

  const isDateSelected = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateStr = date.toISOString().split("T")[0];
    return dateStr === tempStartDate || dateStr === tempEndDate;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  return (
    <div className="relative" ref={pickerRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border-2 border-[#27548A] shadow-sm hover:shadow-md transition-shadow"
      >
        <Calendar className="w-4 h-4 text-[#27548A]" />
        <span className="text-sm font-semibold text-[#27548A]">
          {formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
        </span>
      </button>

      {/* Dropdown Picker */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-slate-200 p-6 z-50 w-[380px]">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Pilih Rentang Tanggal</h3>
            <button
              onClick={handleCancel}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Selected Range Display */}
          <div className="mb-4 p-3 bg-gradient-to-r from-[#27548A]/10 to-[#578FCA]/10 rounded-xl border border-[#27548A]/20">
            <div className="flex items-center justify-between text-sm">
              <div>
                <p className="text-xs text-slate-600 mb-1">Dari</p>
                <p className="font-semibold text-[#27548A]">
                  {formatDisplayDate(tempStartDate)}
                </p>
              </div>
              <div className="text-[#578FCA] font-semibold">→</div>
              <div>
                <p className="text-xs text-slate-600 mb-1">Sampai</p>
                <p className="font-semibold text-[#27548A]">
                  {formatDisplayDate(tempEndDate)}
                </p>
              </div>
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>
            <div className="text-center">
              <p className="font-semibold text-slate-900">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </p>
            </div>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="mb-4">
            {/* Day Names */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-semibold text-slate-600 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentMonth).map((day, index) => {
                if (day === null) {
                  return <div key={`empty-${index}`} className="aspect-square" />;
                }

                const inRange = isDateInRange(day);
                const selected = isDateSelected(day);
                const today = isToday(day);

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`
                      aspect-square rounded-lg text-sm font-semibold transition-all
                      ${selected
                        ? "bg-gradient-to-br from-[#27548A] to-[#578FCA] text-white shadow-md scale-105"
                        : inRange
                        ? "bg-[#578FCA]/20 text-[#27548A]"
                        : today
                        ? "bg-slate-100 text-slate-900 border-2 border-[#27548A]"
                        : "text-slate-700 hover:bg-slate-100"
                      }
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={handleApply}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#27548A] to-[#578FCA] text-white font-semibold hover:shadow-lg transition-shadow"
            >
              Terapkan
            </button>
          </div>

          {/* Helper Text */}
          <p className="text-xs text-slate-500 text-center mt-3">
            {selectingStart ? "Pilih tanggal mulai" : "Pilih tanggal akhir"}
          </p>
        </div>
      )}
    </div>
  );
}

