"use client";

import React, { useState } from "react";
import {
  Copy,
  Check,
  Tag,
  Clock,
  ExternalLink,
  Flame,
  Info,
  ChevronDown,
  ChevronUp,
  Bookmark,
  ShoppingBag,
} from "lucide-react";
import { VoucherItem } from "@/types/voucher";

interface VoucherCardProps {
  voucher: VoucherItem;
  defaultAffiliateLink: string;
  isUpcoming?: boolean;
  onShowToast: (message: string) => void;
}

/**
 * [Design Read] Family: Tactile Pastel Commerce Ticket | Variance: 6/10 | Motion: 4/10 | Density: 8/10 | Accent: Pastel Terracotta (#d96947) & Warm Amber
 */
export default function VoucherCard({
  voucher,
  defaultAffiliateLink,
  isUpcoming = false,
  onShowToast,
}: VoucherCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const targetLink =
    voucher.affLink || defaultAffiliateLink || "https://shopee.vn";

  // Xử lý sao chép mã
  const handleCopyCode = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!voucher.code) return;

    try {
      await navigator.clipboard.writeText(voucher.code);
      setIsCopied(true);
      onShowToast(`Đã copy mã "${voucher.code}" vào bộ nhớ tạm!`);
      setTimeout(() => setIsCopied(false), 2200);
    } catch {
      onShowToast("Không thể sao chép mã. Vui lòng thử lại!");
    }
  };

  // Nút "Dùng ngay" -> Copy mã (nếu có) và mở link Shopee
  const handleUseNow = async () => {
    if (voucher.code) {
      try {
        await navigator.clipboard.writeText(voucher.code);
        setIsCopied(true);
      } catch {
        // ignore
      }
    }

    onShowToast(
      voucher.code
        ? `Đã copy mã "${voucher.code}"! Đang mở Shopee...`
        : "Đang mở Shopee..."
    );

    setTimeout(() => {
      window.open(targetLink, "_blank", "noopener,noreferrer");
      setTimeout(() => setIsCopied(false), 2000);
    }, 350);
  };

  const handleSaveBannerVoucher = () => {
    const bannerUrl = voucher.bannerUrl || targetLink;
    window.open(bannerUrl, "_blank", "noopener,noreferrer");
  };

  // Tính đếm ngược thời gian còn lại (end_time hoặc start_time)
  const getRemainingTimeText = () => {
    const now = Date.now();

    // Nếu là mã sắp diễn ra
    if (isUpcoming && voucher.startTime) {
      try {
        const start = new Date(voucher.startTime).getTime();
        const diffMs = start - now;
        if (diffMs > 0) {
          const hours = Math.floor(diffMs / 3600000);
          const minutes = Math.floor((diffMs % 3600000) / 60000);
          if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `Mở sau ${days} ngày nữa`;
          }
          if (hours > 0) {
            return `Mở sau ${hours} giờ ${minutes}p`;
          }
          return `Mở sau ${minutes} phút`;
        }
      } catch {
        // fallback
      }
    }

    // Thời gian hết hạn
    if (!voucher.endTime) return "còn 12 giờ nữa";
    try {
      const end = new Date(voucher.endTime).getTime();
      const diffMs = end - now;
      if (diffMs <= 0) return "Đã hết hạn";

      const hours = Math.floor(diffMs / 3600000);
      const minutes = Math.floor((diffMs % 3600000) / 60000);

      if (hours >= 24) {
        const days = Math.floor(hours / 24);
        return `còn ${days} ngày nữa`;
      }
      if (hours > 0) {
        return `còn ${hours} giờ nữa`;
      }
      return `còn ${minutes} phút nữa`;
    } catch {
      return "còn 14 giờ nữa";
    }
  };

  const percent = voucher.percentageUsed ?? 0;
  const remainingTimeStr = getRemainingTimeText();

  // Tiêu đề ưu đãi nổi bật
  const renderOfferTitle = () => {
    const discount = voucher.discountValue || "Ưu đãi";
    const minSpend = voucher.minSpend ? `Đơn tối thiểu ${voucher.minSpend}` : "Đơn 0đ";
    return (
      <span className="text-zinc-900 dark:text-zinc-100 font-bold text-xs sm:text-[13px] leading-snug">
        <span className="text-shopee-600 dark:text-shopee-400 font-extrabold mr-1">
          {discount}
        </span>
        <span className="text-zinc-700 dark:text-zinc-300 font-medium">
          {minSpend}
        </span>
      </span>
    );
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col">
      {/* Khối chính: 3 cột (Logo Shopee - Nội dung & Progress bar - Nút hành động) */}
      <div className="p-3.5 flex items-stretch space-x-3">
        {/* Cột 1: Logo Shopee hoặc TikTok Shop */}
        {voucher.platform === "tiktok" ? (
          <div className="w-16 sm:w-20 shrink-0 bg-black rounded-xl flex flex-col items-center justify-center p-2 text-white shadow-sm shadow-black/40">
            <svg
              className="w-5 h-5 fill-white mb-1"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.891 2.891 2.896 2.896 0 0 1-2.892-2.891 2.896 2.896 0 0 1 2.892-2.892c.307 0 .604.05.882.14v-3.53a6.37 6.37 0 0 0-.882-.061C5.834 9.329 3 12.163 3 15.653 3 19.143 5.834 22 9.473 22c3.54 0 6.423-2.79 6.473-6.297V9.458a8.216 8.216 0 0 0 4.643 1.442V7.455a4.83 4.83 0 0 1-1-.769z" />
            </svg>
            <span className="text-[9px] font-black tracking-tight uppercase">
              TikTok
            </span>
          </div>
        ) : (
          <div className="w-16 sm:w-20 shrink-0 bg-shopee-500 rounded-xl flex flex-col items-center justify-center p-2 text-white shadow-sm shadow-shopee-500/15">
            <ShoppingBag className="w-6 h-6 stroke-[2.2] mb-1" />
            <span className="text-[10px] font-black tracking-tight uppercase">
              Shopee
            </span>
          </div>
        )}

        {/* Cột 2: Nội dung voucher + Metadata + Progress bar */}
        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
          <div>
            {/* Tag loại ưu đãi & Badge sắp diễn ra */}
            <div className="flex items-center space-x-1.5 mb-1 flex-wrap gap-y-1">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                {isUpcoming ? "Sắp diễn ra" : "Giảm giá"}
              </span>

              {voucher.code && (
                <span className="font-mono text-[10px] font-bold text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700">
                  {voucher.code}
                </span>
              )}
            </div>

            {/* Tiêu đề ưu đãi */}
            <div className="line-clamp-2 mb-1.5">
              {renderOfferTitle()}
            </div>
          </div>

          {/* Metadata & Progress bar */}
          <div className="space-y-1 mt-auto">
            {/* Thanh tiến độ pastel dịu mắt */}
            <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-300 via-orange-300 to-rose-400 transition-all duration-500"
                style={{ width: `${Math.max(5, isUpcoming ? 10 : percent)}%` }}
              />
            </div>

            {/* Text Đã dùng % - còn X giờ nữa */}
            <div className="flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400 pt-0.5">
              <div className="flex items-center space-x-1 truncate">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-shopee-500 shrink-0" />
                <span className="truncate">
                  {isUpcoming
                    ? remainingTimeStr
                    : `Đã dùng ${percent}% - ${remainingTimeStr}`}
                </span>
              </div>

              {/* Nút Chi tiết */}
              <button
                type="button"
                onClick={() => setShowDetail(!showDetail)}
                className="text-shopee-600 dark:text-shopee-400 font-semibold hover:underline flex items-center space-x-0.5 shrink-0 ml-1"
              >
                <Info className="w-2.5 h-2.5" />
                <span>Chi tiết</span>
                {showDetail ? (
                  <ChevronUp className="w-2.5 h-2.5" />
                ) : (
                  <ChevronDown className="w-2.5 h-2.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Cột 3: Nút Copy & Nút Dùng ngay */}
        <div className="w-20 sm:w-24 shrink-0 flex flex-col justify-between space-y-1.5">
          {voucher.code ? (
            <>
              {/* Nút Copy */}
              <button
                type="button"
                onClick={handleCopyCode}
                className="w-full py-1.5 px-2 rounded-lg bg-orange-50/80 dark:bg-orange-950/40 hover:bg-orange-100/80 dark:hover:bg-orange-900/50 border border-orange-200/70 dark:border-orange-800/60 text-shopee-600 dark:text-shopee-400 font-bold text-[11px] flex items-center justify-center space-x-1 active:scale-95 transition"
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
                    <span>Copy</span>
                  </>
                )}
              </button>

              {/* Nút Dùng ngay */}
              <button
                type="button"
                onClick={handleUseNow}
                className="w-full py-1.5 px-2 rounded-lg bg-shopee-500 hover:bg-shopee-600 text-white font-bold text-[11px] shadow-sm shadow-shopee-500/15 flex items-center justify-center space-x-1 active:scale-95 transition"
              >
                <ShoppingBag className="w-3 h-3" />
                <span>Dùng ngay</span>
              </button>
            </>
          ) : (
            /* Trường hợp mã thu thập trên sàn (TikTok Shop hoặc Shopee Banner) */
            voucher.platform === "tiktok" ? (
              <button
                type="button"
                onClick={handleSaveBannerVoucher}
                className="h-full w-full py-2 px-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-[10px] flex flex-col items-center justify-center space-y-1 active:scale-95 transition border border-zinc-700/60 shadow-sm"
              >
                <svg
                  className="w-4 h-4 fill-white"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-2.891 2.891 2.896 2.896 0 0 1-2.892-2.891 2.896 2.896 0 0 1 2.892-2.892c.307 0 .604.05.882.14v-3.53a6.37 6.37 0 0 0-.882-.061C5.834 9.329 3 12.163 3 15.653 3 19.143 5.834 22 9.473 22c3.54 0 6.423-2.79 6.473-6.297V9.458a8.216 8.216 0 0 0 4.643 1.442V7.455a4.83 4.83 0 0 1-1-.769z" />
                </svg>
                <span>Nhận mã</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveBannerVoucher}
                className="h-full w-full py-2 px-2 rounded-lg bg-amber-600/90 hover:bg-amber-600 text-white font-bold text-[11px] flex flex-col items-center justify-center space-y-1 active:scale-95 transition"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Lưu mã</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Accordion Chi tiết điều kiện voucher */}
      {showDetail && (
        <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-800/50 border-t border-dashed border-zinc-200 dark:border-zinc-800 text-[11px] text-zinc-600 dark:text-zinc-300 space-y-1 animate-in fade-in duration-200">
          <p className="font-semibold text-zinc-800 dark:text-zinc-200">
            {voucher.name}
          </p>
          {voucher.description && (
            <p className="leading-relaxed">{voucher.description}</p>
          )}
          <div className="flex items-center space-x-2 text-zinc-500 dark:text-zinc-400 pt-0.5">
            <Clock className="w-3 h-3" />
            <span>
              {voucher.endTime
                ? `Hạn dùng: ${new Date(voucher.endTime).toLocaleString("vi-VN")}`
                : "Hạn dùng: Theo quy định sàn"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
