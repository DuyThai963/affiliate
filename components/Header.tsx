"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * [Design Read] Family: Quiet Luxury Mobile Commerce | Variance: 5/10 | Motion: 4/10 | Density: 7/10 | Accent: Muted Terracotta Pastel (#d96947)
 */
export default function Header() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode =
      localStorage.getItem("theme") === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <header className="px-4 py-3 bg-[#faf9f6]/95 dark:bg-[#121215]/95 backdrop-blur-md border-b border-zinc-200/60 dark:border-zinc-800/60 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm shrink-0 border border-zinc-200/70 dark:border-zinc-700/60 bg-white dark:bg-zinc-800">
            <img
              src="/icons/logo.png"
              alt="Logo Săn Voucher"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-[15px] tracking-tight text-zinc-900 dark:text-zinc-100">
                SĂN VOUCHER
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-shopee-50 dark:bg-shopee-900/30 text-shopee-600 dark:text-shopee-400 border border-shopee-200/60 dark:border-shopee-800/40">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
              Shopee, TikTok &amp; F&amp;B Deals
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            aria-label="Đổi giao diện Sáng / Tối"
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/60 transition active:scale-95 border border-zinc-200/60 dark:border-zinc-800/80"
          >
            {isDark ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-zinc-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
