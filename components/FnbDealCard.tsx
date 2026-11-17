"use client";

import React, { useState } from "react";
import {
  Coffee,
  Clock,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Flame,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import { FnbDealItem } from "@/types/fnb";

interface FnbDealCardProps {
  deal: FnbDealItem;
  onShowToast: (message: string) => void;
}

/**
 * [Design Read] Family: Editorial Tactile F&B Ticket | Variance: 7/10 | Motion: 5/10 | Density: 8/10 | Accent: Highlands Crimson (#b31f24) & TCH Amber (#e57920)
 */
export default function FnbDealCard({ deal, onShowToast }: FnbDealCardProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const isHighlands = deal.brand === "highlands";

  const handleCopyCode = async () => {
    if (!deal.couponCode) return;
    try {
      await navigator.clipboard.writeText(deal.couponCode);
      setIsCopied(true);
      onShowToast(`Đã sao chép mã "${deal.couponCode}"!`);
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      onShowToast("Không thể sao chép mã. Vui lòng thử lại!");
    }
  };

  const handleAction = async () => {
    if (deal.couponCode) {
      try {
        await navigator.clipboard.writeText(deal.couponCode);
        setIsCopied(true);
      } catch {
        // ignore
      }
      onShowToast(`Đã copy mã "${deal.couponCode}"! Đang chuyển hướng...`);
    } else {
      onShowToast(
        isHighlands
          ? "Đang mở trang nhận ưu đãi Zalo..."
          : "Đang mở ưu đãi The Coffee House..."
      );
    }

    setTimeout(() => {
      window.open(deal.actionUrl, "_blank", "noopener,noreferrer");
      setTimeout(() => setIsCopied(false), 2000);
    }, 350);
  };

  // Badge màu trạng thái
  const getStatusBadge = () => {
    switch (deal.status) {
      case "Sắp hết hạn":
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60 animate-pulse">
            <Flame className="w-2.5 h-2.5 fill-rose-500" />
            <span>Sắp hết hạn</span>
          </span>
        );
      case "Sắp diễn ra":
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
            <Clock className="w-2.5 h-2.5" />
            <span>Sắp diễn ra</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>Đang áp dụng</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-4 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between space-y-3 group">
      {/* Header card: Thương hiệu & Trạng thái */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Badge Thương hiệu */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center text-white font-bold shadow-sm ${
                isHighlands
                  ? "bg-[#b31f24] shadow-rose-950/20"
                  : "bg-[#e57920] shadow-amber-950/20"
              }`}
            >
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <span
                className={`text-[11px] font-black uppercase tracking-wider ${
                  isHighlands
                    ? "text-[#b31f24] dark:text-rose-400"
                    : "text-[#e57920] dark:text-amber-400"
                }`}
              >
                {deal.brandName}
              </span>
            </div>
          </div>

          {/* Trạng thái deal */}
          {getStatusBadge()}
        </div>

        {/* Tiêu đề ưu đãi & Giá trị giảm */}
        <div className="space-y-1">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-shopee-600 dark:group-hover:text-amber-400 transition-colors">
              {deal.title}
            </h4>
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
            {deal.description}
          </p>
        </div>

        {/* Khung giờ vàng / Thời gian áp dụng */}
        <div className="mt-2.5 p-2 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl text-[11px] text-zinc-600 dark:text-zinc-300 space-y-1 border border-zinc-100 dark:border-zinc-800">
          {deal.timeSlot && (
            <div className="flex items-center space-x-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Khung giờ: <strong className="text-zinc-800 dark:text-zinc-200">{deal.timeSlot}</strong></span>
            </div>
          )}

          {deal.minSpend && (
            <div className="flex items-center space-x-1.5 text-zinc-500 dark:text-zinc-400">
              <Sparkles className="w-3 h-3 text-shopee-500 shrink-0" />
              <span>Điều kiện: {deal.minSpend}</span>
            </div>
          )}
        </div>
      </div>

      {/* Hành động dưới đáy: Code + Nút Action */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2">
        <div className="flex items-center space-x-2">
          {deal.couponCode ? (
            /* Có coupon code: Hộp code + Nút Copy & Mở App */
            <>
              <div className="flex-1 bg-zinc-50 dark:bg-zinc-800/80 border border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl px-2.5 py-2 flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-zinc-800 dark:text-zinc-200 select-all truncate">
                  {deal.couponCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  aria-label="Copy mã"
                  className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition ml-1"
                >
                  {isCopied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleAction}
                className={`px-3.5 py-2 rounded-xl text-white font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center space-x-1 shrink-0 ${
                  isHighlands
                    ? "bg-[#b31f24] hover:bg-[#97191e] shadow-rose-950/20"
                    : "bg-[#e57920] hover:bg-[#ca6816] shadow-amber-950/20"
                }`}
              >
                <span>Dùng ngay</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </button>
            </>
          ) : (
            /* Không có code (Redeem Zalo / Trợ giá tự động): Nút Nhận ưu đãi lớn */
            <button
              type="button"
              onClick={handleAction}
              className={`w-full py-2.5 px-4 rounded-xl text-white font-extrabold text-xs shadow-sm active:scale-95 transition-all flex items-center justify-center space-x-1.5 ${
                isHighlands
                  ? "bg-gradient-to-r from-[#b31f24] to-[#c7272d] hover:opacity-95 shadow-rose-900/20"
                  : "bg-gradient-to-r from-[#e57920] to-[#f38d38] hover:opacity-95 shadow-amber-900/20"
              }`}
            >
              <span>{isHighlands ? "Nhận Ưu Đãi Zalo Ngay" : "Nhận Ưu Đãi Tại Quán"}</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </button>
          )}
        </div>

        {/* Nút xem hướng dẫn redeem */}
        {deal.redeemGuide && (
          <div>
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center space-x-1 transition font-medium"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Cách nhận &amp; áp dụng mã</span>
              {showGuide ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {showGuide && (
              <div className="mt-1.5 p-2 bg-amber-50/70 dark:bg-amber-950/30 rounded-lg border border-amber-200/60 dark:border-amber-900/50 text-[10px] text-amber-900 dark:text-amber-300 leading-relaxed animate-in fade-in duration-150">
                {deal.redeemGuide}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
