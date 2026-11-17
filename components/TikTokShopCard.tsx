"use client";

import React, { useState } from "react";
import { Copy, Check, Sparkles, ShoppingBag } from "lucide-react";

interface TikTokShopCardProps {
  affiliateLink: string;
  cleanUrl: string;
  onShowToast: (message: string) => void;
}

/**
 * [Design Read] Family: TikTok Shop Live Ticket Card | Variance: 7/10 | Motion: 4/10 | Density: 8/10 | Accent: TikTok Red (#fe2c55) & Sleek Pill CTA
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
    <div className="bg-white dark:bg-[#161823] border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-4.5 shadow-sm space-y-3.5 transition-all">
      {/* Platform Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          {/* TikTok Icon */}
          <div className="w-8 h-8 rounded-xl bg-black flex items-center justify-center text-white shadow-xs">
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
              <span className="font-black text-sm text-zinc-900 dark:text-white">
                TikTok Shop
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-tiktok-red/10 text-tiktok-red border border-tiktok-red/20">
                ĐÃ NHẬN DIỆN
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Chiến dịch ID 749 &bull; Tự động áp dụng giá tốt
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyLink}
          aria-label="Copy link Affiliate"
          className="flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
        >
          {isCopied ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">Đã chép</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy link</span>
            </>
          )}
        </button>
      </div>

      {/* Perks Badge Pill */}
      <div className="p-2.5 bg-zinc-50 dark:bg-zinc-900/80 rounded-2xl border border-zinc-100 dark:border-zinc-800/80 text-[11px] text-zinc-600 dark:text-zinc-300 flex items-center justify-between">
        <div className="flex items-center space-x-1.5 font-bold text-zinc-800 dark:text-zinc-200">
          <Sparkles className="w-3.5 h-3.5 text-tiktok-red" />
          <span>Ưu đãi áp dụng tự động:</span>
        </div>
        <span className="text-[10px] text-tiktok-red font-black">
          FreeShip Xtra &bull; Hoàn tiền
        </span>
      </div>

      {/* 1 Nút to: TikTok Signature Red Pill Button */}
      <button
        type="button"
        onClick={handleOpenTikTok}
        className="w-full py-3.5 px-5 rounded-full bg-tiktok-red hover:bg-tiktok-redHover text-white font-black text-sm shadow-md shadow-tiktok-red/25 active:scale-[0.98] transition-all flex items-center justify-center space-x-2"
      >
        <ShoppingBag className="w-4 h-4 text-white" />
        <span className="tracking-tight">
          Mở TikTok Shop (Nhận mã &amp; Mua hàng)
        </span>
      </button>

      {/* Clean URL preview */}
      <div className="pt-1 text-[11px] text-zinc-400 dark:text-zinc-500 truncate text-center">
        <span className="font-mono text-[10px] text-zinc-500">{cleanUrl}</span>
      </div>
    </div>
  );
}
