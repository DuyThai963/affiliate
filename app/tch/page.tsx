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
} from "lucide-react";
import FnbDealCard from "@/components/FnbDealCard";
import Toast from "@/components/Toast";
import { FnbDealItem, FnbDealsResponse } from "@/types/fnb";

/**
 * [Design Read] Family: The Coffee House Modern Warmth | Variance: 6/10 | Motion: 4/10 | Density: 8/10 | Accent: TCH Warm Caramel (#b86c28) & Roasted Linen
 */
export default function TchPage() {
  const [deals, setDeals] = useState<FnbDealItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "active" | "expiring">("all");
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
      if (data.success && Array.isArray(data.deals)) {
        setDeals(data.deals);
        if (refresh) {
          showToast("Đã làm mới danh sách ưu đãi The Coffee House!");
        }
      }
    } catch (e) {
      console.warn("Lỗi tải deal TCH:", e);
      showToast("Không thể tải danh sách ưu đãi. Vui lòng thử lại!");
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

  return (
    <div className="max-w-md mx-auto min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col relative transition-colors shadow-2xl pb-12">
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
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-tch-500 shadow-sm font-bold">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight leading-tight">
                THE COFFEE HOUSE
              </h1>
              <p className="text-[10px] text-white/80 font-medium">
                Ưu Đãi App &amp; Săn Deal Cà Phê Nhà
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => fetchDeals(true)}
          disabled={isLoading}
          title="Làm mới ưu đãi"
          className="p-1.5 rounded-lg bg-white/15 hover:bg-white/25 transition active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 space-y-4">
        {/* Banner TCH */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8e4f1a] via-[#a35e21] to-[#b86c28] p-5 text-white shadow-sm shadow-amber-950/15 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-white border border-white/20">
              <Smartphone className="w-3 h-3" />
              <span>Giao Hàng &amp; Tại Quán</span>
            </span>

            <span className="text-[10px] text-white/80 font-mono">
              Campaign ID: 756
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tight leading-snug">
              Mua 2 Tặng 1 &amp; FreeShip 30K
            </h2>
            <p className="text-xs text-white/85 leading-relaxed">
              Trà Đào Cam Sả, Hi-Tea Healthy, CloudFee... Áp dụng đặt món giao tận nơi hoặc thưởng thức trực tiếp tại Nhà.
            </p>
          </div>

          <div className="pt-2 flex items-center space-x-2 text-[11px] text-white/90">
            <div className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-200" />
              <span>Chính Hãng The Coffee House</span>
            </div>
            <span>&bull;</span>
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amber-200" />
              <span>Deal Mới Hàng Tuần</span>
            </div>
          </div>
        </div>

        {/* Bộ lọc trạng thái */}
        <div className="flex items-center space-x-1 p-1 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-xl">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === "all"
                ? "bg-white dark:bg-zinc-900 text-tch-500 dark:text-amber-300 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            Tất cả ({deals.length})
          </button>

          <button
            onClick={() => setFilter("active")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === "active"
                ? "bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            Đang áp dụng
          </button>

          <button
            onClick={() => setFilter("expiring")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === "expiring"
                ? "bg-white dark:bg-zinc-900 text-rose-600 dark:text-rose-400 shadow-sm"
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
                  className="h-32 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl animate-pulse"
                />
              ))}
            </div>
          ) : filteredDeals.length > 0 ? (
            filteredDeals.map((deal) => (
              <FnbDealCard
                key={deal.id}
                deal={deal}
                onShowToast={showToast}
              />
            ))
          ) : (
            <div className="p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-center space-y-2">
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
          className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-zinc-900/90 dark:bg-zinc-100/90 text-white dark:text-zinc-900 text-xs font-bold shadow-xl shadow-black/25 backdrop-blur-md active:scale-95 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Về Săn Mã Shopee / TikTok</span>
        </Link>
      </div>

      <Toast message={toastMessage} />
    </div>
  );
}
