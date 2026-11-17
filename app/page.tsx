"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import LinkInputBar from "@/components/LinkInputBar";
import QuickActionBar from "@/components/QuickActionBar";
import TikTokShopCard from "@/components/TikTokShopCard";
import VoucherList from "@/components/VoucherList";
import VoucherSkeleton from "@/components/VoucherSkeleton";
import Toast from "@/components/Toast";
import { VoucherSearchResponse } from "@/types/voucher";
import {
  Terminal,
  ChevronDown,
  ChevronUp,
  Info,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

/**
 * [Design Read] Family: Unified Dual-Section Commerce Layout | Variance: 7/10 | Motion: 5/10 | Density: 9/10 | Accent: Shopee Vermilion (#ee4d2d) & TikTok Crimson (#fe2c55)
 */
export default function HomePage() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [data, setData] = useState<VoucherSearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showLogs, setShowLogs] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // 1. Tự động tải trước các mã có sẵn toàn sàn & sắp diễn ra ngay khi mở web
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const res = await fetch("/api/vouchers");
        if (res.ok) {
          const initData: VoucherSearchResponse = await res.json();
          setData((prev) => ({
            platform: "shopee",
            cleanUrl: prev?.cleanUrl || "",
            affiliateLink: prev?.affiliateLink || "https://shopee.vn",
            productCoupons: prev?.productCoupons || [],
            upcomingCoupons: initData.upcomingCoupons || [],
            hotCoupons: initData.hotCoupons || [],
            debugLogs: initData.debugLogs,
          }));
        }
      } catch (e) {
        console.warn("Lỗi khi tải mã ban đầu:", e);
      }
    };

    fetchInitialData();
  }, []);

  // 2. Xử lý khi người dùng dán link và bấm tìm kiếm
  const handleSearch = async (customUrl?: string) => {
    const targetUrl = (customUrl || url).trim();
    if (!targetUrl) {
      showToast("Vui lòng nhập hoặc dán link Shopee hoặc TikTok Shop");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/vouchers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: targetUrl }),
      });

      const result: VoucherSearchResponse = await response.json();

      if (!response.ok || result.error) {
        throw new Error(
          result.error || "Không thể phân giải link hoặc tạo link Affiliate."
        );
      }

      setData(result);
      setHasSearched(true);
      if (result.cleanUrl) {
        setUrl(result.cleanUrl);
      }

      if (result.platform === "tiktok") {
        showToast("Đã tạo link TikTok Shop Affiliate thành công!");
      } else {
        const prodCount = result.productCoupons?.length || 0;
        showToast(
          prodCount > 0
            ? `Tìm thấy ${prodCount} mã riêng cho món đồ này!`
            : "Đã tạo link Shopee! Bạn có thể dùng các mã sàn ở bên dưới."
        );
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Đã xảy ra lỗi không xác định. Vui lòng kiểm tra lại link sản phẩm.";
      setError(msg);
      showToast(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col relative transition-colors shadow-2xl">
      {/* Header */}
      <Header />

      {/* Sticky Top Input Bar */}
      <LinkInputBar
        url={url}
        setUrl={setUrl}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-4 space-y-4">
        {/* Banner thông báo DEMO nếu chưa điền key Accesstrade */}
        {data?.isDemo && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-2xl flex items-start space-x-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-800 dark:text-amber-300">
              <p className="font-bold">Đang hiển thị chế độ DEMO mẫu</p>
              <p className="mt-0.5 leading-relaxed text-[11px] opacity-90">
                Hãy cấu hình <code className="font-mono bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded">ACCESSTRADE_API_KEY</code> trong file <code className="font-mono">.env.local</code> để tạo link thực tế từ Accesstrade.
              </p>
            </div>
          </div>
        )}

        {/* Thông báo lỗi nếu có */}
        {error && !isLoading && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-xs text-rose-700 dark:text-rose-300 flex items-start space-x-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* Trạng thái Loading Skeleton */}
        {isLoading && <VoucherSkeleton />}

        {/* TRƯỜNG HỢP 1: TIKTOK SHOP -> 1 Nút to duy nhất */}
        {!isLoading && data?.platform === "tiktok" && (
          <TikTokShopCard
            affiliateLink={data.affiliateLink}
            cleanUrl={data.cleanUrl}
            onShowToast={showToast}
          />
        )}

        {/* TRƯỜNG HỢP 2: SHOPEE (hoặc khi mới mở web lên) */}
        {!isLoading && data?.platform !== "tiktok" && (
          <>
            {/* Quick Action Bar (Chỉ hiện khi đã tìm kiếm link Shopee thành công) */}
            {hasSearched && data?.affiliateLink && (
              <QuickActionBar
                affiliateLink={data.affiliateLink}
                cleanUrl={data.cleanUrl}
                onShowToast={showToast}
              />
            )}

            {/* DANH SÁCH VOUCHER 2 KHUNG:
                - Khung 1 (trên): Mã áp dụng ngay cho sản phẩm vừa tìm (khi hasSearched)
                - Khung 2 (dưới): Mã Hot toàn sàn + Mã Sắp diễn ra (hiển thị luôn cho user copy) */}
            <VoucherList
              productCoupons={data?.productCoupons || []}
              upcomingCoupons={data?.upcomingCoupons || []}
              hotCoupons={data?.hotCoupons || []}
              tiktokCoupons={data?.tiktokCoupons || []}
              affiliateLink={data?.affiliateLink || "https://shopee.vn"}
              hasSearched={hasSearched}
              onShowToast={showToast}
            />
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="px-4 py-4 text-center border-t border-zinc-200/60 dark:border-zinc-800/80 text-[11px] text-zinc-400 dark:text-zinc-500">
        <p>Shopee &amp; TikTok Shop Affiliate Finder &bull; Mobile PWA</p>
      </footer>

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
