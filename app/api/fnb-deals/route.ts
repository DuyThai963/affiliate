import { NextRequest, NextResponse } from "next/server";
import { memoryCache } from "@/lib/cache";
import { FnbDealItem, FnbDealsResponse, FnbBrand, FnbDealStatus } from "@/types/fnb";
import {
  getHighlandsSheetDeals,
  getTchSheetDeals,
  HIGHLANDS_CAMPAIGN_INFO,
  TCH_CAMPAIGN_INFO,
} from "@/lib/fnb-campaign-data";

const FNB_CACHE_KEY = "fnb_deals_cache_v1";
const FNB_CACHE_TTL_MS = 30 * 60 * 1000; // 30 phút

/**
 * Tính toán trạng thái deal dựa trên thời gian
 */
function calculateStatus(startTime?: string, endTime?: string): FnbDealStatus {
  const now = Date.now();

  if (startTime) {
    const start = new Date(startTime).getTime();
    if (now < start) {
      return "Sắp diễn ra";
    }
  }

  if (endTime) {
    const end = new Date(endTime).getTime();
    const diff = end - now;
    if (diff > 0 && diff <= 24 * 60 * 60 * 1000) {
      return "Sắp hết hạn";
    }
    if (diff <= 0) {
      return "Sắp hết hạn";
    }
  }

  return "Đang áp dụng";
}

/**
 * Tạo link Affiliate cá nhân qua Accesstrade
 */
async function createAffiliateLink(
  targetUrl: string,
  campaignId: string,
  apiKey: string
): Promise<string> {
  try {
    const res = await fetch(`https://api.accesstrade.vn/v1/product_link/create`, {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        campaign_id: campaignId,
        urls: [targetUrl],
        utm_source: "fnb_finder",
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data?.data?.short_link) return data.data.short_link;
      if (data?.data?.aff_link) return data.data.aff_link;
      if (Array.isArray(data?.data) && data.data[0]) {
        return data.data[0].short_link || data.data[0].aff_link || targetUrl;
      }
    }
  } catch (err) {
    console.warn(`[createAffiliateLink] Lỗi tạo link cho campaign ${campaignId}:`, err);
  }
  return targetUrl;
}

/**
 * Danh sách Deal chính xác trích xuất từ 2 bảng Google Sheet của Accesstrade
 */
