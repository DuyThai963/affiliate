"use client";

import React from "react";
import { ShoppingBag, Coffee, Sparkles } from "lucide-react";

interface BottomNavProps {
  activeTab: "ecommerce" | "fnb";
  onChangeTab: (tab: "ecommerce" | "fnb") => void;
  fnbDealsCount?: number;
}

/**
 * [Design Read] Family: Minimalist Tactile Mobile App Navigation | Variance: 6/10 | Motion: 6/10 | Density: 8/10 | Accent: Shopee Vermilion (#ee4d2d) & Highlands Crimson (#b31f24)
 */
export default function BottomNav({
  activeTab,
  onChangeTab,
  fnbDealsCount = 8,
}: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-200/90 dark:border-zinc-800 shadow-lg px-6 py-2 transition-colors">
      <div className="grid grid-cols-2 gap-4">
        {/* Tab 1: Săn Mã Sàn (Shopee & TikTok Shop) */}
        <button
          type="button"
          onClick={() => onChangeTab("ecommerce")}
          className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all active:scale-95 ${
            activeTab === "ecommerce"
              ? "text-shopee-600 dark:text-shopee-400 font-extrabold"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium"
          }`}
        >
          <div className="relative">
            <ShoppingBag
              className={`w-5 h-5 transition-transform ${
                activeTab === "ecommerce" ? "scale-110 stroke-[2.5]" : "stroke-[1.8]"
              }`}
            />
            {activeTab === "ecommerce" && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-shopee-500 animate-pulse" />
            )}
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Săn Mã Sàn</span>
        </button>

        {/* Tab 2: Cà Phê & Deal (F&B Highlands, TCH) */}
        <button
          type="button"
          onClick={() => onChangeTab("fnb")}
          className={`flex flex-col items-center justify-center py-1 rounded-2xl transition-all active:scale-95 relative ${
            activeTab === "fnb"
              ? "text-[#b31f24] dark:text-rose-400 font-extrabold"
              : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 font-medium"
          }`}
        >
          <div className="relative">
            <Coffee
              className={`w-5 h-5 transition-transform ${
                activeTab === "fnb" ? "scale-110 stroke-[2.5]" : "stroke-[1.8]"
              }`}
            />
            <span className="absolute -top-1.5 -right-3 px-1 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black leading-tight">
              HOT
            </span>
          </div>
          <span className="text-[11px] mt-1 tracking-tight">Cà Phê &amp; Deal</span>
        </button>
      </div>
    </nav>
  );
}
