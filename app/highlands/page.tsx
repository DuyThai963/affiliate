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
  Flame,
} from "lucide-react";
import FnbDealCard from "@/components/FnbDealCard";
import Toast from "@/components/Toast";
import { FnbDealItem, FnbDealsResponse } from "@/types/fnb";

/**
 * [Design Read] Family: Highlands Brand Editorial | Variance: 6/10 | Motion: 4/10 | Density: 8/10 | Accent: Highlands Burgundy (#982b32) & Warm Linen
 */
export default function HighlandsPage() {
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
      const res = await fetch(`/api/fnb-deals?brand=highlands${refresh ? "&refresh=true" : ""}`);
      const data: FnbDealsResponse = await res.json();
      if (data.success && Array.isArray(data.deals)) {
        setDeals(data.deals);
        if (refresh) {
          showToast("Đã làm mới danh sách ưu đãi Highlands Coffee!");
        }
      }
    } catch (e) {
      console.warn("Lỗi tải deal Highlands:", e);
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
      {/* Sticky Header với Nút Back quay về Home */}
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
            <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-highlands-500 shadow-sm font-bold">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight leading-tight">
                HIGHLANDS COFFEE
              </h1>
              <p className="text-[10px] text-white/80 font-medium">
                Săn Deal &amp; Redeem Zalo Mini App
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => fetchDeals(true)}
          disabled={isLoading}
          title="Làm mới ưu đãi"
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 space-y-4">
        {/* Banner Highlands Zalo Mini App */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#741d23] via-[#8c252c] to-[#982b32] p-5 text-white shadow-sm shadow-rose-950/15 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/15 text-white border border-white/20">
              <QrCode className="w-3 h-3" />
              <span>Zalo Redeem Siêu Tiện</span>
            </span>

            <span className="text-[10px] text-white/80 font-mono">
              Campaign ID: 774
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tight leading-snug">
              Mua 1 Tặng 1 &amp; Ưu Đãi Giảm 30K
            </h2>
            <p className="text-xs text-white/85 leading-relaxed">
              Trà Sen Vàng, Freeze Trà Xanh, Phin Sữa Đá... Lưu mã trực tiếp vào ví Zalo và quét mã tại quầy thu ngân.
            </p>
          </div>

          <div className="pt-2 flex items-center space-x-2 text-[11px] text-white/90">
            <div className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Chính Hãng Highlands</span>
            </div>
            <span>&bull;</span>
            <div className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>Cập nhật liên tục</span>
            </div>
          </div>
        </div>

        {/* 3 Bước Hướng dẫn nhanh */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl p-4 space-y-2.5">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-highlands-500" />
            <span>Cách đổi mã tại quầy Highlands Coffee</span>
          </h3>

          <div className="grid grid-cols-3 gap-2 text-center pt-1">
            <div className="p-2 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl space-y-1">
              <span className="w-5 h-5 rounded-full bg-highlands-500 text-white text-[10px] font-bold flex items-center justify-center mx-auto">
                1
              </span>
              <p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">
                Bấm Nhận Deal
              </p>
              <p className="text-[9px] text-zinc-500">Mở trang Zalo</p>
            </div>

            <div className="p-2 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl space-y-1">
              <span className="w-5 h-5 rounded-full bg-highlands-500 text-white text-[10px] font-bold flex items-center justify-center mx-auto">
                2
              </span>
              <p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">
                Lưu vào Ví Zalo
              </p>
              <p className="text-[9px] text-zinc-500">Nhận mã QR</p>
            </div>

            <div className="p-2 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl space-y-1">
              <span className="w-5 h-5 rounded-full bg-highlands-500 text-white text-[10px] font-bold flex items-center justify-center mx-auto">
                3
              </span>
              <p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200">
                Đưa Thu Ngân
              </p>
              <p className="text-[9px] text-zinc-500">Quét &amp; Nhận nước</p>
            </div>
          </div>
        </div>

        {/* Bộ lọc nhanh trạng thái */}
        <div className="flex items-center space-x-1 p-1 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-xl">
          <button
            onClick={() => setFilter("all")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === "all"
                ? "bg-white dark:bg-zinc-900 text-highlands-500 dark:text-rose-300 shadow-sm"
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

        {/* Danh sách Ưu đãi Highlands */}
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
                className="text-xs font-bold text-highlands-500 hover:underline"
              >
                Xem tất cả ưu đãi Highlands
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Floating Back Button ở góc dưới để thao tác 1 tay trên điện thoại */}
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
