"use client";

import React from "react";
import { ShoppingBag, Coffee, Sparkles } from "lucide-react";

interface BottomNavProps {
  activeTab: "ecommerce" | "fnb";
  onChangeTab: (tab: "ecommerce" | "fnb") => void;
  fnbDealsCount?: number;
}

/**
 * [Design Read] Family: TikTok-Style Mobile Bottom Navigation | Variance: 6/10 | Motion: 4/10 | Density: 8/10 | Accent: TikTok Red (#fe2c55) & Cyan (#25f4ee)
 */
export default function BottomNav({
  activeTab,
  onChangeTab,
  fnbDealsCount = 8,
}: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto bg-white/95 dark:bg-[#000000]/95 backdrop-blur-xl border-t border-zinc-200/80 dark:border-zinc-800/80 px-4 py-2 transition-colors">
      <div className="grid grid-cols-2 gap-2">
        {/* Tab 1: Săn Mã Sàn (Shopee & TikTok Shop) */}
        <button
          type="button"
          onClick={() => onChangeTab("ecommerce")}
          className={`flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all active:scale-95 ${
            activeTab === "ecommerce"
              ? "text-zinc-900 dark:text-white font-black"
              : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 font-medium"
          }`}
        >
          <div className="relative">
            <ShoppingBag
              className={`w-5 h-5 transition-transform ${
                activeTab === "ecommerce" ? "scale-110 stroke-[2.4]" : "stroke-[1.8]"
              }`}
            />
            {activeTab === "ecommerce" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-tiktok-red" />
            )}
          </div>
          <span className="text-[11px] mt-1.5 tracking-tight">Săn Mã Sàn</span>
        </button>

        {/* Tab 2: Cà Phê & Deal (F&B Highlands, TCH) */}
        <button
          type="button"
          onClick={() => onChangeTab("fnb")}
          className={`flex flex-col items-center justify-center py-1.5 rounded-2xl transition-all active:scale-95 relative ${
            activeTab === "fnb"
              ? "text-zinc-900 dark:text-white font-black"
              : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 font-medium"
          }`}
        >
          <div className="relative">
            <Coffee
              className={`w-5 h-5 transition-transform ${
                activeTab === "fnb" ? "scale-110 stroke-[2.4]" : "stroke-[1.8]"
              }`}
            />
            <span className="absolute -top-1.5 -right-3.5 px-1.5 py-0.2 rounded-full bg-tiktok-red text-white text-[9px] font-black leading-tight shadow-xs">
              HOT
            </span>
            {activeTab === "fnb" && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 rounded-full bg-tiktok-red" />
            )}
          </div>
          <span className="text-[11px] mt-1.5 tracking-tight">Cà Phê &amp; Deal</span>
        </button>
      </div>
    </nav>
  );
}
