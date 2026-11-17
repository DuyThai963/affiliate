"use client";

import React, { useState } from "react";
import {
  Package,
  CalendarClock,
  Flame,
  Ticket,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
} from "lucide-react";
import { VoucherItem } from "@/types/voucher";
import VoucherCard from "./VoucherCard";

interface VoucherListProps {
  productCoupons: VoucherItem[];
  upcomingCoupons: VoucherItem[];
  hotCoupons: VoucherItem[];
  affiliateLink: string;
  hasSearched: boolean;
  onShowToast: (message: string) => void;
}

/**
 * [Design Read] Family: Unified Dual-Section Commerce Layout | Variance: 7/10 | Motion: 5/10 | Density: 9/10 | Accent: Vermilion (#ee4d2d) & Golden Sun
 */
export default function VoucherList({
  productCoupons,
  upcomingCoupons,
  hotCoupons,
  affiliateLink,
  hasSearched,
  onShowToast,
}: VoucherListProps) {
  // Cho phép thu gọn / mở rộng các nhóm nếu danh sách dài
  const [showAllHot, setShowAllHot] = useState(true);
  const [showAllUpcoming, setShowAllUpcoming] = useState(true);

  return (
    <div className="space-y-6">
      {/* ========================================================
          KHUNG 1 (Ở TRÊN): MÃ ÁP DỤNG NGAY CHO SẢN PHẨM VỪA TÌM
          (Chỉ hiển thị sau khi người dùng đã nhập link tìm kiếm)
      ======================================================== */}
      {hasSearched && (
        <section className="bg-white dark:bg-zinc-900 border-2 border-shopee-500/30 dark:border-shopee-500/20 rounded-3xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-shopee-50 dark:bg-shopee-950/80 text-shopee-600 dark:text-shopee-400 flex items-center justify-center font-bold">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                  Mã Dành Riêng Cho Đơn Này
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Áp dụng trực tiếp cho sản phẩm bạn vừa tìm
                </p>
              </div>
            </div>

            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-shopee-500 text-white shadow-sm shadow-shopee-500/20">
              {productCoupons.length} mã
            </span>
          </div>

          {/* Danh sách mã riêng cho sản phẩm */}
          {productCoupons.length > 0 ? (
            <div className="space-y-3 pt-1">
              {productCoupons.map((voucher) => (
                <VoucherCard
                  key={voucher.id}
                  voucher={voucher}
                  defaultAffiliateLink={affiliateLink}
                  onShowToast={onShowToast}
                />
              ))}
            </div>
          ) : (
            <div className="py-4 px-3 bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl text-center space-y-1.5 border border-dashed border-zinc-200 dark:border-zinc-700/80">
              <p className="font-bold text-xs text-zinc-700 dark:text-zinc-300">
                Sản phẩm chưa có mã giảm riêng từ người bán
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
                Đừng lo! Bạn hãy áp dụng các **Mã Hot toàn sàn** và **Mã Sắp diễn ra** ở khung ngay bên dưới để nhận ưu đãi!
              </p>
            </div>
          )}
        </section>
      )}

      {/* ========================================================
          KHUNG 2 (Ở DƯỚI): CÁC MÃ CÓ SẴN (MÃ HOT & MÃ SẮP DIỄN RA)
          (Hiển thị luôn kể cả khi chưa dán link để người dùng copy ngay)
      ======================================================== */}
      <section className="space-y-5">
        {/* PHẦN A: MÃ HOT TOÀN SÀN */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-rose-500 fill-rose-500" />
              <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                Mã Hot Toàn Sàn (Áp dụng ngay)
              </h3>
            </div>
            <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
              {hotCoupons.length} mã có sẵn
            </span>
          </div>

          {hotCoupons.length > 0 ? (
            <div className="space-y-3">
              {(showAllHot ? hotCoupons : hotCoupons.slice(0, 5)).map((voucher) => (
                <VoucherCard
                  key={voucher.id}
                  voucher={voucher}
                  defaultAffiliateLink={affiliateLink}
                  onShowToast={onShowToast}
                />
              ))}

              {hotCoupons.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowAllHot(!showAllHot)}
                  className="w-full py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition"
                >
                  <span>{showAllHot ? "Thu gọn bớt" : `Xem thêm ${hotCoupons.length - 5} mã hot khác`}</span>
                  {showAllHot ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          ) : (
            <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-center text-xs text-zinc-500">
              Đang làm mới danh sách mã toàn sàn từ Accesstrade...
            </div>
          )}
        </div>

        {/* PHẦN B: MÃ SẮP DIỄN RA (Sắp xếp theo thời gian từ gần đến xa) */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center space-x-2">
              <CalendarClock className="w-4 h-4 text-amber-500" />
              <div>
                <h3 className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100">
                  Mã Sắp Diễn Ra (Canh giờ săn sale)
                </h3>
              </div>
            </div>
            <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-200/60 dark:border-amber-800/50">
              {upcomingCoupons.length} mã &bull; Gần &rarr; Xa
            </span>
          </div>

          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 px-1 -mt-1 leading-relaxed">
            Các mã ngày mai và khung giờ kế tiếp, sắp xếp theo thời gian mở gần nhất để bạn canh bấm mua:
          </p>

          {upcomingCoupons.length > 0 ? (
            <div className="space-y-3">
              {(showAllUpcoming ? upcomingCoupons : upcomingCoupons.slice(0, 5)).map((voucher) => (
                <VoucherCard
                  key={voucher.id}
                  voucher={voucher}
                  defaultAffiliateLink={affiliateLink}
                  isUpcoming={true}
                  onShowToast={onShowToast}
                />
              ))}

              {upcomingCoupons.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowAllUpcoming(!showAllUpcoming)}
                  className="w-full py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-bold text-xs rounded-xl flex items-center justify-center space-x-1 transition"
                >
                  <span>{showAllUpcoming ? "Thu gọn bớt" : `Xem thêm ${upcomingCoupons.length - 5} mã sắp mở`}</span>
                  {showAllUpcoming ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
          ) : (
            <div className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl text-center text-xs text-zinc-500">
              Chưa có mã khung giờ tiếp theo được công bố.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
