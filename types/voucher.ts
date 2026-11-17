export interface AccesstradeCouponItem {
  id?: string | number;
  coupon_code?: string;
  coupon_desc?: string;
  coupon_name?: string;
  coupon_save_link?: string;
  discount_value?: string | number;
  discount_percentage?: number;
  min_spend?: string | number;
  start_time?: string;
  end_time?: string;
  percentage_used?: number;
  aff_link?: string;
  banner?: string;
  image?: string;
  merchant?: string;
  remain_count?: number;
  category?: string;
  [key: string]: unknown;
}

export type VoucherCategoryType = "shipping" | "shop" | "global";

export interface VoucherItem {
  id: string;
  code: string | null;
  name: string;
  description: string;
  discountValue?: string | number;
  minSpend?: string | number;
  startTime?: string;
  endTime?: string;
  percentageUsed?: number;
  affLink?: string;
  bannerUrl?: string;
  isExpired?: boolean;
  platform?: SupportedPlatform;
  voucherType?: VoucherCategoryType;
}

export type SupportedPlatform = "shopee" | "tiktok";

export interface VoucherSearchResponse {
  platform: SupportedPlatform;
  cleanUrl: string;
  affiliateLink: string;
  productCoupons: VoucherItem[];
  upcomingCoupons: VoucherItem[];
  hotCoupons: VoucherItem[];
  tiktokCoupons?: VoucherItem[];
  isDemo?: boolean;
  message?: string;
  error?: string;
  debugLogs?: string[];
}

export interface FbFunnelRequest {
  affiliateLink: string;
}

export interface FbFunnelResponse {
  success: boolean;
  fbCommentUrl?: string;
  commentId?: string;
  error?: string;
}
