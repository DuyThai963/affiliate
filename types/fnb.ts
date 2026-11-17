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
  posCode?: string; // Mã Pos code từ Google Sheet Accesstrade
  commission?: string; // Hoa hồng VND
  startTime?: string;
  endTime?: string;
  timeSlot?: string; // Ví dụ: "14:00 - 18:00 hàng ngày" hoặc "Thứ 4 hàng tuần"
  status: FnbDealStatus;
  actionUrl: string;
  bannerUrl?: string;
  redeemGuide?: string; // Hướng dẫn redeem (ví dụ: Zalo Mini App, đưa mã cho thu ngân)
  terms?: string; // Điều khoản sử dụng chi tiết từ Google Sheet
  applicableProducts?: string; // Danh mục / Sản phẩm áp dụng
  excludedStores?: string; // Danh sách cửa hàng ngoại trừ
  zaloSupportLink?: string; // Link Zalo hỗ trợ của Accesstrade
  sheetUrl?: string; // Link Google Sheet gốc
}

export interface FnbCampaignInfo {
  campaignId: string;
  brand: FnbBrand;
  brandName: string;
  sheetUrl: string;
  zaloSupportLink: string;
  note: string;
  excludedStoresSummary: string;
  excludedStoresList: string[];
}

export interface FnbDealsResponse {
  success: boolean;
  total: number;
  brands: {
    highlands: number;
    tch: number;
  };
  campaignInfo?: {
    highlands: FnbCampaignInfo;
    tch: FnbCampaignInfo;
  };
  deals: FnbDealItem[];
  cached?: boolean;
  updatedAt?: string;
  error?: string;
}
