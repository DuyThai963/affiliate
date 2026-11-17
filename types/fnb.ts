export type FnbBrand = "highlands" | "tch";

export type FnbDealStatus = "Đang áp dụng" | "Sắp diễn ra" | "Sắp hết hạn";

export interface FnbDealItem {
  id: string;
  brand: FnbBrand;
  brandName: string;
  title: string;
  description: string;
  discountValue: string;
  minSpend?: string;
  couponCode?: string | null;
  startTime?: string;
  endTime?: string;
  timeSlot?: string; // Ví dụ: "14:00 - 18:00 hàng ngày" hoặc "Thứ 4 hàng tuần"
  status: FnbDealStatus;
  actionUrl: string;
  bannerUrl?: string;
  redeemGuide?: string; // Hướng dẫn redeem (ví dụ: Zalo Mini App, đưa mã cho thu ngân)
}

export interface FnbDealsResponse {
  success: boolean;
  total: number;
  brands: {
    highlands: number;
    tch: number;
  };
  deals: FnbDealItem[];
  cached?: boolean;
  updatedAt?: string;
  error?: string;
}
