"use client";

import { useEffect, useState } from "react";
import MobileWarning from "./MobileWarning";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isMobile, setIsMobile] = useState(true); // Default to mobile for safety

  useEffect(() => {
    // Check if window is mobile/tablet size or touch device
    const checkMobile = () => {
      const width = window.innerWidth;
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Consider mobile if:
      // 1. Width less than 1024px OR
      // 2. Touch device with width less than 1280px (to catch tablets)
      const shouldShowWarning = width < 1024 || (isTouchDevice && width < 1280);
      
      setIsMobile(shouldShowWarning);
      
      console.log('Mobile check:', { width, isTouchDevice, shouldShowWarning });
    };

    // Initial check immediately
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show mobile warning if screen is too small
  if (isMobile) {
    return <MobileWarning />;
  }

  // Show normal admin content for desktop
  return <>{children}</>;
}
