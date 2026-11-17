"use client";

import React, { useState } from "react";
import { Copy, Check, Sparkles, ShoppingBag } from "lucide-react";

interface TikTokShopCardProps {
  affiliateLink: string;
  cleanUrl: string;
  onShowToast: (message: string) => void;
}

/**
 * [Design Read] Family: High-Contrast Tactile Mobile Commerce | Variance: 6/10 | Motion: 4/10 | Density: 7/10 | Accent: Matte Charcoal (#121215) & Soft Crimson (#e05263)
 */
export default function TikTokShopCard({
  affiliateLink,
  cleanUrl,
  onShowToast,
}: TikTokShopCardProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleOpenTikTok = () => {
    if (!affiliateLink) return;
    window.open(affiliateLink, "_blank", "noopener,noreferrer");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(affiliateLink);
      setIsCopied(true);
      onShowToast("Đã copy link Affiliate TikTok Shop!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      onShowToast("Không thể sao chép link.");
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4 transition-all">
      {/* Platform Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {/* TikTok Icon */}
          <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white shadow-sm shadow-black/30">
            <svg
              className="w-4 h-4 fill-white"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.891 2.891 2.896 2.896 0 0 1-2.892-2.891 2.896 2.896 0 0 1 2.892-2.892c.307 0 .604.05.882.14v-3.53a6.37 6.37 0 0 0-.882-.061C5.834 9.329 3 12.163 3 15.653 3 19.143 5.834 22 9.473 22c3.54 0 6.423-2.79 6.473-6.297V9.458a8.216 8.216 0 0 0 4.643 1.442V7.455a4.83 4.83 0 0 1-1-.769z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                TikTok Shop
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
                Đã nhận diện link
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Đã tạo short link qua chiến dịch ID 749
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="Copy link Affiliate"
          className="flex items-center space-x-1 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 hover:text-rose-500 dark:hover:text-rose-400 transition"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Đã copy</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy link</span>
            </>
          )}
        </button>
      </div>

      {/* 1 Nút to: "Mở TikTok Shop (Nhận mã & Hoàn tiền)" */}
      <button
        type="button"
        onClick={handleOpenTikTok}
        className="w-full py-4 px-5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-extrabold text-base shadow-sm border border-zinc-700/60 active:scale-[0.98] transition-all flex items-center justify-center space-x-2.5 group relative overflow-hidden"
      >
        <ShoppingBag className="w-5 h-5 text-rose-300 transition-transform group-hover:scale-105" />
        <span className="tracking-tight">
          Mở TikTok Shop (Nhận mã &amp; Hoàn tiền)
        </span>
        <Sparkles className="w-4 h-4 text-amber-200" />
      </button>

      {/* Clean URL preview nhỏ gọn */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 text-[11px] text-zinc-400 dark:text-zinc-500 truncate">
        <span>Link gốc: </span>
        <span className="font-mono text-zinc-600 dark:text-zinc-400">{cleanUrl}</span>
      </div>
    </div>
  );
}
