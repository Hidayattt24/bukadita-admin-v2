"use client";

import { useEffect } from "react";

export function usePWA() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      process.env.NODE_ENV === "production"
    ) {
      // Register service worker
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "[PWA] Service Worker registered with scope:",
            registration.scope
          );

          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute

          // Listen for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // New service worker available
                  console.log("[PWA] New content available, please refresh");
                  
                  // Optionally show a notification to user
                  if (
                    confirm(
                      "Versi baru tersedia! Refresh halaman untuk update?"
                    )
                  ) {
                    newWorker.postMessage({ type: "SKIP_WAITING" });
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("[PWA] Service Worker registration failed:", error);
        });

      // Handle controller change (new service worker activated)
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        console.log("[PWA] New service worker activated");
      });
    }
  }, []);
}
