"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Coffee,
  Sparkles,
  Clock,
  RefreshCw,
  Smartphone,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet,
  MessageCircle,
  MapPinOff,
  UtensilsCrossed,
} from "lucide-react";
import FnbDealCard from "@/components/FnbDealCard";
import ScrollToTop from "@/components/ScrollToTop";
import Toast from "@/components/Toast";
import { FnbDealItem, FnbDealsResponse } from "@/types/fnb";
import {
  TCH_CAMPAIGN_INFO,
  getTchSheetDeals,
} from "@/lib/fnb-campaign-data";

/**
 * [Design Read] Family: The Coffee House Modern Warmth & Campaign Digest | Variance: 7/10 | Motion: 4/10 | Density: 8/10 | Accent: TCH Warm Caramel (#b86c28) & Roasted Linen
 */
export default function TchPage() {
  const [deals, setDeals] = useState<FnbDealItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "expiring">("all");
  const [showExcluded, setShowExcluded] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const fetchDeals = async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/fnb-deals?brand=tch${refresh ? "&refresh=true" : ""}`);
      const data: FnbDealsResponse = await res.json();
      if (data.success && Array.isArray(data.deals) && data.deals.length > 0) {
        setDeals(data.deals);
      } else {
        setDeals(getTchSheetDeals("https://thecoffeehouse.com"));
      }
      if (refresh) {
        showToast("Đã đồng bộ ưu đãi The Coffee House mới nhất!");
      }
    } catch (e) {
      console.warn("Lỗi tải deal TCH:", e);
      setDeals(getTchSheetDeals("https://thecoffeehouse.com"));
      showToast("Đang hiển thị danh mục ưu đãi tổng hợp từ Google Sheet");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const filteredDeals = deals.filter((deal) => {
    if (filter === "active") return deal.status === "Đang áp dụng";
    if (filter === "expiring") return deal.status === "Sắp hết hạn";
    return true;
  });

  const tchCategories = [
    "Cà Phê Truyền Thống",
    "Cà Phê Máy",
    "Cà Phê Cold Brew",
    "Dòng Đồ Uống A-Mê",
    "Trà Trái Cây & Hi-Tea",
    "Trà Sữa Macchiato",
    "Thức Uống Đá Xay",
    "Matcha & Sôcôla",
    "Bánh Ăn Nhẹ & Ăn Chơi",
    "Menu Bữa Trưa",
  ];

  return (
    <div className="max-w-md mx-auto min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col relative transition-colors shadow-2xl pb-24">
      {/* Sticky Header với Nút Back */}
      <header className="sticky top-0 z-30 bg-[#a35e21] text-white px-4 py-3.5 shadow-sm flex items-center justify-between border-b border-black/10">
        <div className="flex items-center space-x-3">
          <Link
            href="/"
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition active:scale-95 text-white"
            aria-label="Quay lại trang chủ"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-tch-500 shadow-xs font-bold">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight leading-tight">
                THE COFFEE HOUSE
              </h1>
              <p className="text-[10px] text-white/80 font-medium">
                Chiến dịch ID 756 &bull; Săn Deal Cà Phê Nhà
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => fetchDeals(true)}
          disabled={isLoading}
          title="Làm mới ưu đãi"
          className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 transition active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 space-y-4">
        {/* Banner TCH Tổng Hợp Từ Google Sheet */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8e4f1a] via-[#a35e21] to-[#b86c28] p-5 text-white shadow-sm shadow-amber-950/20 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-white/15 text-white border border-white/20">
              <Smartphone className="w-3 h-3" />
              <span>Giao Hàng &amp; Tại Quán</span>
            </span>

            <span className="text-[10px] text-amber-100 font-mono font-bold">
              Hoa hồng 7.000đ/đơn
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tight leading-snug">
              Bảng Tổng Hợp Mã Ưu Đãi Nhà
            </h2>
            <p className="text-xs text-white/85 leading-relaxed">
              Dữ liệu đồng bộ trực tiếp từ Google Sheet Accesstrade: Giảm 20% đơn từ 90K, Giảm 50K đơn từ 180K, Mua 2 Tặng 1 và FreeShip 30K.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
            <a
              href={TCH_CAMPAIGN_INFO.zaloSupportLink}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white font-bold text-[11px] flex items-center justify-center space-x-1.5 transition active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 text-amber-200" />
              <span>Nhóm Zalo Hỗ Trợ</span>
              <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>

            <a
              href={TCH_CAMPAIGN_INFO.sheetUrl}
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

        {/* BẢNG TỔNG HỢP MENU & ĐIỀU KIỆN (Không cần mở Google Sheet) */}
        <div className="bg-white dark:bg-[#161823] border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-4 space-y-3 shadow-xs">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-tch-500 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">
                Quy Định &amp; Danh Mục Áp Dụng
              </h3>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                Thông tin chuẩn trích xuất từ bảng chiến dịch
              </p>
            </div>
          </div>

          <div className="text-[11px] text-zinc-600 dark:text-zinc-300 space-y-1.5 leading-relaxed bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <p className="flex items-start space-x-1.5">
              <span className="text-tch-500 font-bold">&bull;</span>
              <span><strong>Mức hoa hồng Accesstrade:</strong> 7.000 VNĐ / Voucher kích hoạt thành công.</span>
            </p>
            <p className="flex items-start space-x-1.5">
              <span className="text-tch-500 font-bold">&bull;</span>
              <span><strong>Cách sử dụng:</strong> Copy mã Pos code nhập vào ô Khuyến Mãi trên App The Coffee House hoặc đưa nhân viên quét mã tại quầy thu ngân.</span>
            </p>
            <p className="flex items-start space-x-1.5">
              <span className="text-tch-500 font-bold">&bull;</span>
              <span><strong>Thời hạn áp dụng:</strong> 01/11/2026 &rarr; 30/11/2026. Số lượng ưu đãi có hạn.</span>
            </p>
          </div>

          {/* Accordion 1: Danh mục món áp dụng */}
          <div>
            <button
              type="button"
              onClick={() => setShowCategories(!showCategories)}
              className="w-full py-2 px-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 rounded-2xl text-[11px] font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-1.5">
                <UtensilsCrossed className="w-3.5 h-3.5 text-tch-500" />
                <span>Xem 10 Danh mục món được áp dụng mã</span>
              </div>
              {showCategories ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showCategories && (
              <div className="mt-2 p-3 bg-zinc-50 dark:bg-zinc-900/90 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-[10px] space-y-1.5 text-zinc-600 dark:text-zinc-300 animate-in fade-in duration-150">
                <p className="font-bold text-zinc-800 dark:text-zinc-200 pb-1 border-b border-zinc-200 dark:border-zinc-800">
                  Mã áp dụng cho toàn bộ đồ uống &amp; bánh thuộc các cate:
                </p>
                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  {tchCategories.map((cat, i) => (
                    <div key={i} className="flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-tch-500 shrink-0" />
                      <span className="truncate">{cat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Accordion 2: Cửa hàng ngoại trừ */}
          <div>
            <button
              type="button"
              onClick={() => setShowExcluded(!showExcluded)}
              className="w-full py-2 px-3 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 rounded-2xl text-[11px] font-bold text-zinc-700 dark:text-zinc-300 flex items-center justify-between transition"
            >
              <div className="flex items-center space-x-1.5">
                <MapPinOff className="w-3.5 h-3.5 text-rose-500" />
                <span>Cửa hàng NGOẠI TRỪ (Không áp dụng)</span>
              </div>
              {showExcluded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showExcluded && (
              <div className="mt-2 p-3 bg-zinc-50 dark:bg-zinc-900/90 rounded-2xl border border-zinc-200 dark:border-zinc-800 text-[10px] space-y-1 text-zinc-600 dark:text-zinc-300 animate-in fade-in duration-150">
                <p className="font-bold text-zinc-800 dark:text-zinc-200 pb-1 border-b border-zinc-200 dark:border-zinc-800">
                  Không áp dụng mã tại các chi nhánh sau:
                </p>
                {TCH_CAMPAIGN_INFO.excludedStoresList.map((store, i) => (
                  <div key={i} className="flex items-center space-x-1.5 pt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                    <span>{store}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bộ lọc trạng thái */}
        <div className="flex items-center space-x-1 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-full border border-zinc-200/80 dark:border-zinc-700/80">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 py-1.5 rounded-full text-xs font-black transition-all ${
              filter === "all"
                ? "bg-tch-500 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            Tất cả ({deals.length})
          </button>

          <button
            onClick={() => setFilter("active")}
            className={`flex-1 py-1.5 rounded-full text-xs font-black transition-all ${
              filter === "active"
                ? "bg-tch-500 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            Đang áp dụng
          </button>

          <button
            onClick={() => setFilter("expiring")}
            className={`flex-1 py-1.5 rounded-full text-xs font-black transition-all ${
              filter === "expiring"
                ? "bg-tch-500 text-white shadow-xs"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            Sắp hết hạn
          </button>
        </div>

        {/* Danh sách Deal */}
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
                Chưa có ưu đãi trong mục này
              </p>
              <button
                onClick={() => setFilter("all")}
                className="text-xs font-bold text-tch-500 hover:underline"
              >
                Xem tất cả ưu đãi Nhà
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Back Button */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40">
        <Link
          href="/"
          className="flex items-center space-x-1.5 px-5 py-2.5 rounded-full bg-zinc-900/90 dark:bg-white/95 text-white dark:text-zinc-900 text-xs font-black shadow-xl shadow-black/25 backdrop-blur-md active:scale-95 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về Săn Mã Shopee &bull; TikTok</span>
        </Link>
      </div>

      {/* Nút lướt lên đầu trang */}
      <ScrollToTop bottomClass="bottom-5" />

      <Toast message={toastMessage} />
    </div>
  );
}
