"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Share2,
  Copy,
  Check,
  ShoppingBag,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { FbFunnelResponse } from "@/types/voucher";

interface QuickActionBarProps {
  affiliateLink: string;
  cleanUrl: string;
  onShowToast: (message: string) => void;
}

/**
 * [Design Read] Family: TikTok-Tactile Quick Action Bar | Variance: 6/10 | Motion: 4/10 | Density: 8/10 | Accent: Terracotta (#d96947) & Denim (#335384) with TikTok Geometry
 */
export default function QuickActionBar({
  affiliateLink,
  cleanUrl,
  onShowToast,
}: QuickActionBarProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isFbLoading, setIsFbLoading] = useState(false);
  const [fbError, setFbError] = useState<string | null>(null);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(affiliateLink);
      setIsCopied(true);
      onShowToast("Đã copy link Affiliate Shopee!");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      onShowToast("Không thể sao chép link.");
    }
  };

  const handleOpenShopee = () => {
    if (!affiliateLink) return;
    // Mở link affiliate tab mới
    window.open(affiliateLink, "_blank", "noopener,noreferrer");
  };

  const handleFbFunnel = async () => {
    if (!affiliateLink) return;
    setIsFbLoading(true);
    setFbError(null);

    try {
      const response = await fetch("/api/fb-funnel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ affiliateLink }),
      });

      const data: FbFunnelResponse = await response.json();

      if (!response.ok || !data.success || !data.fbCommentUrl) {
        throw new Error(
          data.error ||
            "Chưa cấu hình tài khoản Fanpage Facebook trong .env.local"
        );
      }

      onShowToast("Đã kích hoạt bình luận Facebook! Đang chuyển hướng...");
      // Mở link comment Facebook trong tab mới
      window.open(data.fbCommentUrl, "_blank", "noopener,noreferrer");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Lỗi khi kích hoạt phễu Facebook.";
      setFbError(msg);
      onShowToast(msg);
    } finally {
      setIsFbLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#161823] border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-4 shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-black text-zinc-900 dark:text-white">
            Link Affiliate Đã Sẵn Sàng
          </span>
        </div>

        <button
          onClick={handleCopyLink}
          className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
        >
          {isCopied ? (
            <>
              <Check className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">
                Đã chép
              </span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy link</span>
            </>
          )}
        </button>
      </div>

      {/* Grid 2 nút chuyển đổi chính */}
      <div className="grid grid-cols-2 gap-2">
        {/* Nút 1: Mở Shopee ngay */}
        <button
          type="button"
          onClick={handleOpenShopee}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-shopee-500 hover:bg-shopee-600 text-white shadow-sm shadow-shopee-500/15 active:scale-[0.98] transition group"
        >
          <div className="flex items-center space-x-1.5 mb-1 font-bold text-xs sm:text-sm">
            <ShoppingBag className="w-4 h-4 transition-transform group-hover:scale-105" />
            <span>Mở Shopee Ngay</span>
          </div>
          <span className="text-[10px] text-white/85 font-normal">
            App Shopee &amp; Web
          </span>
        </button>

        {/* Nút 2: Mở qua Facebook */}
        <button
          type="button"
          onClick={handleFbFunnel}
          disabled={isFbLoading}
          className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#335384] hover:bg-[#2b4670] text-white shadow-sm shadow-slate-900/10 active:scale-[0.98] transition disabled:opacity-70 group border border-white/10"
        >
          <div className="flex items-center space-x-1.5 mb-1 font-bold text-xs sm:text-sm">
            {isFbLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <svg className="w-4 h-4 fill-white shrink-0" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            )}
            <span>Mở qua Facebook</span>
          </div>
          <span className="text-[10px] text-white/85 font-normal flex items-center space-x-0.5">
            <Sparkles className="w-2.5 h-2.5 text-amber-200" />
            <span>Săn mã 20% độc quyền</span>
          </span>
        </button>
      </div>

      {fbError && (
        <div className="flex items-start space-x-1.5 p-2 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 rounded-lg text-[11px] text-amber-800 dark:text-amber-300">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <p className="leading-tight">{fbError}</p>
        </div>
      )}
    </div>
  );
}
