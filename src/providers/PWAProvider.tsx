"use client";

import { useEffect, ReactNode } from "react";
import { usePWA } from "@/hooks/usePWA";

interface PWAProviderProps {
  children: ReactNode;
}

export default function PWAProvider({ children }: PWAProviderProps) {
  // Register service worker
  usePWA();

  useEffect(() => {
    // Prevent zoom on iOS
    const preventZoom = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventZoom, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventZoom);
    };
  }, []);

  return <>{children}</>;
}
