"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { X, Download, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function PWAInstallPrompt() {
  const pathname = usePathname();
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Only show on login page
    if (pathname !== "/login") {
      setShowPrompt(false);
      return;
    }

    // Check if already installed
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true
    ) {
      setIsInstalled(true);
      return;
    }

    // Check if user has dismissed the prompt in this session
    const sessionDismissed = sessionStorage.getItem("pwa-install-dismissed-session");
    if (sessionDismissed === "true") {
      return;
    }

    // Check if user has permanently dismissed the prompt
    const permanentDismissed = localStorage.getItem("pwa-install-dismissed-permanent");
    if (permanentDismissed === "true") {
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show prompt after 3 seconds
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
      // Mark as permanently dismissed since it's installed
      localStorage.setItem("pwa-install-dismissed-permanent", "true");
    };

    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [pathname]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
      // Mark as permanently dismissed since user installed
      localStorage.setItem("pwa-install-dismissed-permanent", "true");
    } else {
      console.log("User dismissed the install prompt");
      // Mark as dismissed for this session only
      sessionStorage.setItem("pwa-install-dismissed-session", "true");
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Mark as dismissed for this session only
    sessionStorage.setItem("pwa-install-dismissed-session", "true");
  };

  if (isInstalled || !showPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
        >
          <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-2xl border-2 border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#578FCA] to-[#27548A] p-4 text-white">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Install Bukadita Admin</h3>
                    <p className="text-xs text-blue-100 mt-0.5">
                      Akses lebih cepat & mudah
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDismiss}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                  aria-label="Tutup"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <p className="text-sm text-slate-700 mb-4">
                Install aplikasi ini di perangkat Anda untuk pengalaman yang
                lebih baik:
              </p>

              <ul className="space-y-2 mb-4">
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>Akses cepat dari home screen</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="text-green-600 font-bold mt-0.5">✓</span>
                  <span>Pengalaman seperti aplikasi native</span>
                </li>
              </ul>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleInstallClick}
                  className="flex-1 bg-gradient-to-r from-[#578FCA] to-[#27548A] text-white px-4 py-3 rounded-lg font-semibold text-sm hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Install Sekarang
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-3 rounded-lg font-semibold text-sm text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Nanti
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
