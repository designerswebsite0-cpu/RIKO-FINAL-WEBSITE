"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function useReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll window to top on page navigation
    window.scrollTo(0, 0);

    const els = document.querySelectorAll<HTMLElement>(".reveal");

    // Instantly reveal elements if IntersectionObserver is not supported
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "50px" }
    );

    els.forEach((el) => io.observe(el));

    // Instant fallback timer to ensure 100% visibility on all routes
    const fallbackTimer = setTimeout(() => {
      els.forEach((el) => el.classList.add("in"));
    }, 150);

    return () => {
      clearTimeout(fallbackTimer);
      io.disconnect();
    };
  }, [pathname]);
}
