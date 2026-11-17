"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

/**
 * [Design Read] Family: TikTok-Inspired Mobile Commerce Header | Variance: 6/10 | Motion: 4/10 | Density: 8/10 | Accent: TikTok Red (#fe2c55) & Cyan (#25f4ee)
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
    <header className="px-4 py-3 bg-white/90 dark:bg-[#121214]/95 backdrop-blur-xl border-b border-zinc-200/80 dark:border-zinc-800/80 sticky top-0 z-30 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          {/* Logo with subtle TikTok cyan & red chromatic border aura */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-tiktok-cyan/40 to-tiktok-red/40 rounded-2xl blur-[2px] opacity-75 group-hover:opacity-100 transition duration-300" />
            <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-sm shrink-0 border border-zinc-200/80 dark:border-zinc-700/80 bg-white dark:bg-zinc-900">
              <img
                src="/icons/logo.png"
                alt="Logo Săn Voucher"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-black text-[15px] tracking-tight text-zinc-900 dark:text-white">
                SĂN VOUCHER
              </span>
              <span className="inline-flex items-center space-x-1 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-tiktok-red/10 text-tiktok-red border border-tiktok-red/20">
                <span className="w-1.5 h-1.5 rounded-full bg-tiktok-red animate-pulse" />
                <span>DEALS</span>
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium tracking-tight">
              Shopee &bull; TikTok Shop &bull; Cà Phê
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={toggleTheme}
            aria-label="Đổi giao diện Sáng / Tối"
            className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition active:scale-95 border border-zinc-200/80 dark:border-zinc-800"
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
