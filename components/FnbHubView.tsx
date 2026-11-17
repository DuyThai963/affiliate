"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Coffee,
  Sparkles,
  RefreshCw,
  QrCode,
  Smartphone,
  ArrowRight,
  Flame,
  CheckCircle2,
} from "lucide-react";
import FnbDealCard from "./FnbDealCard";
import { FnbDealItem, FnbDealsResponse, FnbBrand } from "@/types/fnb";

interface FnbHubViewProps {
  onShowToast: (message: string) => void;
}

/**
 * [Design Read] Family: High-Visual F&B Commerce Hub | Variance: 8/10 | Motion: 6/10 | Density: 8/10 | Accent: Highlands Crimson (#b31f24) & TCH Orange (#e57920)
 */
export default function FnbHubView({ onShowToast }: FnbHubViewProps) {
  const [deals, setDeals] = useState<FnbDealItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [brandFilter, setBrandFilter] = useState<"all" | FnbBrand>("all");

  const fetchDeals = async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/fnb-deals${refresh ? "?refresh=true" : ""}`);
      const data: FnbDealsResponse = await res.json();
      if (data.success && Array.isArray(data.deals)) {
        setDeals(data.deals);
        if (refresh) {
          onShowToast("Đã cập nhật danh sách ưu đãi F&B mới nhất!");
        }
      }
    } catch (e) {
      console.warn("Lỗi tải deal F&B:", e);
      onShowToast("Không thể tải deal F&B. Vui lòng thử lại!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const filteredDeals = deals.filter((d) => {
    if (brandFilter === "all") return true;
    return d.brand === brandFilter;
  });

  const highlandsCount = deals.filter((d) => d.brand === "highlands").length;
  const tchCount = deals.filter((d) => d.brand === "tch").length;

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-200">
      {/* 2 Card Thương hiệu Lớn: Bấm vào mở trang riêng biệt */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-extrabold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Chọn thương hiệu để xem trang riêng</span>
          </span>
          <span className="text-[10px] text-zinc-500">Mỗi quán 1 trang</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: Highlands Coffee -> Mở /highlands */}
          <Link
            href="/highlands"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8f181c] via-[#b31f24] to-[#c7272d] p-4 text-white shadow-md shadow-rose-950/20 active:scale-95 transition-all flex flex-col justify-between h-36"
          >
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-white backdrop-blur-sm">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-white/20 text-white">
                Zalo Redeem
              </span>
            </div>

            <div>
              <h3 className="font-black text-sm tracking-tight leading-tight">
                HIGHLANDS COFFEE
              </h3>
              <p className="text-[10px] text-white/80 line-clamp-1 mt-0.5">
                Mua 1 Tặng 1 &bull; Giảm 30K
              </p>

              <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] font-bold">
                <span className="text-amber-200">{highlandsCount} ưu đãi</span>
                <span className="inline-flex items-center group-hover:translate-x-1 transition-transform">
                  Vào trang riêng &rarr;
                </span>
              </div>
            </div>
          </Link>

          {/* Card 2: The Coffee House -> Mở /tch */}
          <Link
            href="/tch"
            className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#c96312] via-[#e57920] to-[#f58d38] p-4 text-white shadow-md shadow-amber-950/20 active:scale-95 transition-all flex flex-col justify-between h-36"
          >
            <div className="flex items-start justify-between">
              <div className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center text-white backdrop-blur-sm">
                <Coffee className="w-4 h-4" />
              </div>
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-white/20 text-white">
                Ưu đãi App
              </span>
            </div>

            <div>
              <h3 className="font-black text-sm tracking-tight leading-tight">
                THE COFFEE HOUSE
              </h3>
              <p className="text-[10px] text-white/80 line-clamp-1 mt-0.5">
                Mua 2 Tặng 1 &bull; FreeShip 30K
              </p>

              <div className="mt-2 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] font-bold">
                <span className="text-amber-100">{tchCount} ưu đãi</span>
                <span className="inline-flex items-center group-hover:translate-x-1 transition-transform">
                  Vào trang riêng &rarr;
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Bộ lọc nhanh phía trên + Nút làm mới */}
      <div className="flex items-center justify-between gap-1.5 pt-1">
        <div className="flex items-center space-x-1 p-1 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-xl flex-1">
          <button
            onClick={() => setBrandFilter("all")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              brandFilter === "all"
                ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 shadow-sm"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            Tất cả ({deals.length})
          </button>

          <button
            onClick={() => setBrandFilter("highlands")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              brandFilter === "highlands"
                ? "bg-[#b31f24] text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            Highlands ({highlandsCount})
          </button>

          <button
            onClick={() => setBrandFilter("tch")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              brandFilter === "tch"
                ? "bg-[#e57920] text-white shadow-sm"
                : "text-zinc-600 dark:text-zinc-400"
            }`}
          >
            TCH ({tchCount})
          </button>
        </div>

        <button
          onClick={() => fetchDeals(true)}
          disabled={isLoading}
          title="Làm mới dữ liệu từ Accesstrade"
          className="p-2.5 rounded-xl bg-zinc-200/80 dark:bg-zinc-800/80 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition active:scale-95 disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Danh sách Deal */}
      <div className="space-y-3 pt-1">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-36 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredDeals.length > 0 ? (
          filteredDeals.map((deal) => (
            <FnbDealCard
              key={deal.id}
              deal={deal}
              onShowToast={onShowToast}
            />
          ))
        ) : (
          <div className="p-8 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl text-center space-y-2">
            <Coffee className="w-8 h-8 text-zinc-400 mx-auto" />
            <p className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Không tìm thấy ưu đãi phù hợp
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
