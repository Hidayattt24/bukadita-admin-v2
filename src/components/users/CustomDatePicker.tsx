"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown } from "lucide-react";

interface CustomDatePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export default function CustomDatePicker({
  value,
  onChange,
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value + "T00:00:00") : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Initialize currentMonth based on selected date or today
  useEffect(() => {
    if (value) {
      try {
        const date = new Date(value + "T00:00:00");
        if (!isNaN(date.getTime())) {
          setCurrentMonth(date);
        }
      } catch (error) {
        console.error("Error parsing date:", error);
      }
    }
  }, [value]);

  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "Pilih tanggal lahir";
    try {
      if (isNaN(date.getTime())) return "Pilih tanggal lahir";
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "Pilih tanggal lahir";
    }
  };

  const handleDateSelect = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    const formattedDate = newDate.toISOString().split("T")[0];
    onChange(formattedDate);
    setIsOpen(false);
  };

  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), monthIndex));
    setShowMonthPicker(false);
  };

  const handleYearSelect = (year: number) => {
    setCurrentMonth(new Date(year, currentMonth.getMonth()));
    setShowYearPicker(false);
  };

  const renderCalendar = () => {
    const days = [];
    const totalDays = daysInMonth(currentMonth);
    const firstDay = firstDayOfMonth(currentMonth);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
    }

    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
        day
      );
      const isSelected =
        selectedDate &&
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear();
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
      const isFuture = date > today;

      days.push(
        <button
          key={day}
          type="button"
          onClick={() => !isFuture && handleDateSelect(day)}
          disabled={isFuture}
          className={`aspect-square rounded-md text-xs font-medium transition-all flex items-center justify-center ${
            isSelected
              ? "bg-gradient-to-br from-[#27548A] to-[#578FCA] text-white shadow-md scale-105"
              : isToday
              ? "bg-blue-50 text-[#27548A] border border-[#27548A]"
              : isFuture
              ? "text-slate-300 cursor-not-allowed"
              : "hover:bg-slate-100 text-slate-700"
          }`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  const currentYear = currentMonth.getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Input Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-3 py-2.5 border-2 rounded-xl focus:ring-2 focus:ring-[#27548A]/20 transition-all bg-white text-left flex items-center gap-2 ${
          isOpen
            ? "border-[#27548A] ring-2 ring-[#27548A]/20"
            : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <Calendar className="w-4 h-4 text-[#27548A]" />
        <span
          className={`flex-1 text-sm ${
            selectedDate ? "text-slate-700 font-medium" : "text-slate-400"
          }`}
        >
          {formatDate(selectedDate)}
        </span>
      </button>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-2xl p-3 w-full min-w-[280px]"
          >
            {/* Month/Year Navigation */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowMonthPicker(!showMonthPicker);
                    setShowYearPicker(false);
                  }}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:border-[#27548A] hover:bg-slate-50 transition-all flex items-center gap-1"
                >
                  {months[currentMonth.getMonth()]}
                  <ChevronDown className="w-3 h-3" />
                </button>

                {/* Month Picker Dropdown */}
                <AnimatePresence>
                  {showMonthPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full left-0 mt-1 bg-white border-2 border-slate-200 rounded-lg shadow-xl p-2 grid grid-cols-3 gap-1 w-48 z-[60]"
                    >
                      {months.map((month, index) => (
                        <button
                          key={month}
                          type="button"
                          onClick={() => handleMonthSelect(index)}
                          className={`px-2 py-1.5 text-xs rounded-md transition-all ${
                            currentMonth.getMonth() === index
                              ? "bg-gradient-to-r from-[#27548A] to-[#578FCA] text-white font-semibold"
                              : "hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          {month.slice(0, 3)}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowYearPicker(!showYearPicker);
                    setShowMonthPicker(false);
                  }}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:border-[#27548A] hover:bg-slate-50 transition-all flex items-center gap-1"
                >
                  {currentYear}
                  <ChevronDown className="w-3 h-3" />
                </button>

                {/* Year Picker Dropdown */}
                <AnimatePresence>
                  {showYearPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="absolute top-full right-0 mt-1 bg-white border-2 border-slate-200 rounded-lg shadow-xl p-2 grid grid-cols-4 gap-1 w-56 max-h-64 overflow-y-auto z-[60]"
                    >
                      {years.map((year) => (
                        <button
                          key={year}
                          type="button"
                          onClick={() => handleYearSelect(year)}
                          className={`px-2 py-1.5 text-xs rounded-md transition-all ${
                            currentYear === year
                              ? "bg-gradient-to-r from-[#27548A] to-[#578FCA] text-white font-semibold"
                              : "hover:bg-slate-100 text-slate-700"
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-0.5 mb-1">
              {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                <div
                  key={day}
                  className="text-center text-[10px] font-semibold text-slate-500 py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0.5">{renderCalendar()}</div>

            {/* Quick Actions */}
            <div className="mt-3 pt-3 border-t border-slate-200 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className="flex-1 px-2 py-1.5 text-xs text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors font-medium"
              >
                Hapus
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 px-2 py-1.5 text-xs text-white bg-gradient-to-r from-[#27548A] to-[#578FCA] rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