function getStandardFnbDeals(
  highlandsAffLink: string,
  tchAffLink: string
): FnbDealItem[] {
  return [
    ...getHighlandsSheetDeals(highlandsAffLink),
    ...getTchSheetDeals(tchAffLink),
  ];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const refresh = searchParams.get("refresh") === "true";
  const filterBrand = searchParams.get("brand") as FnbBrand | null;

  // 1. Kiểm tra cache trong bộ nhớ (nếu không yêu cầu refresh)
  if (!refresh) {
    const cachedDeals = memoryCache.get<FnbDealItem[]>(FNB_CACHE_KEY);
    if (cachedDeals && Array.isArray(cachedDeals) && cachedDeals.length > 0) {
      let filtered = cachedDeals;
      if (filterBrand === "highlands" || filterBrand === "tch") {
        filtered = cachedDeals.filter((d) => d.brand === filterBrand);
      }
      return NextResponse.json<FnbDealsResponse>({
        success: true,
        total: filtered.length,
        brands: {
          highlands: cachedDeals.filter((d) => d.brand === "highlands").length,
          tch: cachedDeals.filter((d) => d.brand === "tch").length,
        },
        deals: filtered,
        cached: true,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  const apiKey = process.env.ACCESSTRADE_API_KEY?.trim() || "";
  const highlandsCampaignId = process.env.HIGHLANDS_CAMPAIGN_ID?.trim() || "774";
  const tchCampaignId = process.env.TCH_CAMPAIGN_ID?.trim() || "756";

  const authHeaders = {
    Authorization: `Token ${apiKey}`,
    "Content-Type": "application/json",
  };

  // 2. Tạo link Affiliate cho 2 chiến dịch qua Accesstrade
  const [highlandsAff, tchAff] = await Promise.all([
    apiKey
      ? createAffiliateLink("https://www.highlandscoffee.com.vn", highlandsCampaignId, apiKey)
      : Promise.resolve("https://www.highlandscoffee.com.vn"),
    apiKey
      ? createAffiliateLink("https://thecoffeehouse.com", tchCampaignId, apiKey)
      : Promise.resolve("https://thecoffeehouse.com"),
  ]);

  // 3. Gọi đồng thời 2 campaign ID (774 và 756) từ 2 endpoint Accesstrade như yêu cầu
  let liveApiDeals: FnbDealItem[] = [];

  if (apiKey) {
    try {
      const endpoints = [
        `https://api.accesstrade.vn/v1/offers_informations/coupon?campaign_id=${highlandsCampaignId}&limit=50`,
        `https://api.accesstrade.vn/v1/offers_informations?campaign_id=${highlandsCampaignId}&limit=50`,
        `https://api.accesstrade.vn/v1/offers_informations/coupon?campaign_id=${tchCampaignId}&limit=50`,
        `https://api.accesstrade.vn/v1/offers_informations?campaign_id=${tchCampaignId}&limit=50`,
      ];

      const fetchPromises = endpoints.map((ep) =>
        fetch(ep, { headers: authHeaders })
          .then(async (res) => (res.ok ? res.json() : null))
          .catch(() => null)
      );

      const settled = await Promise.allSettled(fetchPromises);

      // Trích xuất các deal F&B nếu có
      for (const res of settled) {
        if (res.status === "fulfilled" && res.value && Array.isArray(res.value?.data)) {
          for (const item of res.value.data) {
            const rawName = (item.name || "").toLowerCase();
            const rawDesc = (item.content || item.description || "").toLowerCase();
            const isHighlands = rawName.includes("highlands") || rawDesc.includes("highlands");
            const isTch =
              rawName.includes("coffee house") ||
              rawDesc.includes("coffee house") ||
              rawName.includes("tch");

            if (isHighlands || isTch) {
              const brand: FnbBrand = isHighlands ? "highlands" : "tch";
              const code =
                Array.isArray(item.coupons) && item.coupons[0]?.coupon_code
                  ? item.coupons[0].coupon_code
                  : item.coupon_code || null;

              const status = calculateStatus(item.start_time, item.end_time);
              const actionUrl =
                item.aff_link || (brand === "highlands" ? highlandsAff : tchAff);

              liveApiDeals.push({
                id: String(item.id || Math.random().toString(36).substring(2, 9)),
                brand,
                brandName: brand === "highlands" ? "Highlands Coffee" : "The Coffee House",
                title: item.name || "Ưu đãi F&B",
                description: item.content || item.description || "Áp dụng theo quy định của quán",
                discountValue: item.discount_value
                  ? `Giảm ${item.discount_value}`
                  : item.discount_percentage
                  ? `Giảm ${item.discount_percentage}%`
                  : "Ưu đãi hấp dẫn",
                minSpend: item.min_spend ? `Đơn từ ${item.min_spend}` : "Đơn bất kỳ",
                couponCode: code,
                startTime: item.start_time,
                endTime: item.end_time,
                status,
                actionUrl,
                bannerUrl: item.image || item.banner,
              });
            }
          }
        }
      }
    } catch (e) {
      console.warn("[GET /api/fnb-deals] Lỗi khi gọi Accesstrade:", e);
    }
  }

  // 4. Nếu Accesstrade chưa có deal riêng của 2 brand, bổ sung bộ deal tiêu chuẩn có sẵn link Affiliate
  let finalDeals = liveApiDeals;
  if (finalDeals.length === 0) {
    finalDeals = getStandardFnbDeals(highlandsAff, tchAff);
  }

  // Lưu vào in-memory cache 30 phút
  memoryCache.set(FNB_CACHE_KEY, finalDeals, FNB_CACHE_TTL_MS);

  // Lọc theo brand nếu được yêu cầu
  let responseDeals = finalDeals;
  if (filterBrand === "highlands" || filterBrand === "tch") {
    responseDeals = finalDeals.filter((d) => d.brand === filterBrand);
  }

  const response: FnbDealsResponse = {
    success: true,
    total: responseDeals.length,
    brands: {
      highlands: finalDeals.filter((d) => d.brand === "highlands").length,
      tch: finalDeals.filter((d) => d.brand === "tch").length,
    },
    campaignInfo: {
      highlands: HIGHLANDS_CAMPAIGN_INFO,
      tch: TCH_CAMPAIGN_INFO,
    },
    deals: responseDeals,
    cached: false,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
