"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface ScrollToTopProps {
  bottomClass?: string;
  threshold?: number;
}

/**
 * [Design Read] Family: Minimalist Circular Floating Action Button | Variance: 3/10 | Motion: 5/10 | Density: 4/10 | Accent: High-Contrast Monochromatic Pill with Subtle Elevation
 */
export default function ScrollToTop({
  bottomClass = "bottom-20",
  threshold = 260,
}: ScrollToTopProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check initial position on mount
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Cuộn lên đầu trang"
      title="Lướt lên đầu trang"
      className={`fixed ${bottomClass} right-4 sm:right-[max(1rem,calc(50%-220px+1rem))] z-40 w-10 h-10 rounded-full bg-zinc-900/90 dark:bg-white/95 text-white dark:text-zinc-900 shadow-xl shadow-black/25 backdrop-blur-md border border-white/10 dark:border-zinc-200/40 flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-90 animate-in fade-in zoom-in-75 cursor-pointer`}
    >
      <ArrowUp className="w-4 h-4 stroke-[2.5]" />
    </button>
  );
}
