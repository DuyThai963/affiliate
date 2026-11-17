"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Coffee,
  Sparkles,
  Clock,
  RefreshCw,
  QrCode,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileSpreadsheet,
  MessageCircle,
  MapPinOff,
} from "lucide-react";
import FnbDealCard from "@/components/FnbDealCard";
import Toast from "@/components/Toast";
import { FnbDealItem, FnbDealsResponse } from "@/types/fnb";
import {
  HIGHLANDS_CAMPAIGN_INFO,
  getHighlandsSheetDeals,
} from "@/lib/fnb-campaign-data";

/**
 * [Design Read] Family: Highlands Brand Editorial & Campaign Digest | Variance: 7/10 | Motion: 4/10 | Density: 8/10 | Accent: Highlands Burgundy (#982b32) & Warm Linen
 */
export default function HighlandsPage() {
  const [deals, setDeals] = useState<FnbDealItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "bogo" | "discount" | "big">("all");
  const [showExcluded, setShowExcluded] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const fetchDeals = async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/fnb-deals?brand=highlands${refresh ? "&refresh=true" : ""}`);
      const data: FnbDealsResponse = await res.json();
      if (data.success && Array.isArray(data.deals) && data.deals.length > 0) {
        setDeals(data.deals);
      } else {
        // Fallback danh sách 8 deal chính xác từ Google Sheet
        setDeals(getHighlandsSheetDeals("https://zalo.me"));
      }
      if (refresh) {
        showToast("Đã đồng bộ dữ liệu mới nhất từ Accesstrade!");
      }
    } catch (e) {
      console.warn("Lỗi tải deal Highlands:", e);
      setDeals(getHighlandsSheetDeals("https://zalo.me"));
      showToast("Đang hiển thị danh mục ưu đãi tổng hợp từ Google Sheet");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const filteredDeals = deals.filter((deal) => {
    if (filterType === "bogo") {
      return (
        deal.title.toLowerCase().includes("tặng") ||
        deal.title.toLowerCase().includes("mua 1") ||
        deal.title.toLowerCase().includes("mua 2")
      );
    }
    if (filterType === "discount") {
      return (
        deal.title.toLowerCase().includes("giảm 30k") ||
        deal.title.toLowerCase().includes("giảm 40k") ||
        deal.title.toLowerCase().includes("giảm 50k") ||
        deal.title.toLowerCase().includes("giảm 65k")
      );
    }
    if (filterType === "big") {
      return deal.title.toLowerCase().includes("500k") || deal.title.toLowerCase().includes("20%");
    }
    return true;
  });

  return (
    <div className="max-w-md mx-auto min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col relative transition-colors shadow-2xl pb-24">
      {/* Sticky Header với Nút Back */}
      <header className="sticky top-0 z-30 bg-[#8c252c] text-white px-4 py-3.5 shadow-sm flex items-center justify-between border-b border-black/10">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition active:scale-95 text-white"
            aria-label="Quay lại trang chủ"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-highlands-500 shadow-xs font-bold">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight leading-tight">
                HIGHLANDS COFFEE
              </h1>
              <p className="text-[10px] text-white/80 font-medium">
                Chiến dịch ID 774 &bull; Zalo Mini App
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => fetchDeals(true)}
          disabled={isLoading}
          title="Làm mới ưu đãi"
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 space-y-4">
        {/* Banner Tổng Hợp Chiến Dịch Từ Google Sheet */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#741d23] via-[#8c252c] to-[#982b32] p-5 text-white shadow-sm shadow-rose-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white/15 text-white border border-white/20">
              <QrCode className="w-3 h-3" />
              <span>Zalo Redeem Siêu Tiện</span>
            </span>

            <span className="text-[10px] text-amber-200 font-mono font-bold">
              8 Scheme Ưu Đãi
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tight leading-snug">
              Bảng Tổng Hợp Mã Ưu Đãi Highlands
            </h2>
            <p className="text-xs text-white/85 leading-relaxed">
              Dữ liệu đồng bộ trực tiếp từ Google Sheet Accesstrade: Mua 1 Tặng 1, Mua 2 Tặng 1, Giảm 30K - 65K và Giảm 20% đơn lớn.
            </p>
          </div>

          {/* Quick Action Buttons: Nhóm Zalo & Sheet Gốc */}
          <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
            <a
              href={HIGHLANDS_CAMPAIGN_INFO.zaloSupportLink}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-[11px] flex items-center justify-center space-x-1.5 transition active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 text-amber-300" />
              <span>Nhóm Zalo Hỗ Trợ</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>

            <a
              href={HIGHLANDS_CAMPAIGN_INFO.sheetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-[11px] flex items-center justify-center space-x-1.5 transition active:scale-95"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
              <span>Google Sheet Gốc</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>
          </div>
        </div>

        {/* BẢNG TỔNG HỢP QUY ĐỊNH & ĐIỂM NGOẠI TRỪ (Để người dùng không phải tự mở Sheet tra cứu) */}
        <div className="bg-white dark:bg-[#161823] border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-highlands-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">
                Quy Định Áp Dụng Từ Accesstrade
              </h3>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                Lưu ý quan trọng khi mang mã ra quầy Highlands
              </p>
            </div>
          </div>

          <div className="text-[11px] text-zinc-600 dark:text-zinc-300 space-y-1.5 leading-relaxed bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <p className="flex items-start space-x-1.5">
              <span className="text-highlands-500 font-bold">&bull;</span>
              <span><strong>Cách đổi:</strong> Bấm link nhận ưu đãi &rarr; Lưu vào ví Zalo &rarr; Xuất trình mã QR tại quầy thu ngân.</span>
            </p>
            <p className="flex items-start space-x-1.5">
              <span className="text-highlands-500 font-bold">&bull;</span>
              <span><strong>Mỗi hóa đơn:</strong> Mỗi mã chỉ sử dụng 01 lần và áp dụng trên 01 hóa đơn. Có thể trả thêm tiền để nâng size hoặc thêm topping.</span>
            </p>
            <p className="flex items-start space-x-1.5 text-rose-600 dark:text-rose-400 font-semibold">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>Không áp dụng vào các ngày Lễ, Tết. Không áp dụng cùng CTKM khác.</span>
            </p>
          </div>

          {/* Accordion Điểm Ngoại Trừ */}
          <div>
            <button
              type="button"
              onClick={() => setShowExcluded(!showExcluded)}
              className="w-full py-2 px-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 rounded-2xl text-[11px] font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-1.5">
                <MapPinOff className="w-3.5 h-3.5 text-rose-500" />
                <span>Danh sách cửa hàng NGOẠI TRỪ ({HIGHLANDS_CAMPAIGN_INFO.excludedStoresList.length} điểm)</span>
              </div>
              {showExcluded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showExcluded && (
              <div className="mt-2 p-3 bg-zinc-50 dark:bg-zinc-900/90 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-[10px] space-y-1 text-zinc-600 dark:text-zinc-300 animate-in fade-in duration-150">
                <p className="font-bold text-zinc-800 dark:text-zinc-200 pb-1 border-b border-zinc-200 dark:border-zinc-800">
                  Không áp dụng mã khuyến mãi tại các điểm sau:
                </p>
                <div className="grid grid-cols-1 gap-1 pt-1">
                  {HIGHLANDS_CAMPAIGN_INFO.excludedStoresList.map((store, i) => (
                    <div key={i} className="flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                      <span>{store}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BỘ LỌC SCHEME ƯU ĐÃI (Pill Selector) */}
        <div className="flex items-center space-x-1 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-full border border-zinc-200/80 dark:border-zinc-700/80">
          <button
            onClick={() => setFilterType("all")}
            className={`flex-1 py-1.5 rounded-full text-xs font-black transition-all ${
              filterType === "all"
                ? "bg-highlands-500 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            Tất cả ({deals.length})
          </button>

          <button
            onClick={() => setFilterType("bogo")}
            className={`flex-1 py-1.5 rounded-full text-xs font-black transition-all ${
              filterType === "bogo"
                ? "bg-highlands-500 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            Tặng Ly
          </button>

          <button
            onClick={() => setFilterType("discount")}
            className={`flex-1 py-1.5 rounded-full text-xs font-black transition-all ${
              filterType === "discount"
                ? "bg-highlands-500 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            Giảm 30K-65K
          </button>

          <button
            onClick={() => setFilterType("big")}
            className={`flex-1 py-1.5 rounded-full text-xs font-black transition-all ${
              filterType === "big"
                ? "bg-highlands-500 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            Đơn 500K
          </button>
        </div>

        {/* Danh sách Ưu đãi Highlands */}
        <div className="space-y-3 pt-1">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-36 bg-white dark:bg-[#161823] border border-zinc-200 dark:border-zinc-800 rounded-3xl animate-pulse"
                />
              ))}
            </div>
          ) : filteredDeals.length > 0 ? (
            filteredDeals.map((deal, idx) => (
              <FnbDealCard
                key={`${deal.id}-${idx}`}
                deal={deal}
                onShowToast={showToast}
              />
            ))
          ) : (
            <div className="p-6 bg-white dark:bg-[#161823] border border-zinc-200 dark:border-zinc-800 rounded-3xl text-center space-y-2">
              <Coffee className="w-8 h-8 text-zinc-400 mx-auto" />
              <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Chưa có ưu đãi trong nhóm này
              </p>
              <button
                onClick={() => setFilterType("all")}
                className="text-xs font-bold text-highlands-500 hover:underline"
              >
                Xem tất cả 8 ưu đãi Highlands
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Back Button ở góc dưới */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40">
        <Link
          href="/"
          className="flex items-center space-x-1.5 px-5 py-2.5 rounded-full bg-zinc-900/90 dark:bg-white/95 text-white dark:text-zinc-900 text-xs font-black shadow-xl shadow-black/25 backdrop-blur-md active:scale-95 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về Săn Mã Shopee &bull; TikTok</span>
        </Link>
      </div>

      <Toast message={toastMessage} />
    </div>
  );
}
