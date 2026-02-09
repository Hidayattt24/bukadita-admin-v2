"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, User, UserCog } from "lucide-react";

interface CustomRoleSelectProps {
  value: "pengguna" | "admin";
  onChange: (value: "pengguna" | "admin") => void;
  canManageAdmin: boolean;
}

export default function CustomRoleSelect({
  value,
  onChange,
  canManageAdmin,
}: CustomRoleSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const roles = [
    {
      value: "pengguna" as const,
      label: "Kader",
      description: "Pengguna biasa dengan akses terbatas",
      icon: User,
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-700",
    },
    {
      value: "admin" as const,
      label: "Ketua Posyandu / Admin",
      description: "Akses penuh untuk mengelola sistem",
      icon: UserCog,
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      disabled: !canManageAdmin,
    },
  ];

  const selectedRole = roles.find((role) => role.value === value);

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

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Value Display */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl hover:border-[#27548A] focus:ring-2 focus:ring-[#27548A]/20 focus:border-[#27548A] transition-all bg-white text-left flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          {selectedRole && (
            <>
              <div
                className={`p-2 rounded-lg ${selectedRole.bgColor} group-hover:scale-110 transition-transform`}
              >
                <selectedRole.icon
                  className={`w-5 h-5 ${selectedRole.textColor}`}
                />
              </div>
              <div>
                <p className="font-semibold text-slate-700">
                  {selectedRole.label}
                </p>
                <p className="text-xs text-slate-500">
                  {selectedRole.description}
                </p>
              </div>
            </>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-2xl overflow-hidden"
          >
            {roles.map((role) => {
              const isSelected = role.value === value;
              const isDisabled = role.disabled;

              return (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => {
                    if (!isDisabled) {
                      onChange(role.value);
                      setIsOpen(false);
                    }
                  }}
                  disabled={isDisabled}
                  className={`w-full px-4 py-4 flex items-center gap-3 transition-all relative ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed bg-slate-50"
                      : isSelected
                      ? "bg-gradient-to-r " + role.color + " text-white"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  {/* Icon */}
                  <div
                    className={`p-2 rounded-lg transition-all ${
                      isSelected
                        ? "bg-white/20"
                        : isDisabled
                        ? "bg-slate-100"
                        : role.bgColor
                    }`}
                  >
                    <role.icon
                      className={`w-5 h-5 ${
                        isSelected
                          ? "text-white"
                          : isDisabled
                          ? "text-slate-400"
                          : role.textColor
                      }`}
                    />
                  </div>

                  {/* Text */}
                  <div className="flex-1 text-left">
                    <p
                      className={`font-semibold ${
                        isSelected
                          ? "text-white"
                          : isDisabled
                          ? "text-slate-400"
                          : "text-slate-700"
                      }`}
                    >
                      {role.label}
                    </p>
                    <p
                      className={`text-xs ${
                        isSelected
                          ? "text-white/80"
                          : isDisabled
                          ? "text-slate-400"
                          : "text-slate-500"
                      }`}
                    >
                      {role.description}
                    </p>
                  </div>

                  {/* Check Icon */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="p-1 bg-white/20 rounded-full"
                    >
                      <Check className="w-5 h-5 text-white" />
                    </motion.div>
                  )}

                  {isDisabled && (
                    <span className="text-xs text-slate-400 italic">
                      Tidak tersedia
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
