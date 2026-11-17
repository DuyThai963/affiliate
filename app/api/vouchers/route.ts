import { NextRequest, NextResponse } from "next/server";
import { resolveUrl, PlatformType } from "@/lib/url-resolver";
import { memoryCache } from "@/lib/cache";
import {
  AccesstradeCouponItem,
  VoucherItem,
  VoucherSearchResponse,
  VoucherCategoryType,
} from "@/types/voucher";

const HOT_COUPONS_CACHE_KEY = "shopee_hot_coupons_cache_v2";
const UPCOMING_COUPONS_CACHE_KEY = "shopee_upcoming_coupons_cache_v2";
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 phút

// Danh sách các ưu đãi & trợ giá sàn thực tế trên TikTok Shop
function getTikTokCoupons(defaultAffLink?: string): VoucherItem[] {
  const aff = defaultAffLink || "https://shop.tiktok.com";
  return [
    {
      id: "tt-1",
      platform: "tiktok",
      code: null,
      name: "FreeShip Xtra Giảm 70.000đ Toàn Sàn",
      description: "Áp dụng cho mọi đơn hàng TikTok Shop có nhãn FreeShip Xtra",
      discountValue: "FreeShip 70K",
      minSpend: "0đ",
      percentageUsed: 94,
      endTime: new Date(Date.now() + 3600000 * 16).toISOString(),
      affLink: aff,
      voucherType: "shipping",
    },
    {
      id: "tt-2",
      platform: "tiktok",
      code: null,
      name: "Voucher LIVE Giảm 15% (Tối đa 50K)",
      description: "Ưu đãi tự động áp dụng khi mua hàng trong các phiên Livestream TikTok",
      discountValue: "Giảm 15%",
      minSpend: "100.000đ",
      percentageUsed: 88,
      endTime: new Date(Date.now() + 3600000 * 12).toISOString(),
      affLink: aff,
      voucherType: "global",
    },
    {
      id: "tt-3",
      platform: "tiktok",
      code: null,
      name: "Voucher Shop Nhà Bán Giảm 30.000đ",
      description: "Mã ưu đãi từ gian hàng dành cho khách mua sắm tại shop",
      discountValue: "Giảm 30.000đ",
      minSpend: "150.000đ",
      percentageUsed: 80,
      endTime: new Date(Date.now() + 3600000 * 20).toISOString(),
      affLink: aff,
      voucherType: "shop",
    },
    {
      id: "tt-4",
      platform: "tiktok",
      code: null,
      name: "Trợ Giá Sàn Giảm 40.000đ",
      description: "Voucher trợ giá sốc từ TikTok Shop cho sản phẩm thịnh hành",
      discountValue: "Giảm 40.000đ",
      minSpend: "200.000đ",
      percentageUsed: 75,
      endTime: new Date(Date.now() + 3600000 * 18).toISOString(),
      affLink: aff,
      voucherType: "global",
    },
    {
      id: "tt-5",
      platform: "tiktok",
      code: null,
      name: "Ưu Đãi Bạn Mới Giảm 25.000đ",
      description: "Dành riêng cho đơn hàng đầu tiên trải nghiệm mua sắm TikTok Shop",
      discountValue: "Giảm 25.000đ",
      minSpend: "50.000đ",
      percentageUsed: 62,
      endTime: new Date(Date.now() + 86400000 * 3).toISOString(),
      affLink: aff,
      voucherType: "global",
    },
    {
      id: "tt-5",
      platform: "tiktok",
      code: null,
      name: "Hoàn Xu Xtra 10% (Tối đa 30K Xu)",
      description: "Tích lũy xu trừ trực tiếp vào các lần mua sắm tiếp theo",
      discountValue: "Hoàn 30K Xu",
      minSpend: "150.000đ",
      percentageUsed: 45,
      endTime: new Date(Date.now() + 86400000 * 5).toISOString(),
      affLink: aff,
    },
  ];
}

// Hàm chuẩn hóa voucher từ Accesstrade sang format UI thân thiện
function mapCouponItem(item: any, defaultAffLink?: string): VoucherItem {
  // 1. Trích xuất coupon code
  let code: string | null = null;
  if (Array.isArray(item.coupons) && item.coupons.length > 0 && item.coupons[0]?.coupon_code) {
    code = String(item.coupons[0].coupon_code).trim();
  } else if (item.coupon_code) {
    code = String(item.coupon_code).trim();
  }

  // 2. Trích xuất Giá trị giảm
  let discountValue = item.discount_value || item.discount_percentage;
  if (!discountValue || discountValue === 0) {
    if (item.name && (item.name.includes("Giảm") || item.name.includes("%"))) {
      discountValue = item.name;
    } else if (item.content && item.content.includes("hỗ trợ phí vận chuyển")) {
      discountValue = "FreeShip";
    } else {
      discountValue = "Mã Giảm Giá";
    }
  } else if (typeof discountValue === "number") {
    discountValue =
      discountValue > 100
        ? `Giảm ${discountValue.toLocaleString("vi-VN")}đ`
        : `Giảm ${discountValue}%`;
  }

  // 3. Trích xuất Đơn tối thiểu
  let minSpend = item.min_spend;
  if (!minSpend || minSpend === 0) {
    if (item.name && item.name.includes("Đơn")) {
      minSpend = item.name;
    } else {
      minSpend = "Đơn bất kỳ";
    }
  } else if (typeof minSpend === "number") {
    minSpend = `${minSpend.toLocaleString("vi-VN")}đ`;
  }

  // 4. Trích xuất % đã sử dụng
  let percentageUsed = item.percentage_used;
  if (typeof percentageUsed !== "number") {
    if (typeof item.remain === "number" && item.remain > 0) {
      percentageUsed = Math.min(99, Math.max(25, Math.floor(100 - item.remain * 10)));
    } else {
      percentageUsed = Math.floor(Math.random() * 35) + 60;
    }
  }

  return {
    id: String(item.id || Math.random().toString(36).substring(2, 9)),
    platform: "shopee",
    code,
    name: item.name || (code ? `Mã: ${code}` : "Voucher Shopee"),
    description: item.content || item.coupon_desc || item.name || "",
    discountValue: String(discountValue),
    minSpend: String(minSpend),
    startTime: item.start_time,
    endTime: item.end_time,
    percentageUsed,
    affLink: item.aff_link || defaultAffLink,
    bannerUrl: item.link || item.coupon_save_link || item.banner || item.image,
    voucherType: (() => {
      const text = `${item.name || ""} ${item.content || ""} ${item.coupon_desc || ""} ${item.category || ""}`.toLowerCase();
      if (
        text.includes("ship") ||
        text.includes("vận chuyển") ||
        text.includes("freeship") ||
        text.includes("giao hàng") ||
        text.includes("phí vận") ||
        text.includes("hỗ trợ phí")
      ) {
        return "shipping" as VoucherCategoryType;
      }
      if (
        text.includes("shop") ||
        text.includes("người bán") ||
        text.includes("gian hàng") ||
        text.includes("seller") ||
        text.includes("nhà bán") ||
        text.includes("cửa hàng")
      ) {
        return "shop" as VoucherCategoryType;
      }
      return "global" as VoucherCategoryType;
    })(),
  };
}

// Data mô phỏng thực tế khi chưa cấu hình API_KEY Accesstrade
function getMockDemoData(cleanUrl: string, platform: PlatformType): VoucherSearchResponse {
  const demoTikTokAffiliate = `https://vt.tiktok.com/demo_affiliate?url=${encodeURIComponent(
    cleanUrl || "https://shop.tiktok.com"
  )}`;

  if (platform === "tiktok") {
    return {
      platform: "tiktok",
      cleanUrl,
      affiliateLink: demoTikTokAffiliate,
      productCoupons: [],
      upcomingCoupons: [],
      hotCoupons: [],
      tiktokCoupons: getTikTokCoupons(demoTikTokAffiliate),
      isDemo: true,
      message: "Đang hiển thị chế độ DEMO cho TikTok Shop",
    };
  }

  const demoShopeeAffiliate = `https://shope.ee/demo_affiliate?url=${encodeURIComponent(
    cleanUrl || "https://shopee.vn"
  )}`;

  const mockProductCoupons: VoucherItem[] = [
    {
      id: "prod-1",
      platform: "shopee",
      code: "SHPPROD15K",
      name: "Giảm 15% Đơn tối thiểu 200,000đ",
      description: "Mã giảm giá áp dụng riêng từ Người bán cho sản phẩm này",
      discountValue: "Giảm 15%",
      minSpend: "200.000đ",
      percentageUsed: 99,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 14 * 3600000).toISOString(),
      affLink: demoShopeeAffiliate,
      voucherType: "shop",
    },
    {
      id: "prod-2",
      platform: "shopee",
      code: "DISC12K",
      name: "Giảm 12% Đơn tối thiểu 99,000đ",
      description: "Ưu đãi độc quyền của gian hàng người bán trên Shopee",
      discountValue: "Giảm 12%",
      minSpend: "99.000đ",
      percentageUsed: 55,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 14 * 3600000).toISOString(),
      affLink: demoShopeeAffiliate,
      voucherType: "shop",
    },
  ];

  const mockUpcomingCoupons: VoucherItem[] = [
    {
      id: "upcoming-1",
      platform: "shopee",
      code: "MIDNIGHT30",
      name: "Giảm 30% Đơn tối thiểu 150,000đ",
      description: "Mã chớp nhoáng mở khung giờ vàng 0H ngày mai",
      discountValue: "Giảm 30%",
      minSpend: "150.000đ",
      percentageUsed: 0,
      startTime: new Date(Date.now() + 3600000 * 8).toISOString(),
      endTime: new Date(Date.now() + 3600000 * 12).toISOString(),
      affLink: demoShopeeAffiliate,
      voucherType: "global",
    },
    {
      id: "upcoming-2",
      platform: "shopee",
      code: "FREESHIP50K",
      name: "FreeShip Giảm 50K Đơn từ 0đ",
      description: "Mã hỗ trợ phí vận chuyển khung 9H ngày mai",
      discountValue: "FreeShip 50K",
      minSpend: "0đ",
      percentageUsed: 0,
      startTime: new Date(Date.now() + 3600000 * 17).toISOString(),
      endTime: new Date(Date.now() + 3600000 * 20).toISOString(),
      affLink: demoShopeeAffiliate,
      voucherType: "shipping",
    },
  ];

  const mockHotCoupons: VoucherItem[] = [
    {
      id: "hot-1",
      platform: "shopee",
      code: "FREESHIP0D",
      name: "Miễn Phí Vận Chuyển Toàn Sàn",
      description: "Giảm tối đa 30K phí vận chuyển bưu tá giao hàng",
      discountValue: "FreeShip 30K",
      minSpend: "0đ",
      percentageUsed: 94,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 86400000).toISOString(),
      affLink: demoShopeeAffiliate,
      voucherType: "shipping",
    },
    {
      id: "hot-2",
      platform: "shopee",
      code: "SHOPEE25K",
      name: "Giảm 25.000đ Toàn Sàn",
      description: "Mã chớp nhoáng săn sale toàn ngành mở mới mỗi khung giờ",
      discountValue: "25.000đ",
      minSpend: "120.000đ",
      percentageUsed: 78,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 86400000).toISOString(),
      affLink: demoShopeeAffiliate,
      voucherType: "global",
    },
    {
      id: "hot-3",
      platform: "shopee",
      code: "SHOPVIP40K",
      name: "Voucher Shop Gian Hàng Giảm 40.000đ",
      description: "Mã giảm giá trực tiếp từ nhà bán hàng chính hãng",
      discountValue: "Giảm 40.000đ",
      minSpend: "250.000đ",
      percentageUsed: 68,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 86400000 * 2).toISOString(),
      affLink: demoShopeeAffiliate,
      voucherType: "shop",
    },
    {
      id: "hot-4",
      platform: "shopee",
      code: "HOANXU50K",
      name: "Hoàn 15% Xu Tối Đa 50.000 Xu",
      description: "Nhận Shopee Xu toàn sàn ngay sau khi đơn hàng giao thành công",
      discountValue: "Hoàn 50K Xu",
      minSpend: "300.000đ",
      percentageUsed: 55,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 86400000 * 4).toISOString(),
      affLink: demoShopeeAffiliate,
      voucherType: "global",
    },
  ];

  return {
    platform: "shopee",
    cleanUrl,
    affiliateLink: demoShopeeAffiliate,
    productCoupons: mockProductCoupons,
    upcomingCoupons: mockUpcomingCoupons,
    hotCoupons: mockHotCoupons,
    tiktokCoupons: getTikTokCoupons(demoTikTokAffiliate),
    isDemo: true,
  };
}

/**
 * GET /api/vouchers: Tải trước các mã có sẵn (Shopee & TikTok Shop)
 */
export async function GET() {
  const logs: string[] = [];
  try {
    const apiKey = process.env.ACCESSTRADE_API_KEY?.trim();
    if (!apiKey) {
      return NextResponse.json(getMockDemoData("https://shopee.vn", "shopee"));
    }

    const authHeaders = {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    };

    // Kiểm tra cache
    let hotCoupons: VoucherItem[] = memoryCache.get<VoucherItem[]>(HOT_COUPONS_CACHE_KEY) || [];
    let upcomingCoupons: VoucherItem[] = memoryCache.get<VoucherItem[]>(UPCOMING_COUPONS_CACHE_KEY) || [];

    if (hotCoupons.length === 0 || upcomingCoupons.length === 0) {
      console.log("[Accesstrade GET] Bắt đầu gọi API lấy mã có sẵn toàn sàn...");

      // 1. Mã hot / chung toàn sàn (domain=shopee.vn)
      const hotPromise = fetch(
        `https://api.accesstrade.vn/v1/offers_informations/coupon?domain=shopee.vn&limit=30`,
        { headers: authHeaders }
      ).then(async (res) => {
        logs.push(`GET coupon general: status ${res.status}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      });

      // 2. Mã sắp diễn ra (is_next_day_coupon=true)
      const upcomingPromise = fetch(
        `https://api.accesstrade.vn/v1/offers_informations/coupon?domain=shopee.vn&is_next_day_coupon=true&limit=30`,
        { headers: authHeaders }
      ).then(async (res) => {
        logs.push(`GET coupon upcoming: status ${res.status}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.json();
      });

      const [hotRes, upcomingRes] = await Promise.allSettled([hotPromise, upcomingPromise]);

      if (hotRes.status === "fulfilled" && Array.isArray(hotRes.value?.data)) {
        hotCoupons = hotRes.value.data.map((item: any) => mapCouponItem(item));
        memoryCache.set(HOT_COUPONS_CACHE_KEY, hotCoupons, CACHE_TTL_MS);
        logs.push(`Loaded ${hotCoupons.length} hot coupons`);
      }

      if (upcomingRes.status === "fulfilled" && Array.isArray(upcomingRes.value?.data)) {
        upcomingCoupons = upcomingRes.value.data.map((item: any) => mapCouponItem(item));
        upcomingCoupons.sort((a, b) => {
          const tA = a.startTime ? new Date(a.startTime).getTime() : 0;
          const tB = b.startTime ? new Date(b.startTime).getTime() : 0;
          return tA - tB;
        });
        memoryCache.set(UPCOMING_COUPONS_CACHE_KEY, upcomingCoupons, CACHE_TTL_MS);
        logs.push(`Loaded ${upcomingCoupons.length} upcoming coupons`);
      }
    }

    return NextResponse.json({
      platform: "shopee",
      cleanUrl: "",
      affiliateLink: "https://shopee.vn",
      productCoupons: [],
      upcomingCoupons: upcomingCoupons || [],
      hotCoupons: hotCoupons || [],
      tiktokCoupons: getTikTokCoupons("https://shop.tiktok.com"),
      debugLogs: logs,
    });
  } catch (err: any) {
    console.error("[Accesstrade GET Exception]:", err);
    return NextResponse.json({
      platform: "shopee",
      cleanUrl: "",
      affiliateLink: "https://shopee.vn",
      productCoupons: [],
      upcomingCoupons: [],
      hotCoupons: [],
      tiktokCoupons: getTikTokCoupons("https://shop.tiktok.com"),
      error: err.message,
      debugLogs: logs,
    });
  }
}

/**
 * POST /api/vouchers: Xử lý khi người dùng nhập/dán URL để tìm kiếm
 */
export async function POST(request: NextRequest) {
  const logs: string[] = [];
  try {
    const body = await request.json().catch(() => ({}));
    const rawUrl = body?.url;

    if (!rawUrl || typeof rawUrl !== "string") {
      return NextResponse.json(
        { error: "Vui lòng cung cấp đường link sản phẩm Shopee hoặc TikTok Shop hợp lệ" },
        { status: 400 }
      );
    }

    // 1. Phân giải URL, giải nén link rút gọn & tự động nhận diện Domain
    const resolveResult = await resolveUrl(rawUrl);
    if (!resolveResult.success || !resolveResult.cleanUrl || !resolveResult.platform) {
      return NextResponse.json(
        {
          error:
            resolveResult.error ||
            "Không thể nhận diện đường link. Vui lòng nhập link Shopee hoặc TikTok Shop.",
        },
        { status: 400 }
      );
    }

    const { cleanUrl, platform } = resolveResult;
    logs.push(`Platform: ${platform}, CleanUrl: ${cleanUrl}`);
    console.log(`[Voucher Search] Platform: ${platform} | URL: ${cleanUrl}`);

    const apiKey = process.env.ACCESSTRADE_API_KEY?.trim();

    // 2. Nếu chưa có API Key, trả về Demo data thân thiện
    if (!apiKey) {
      const demoData = getMockDemoData(cleanUrl, platform);
      return NextResponse.json(demoData);
    }

    // 3. Headers cho Accesstrade API
    const authHeaders = {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    };

    // ========================================================
    // CASE A: TIKTOK SHOP
    // ========================================================
    if (platform === "tiktok") {
      const tiktokCampaignId = process.env.TIKTOK_CAMPAIGN_ID?.trim() || "749";

      try {
        const affResponse = await fetch(
          `https://api.accesstrade.vn/v1/product_link/create`,
          {
            method: "POST",
            headers: authHeaders,
            body: JSON.stringify({
              campaign_id: tiktokCampaignId,
              urls: [cleanUrl],
              utm_source: "personal_finder",
            }),
          }
        );

        logs.push(`TikTok product_link: status ${affResponse.status}`);
        let affiliateLink = cleanUrl;
        if (affResponse.ok) {
          const affData = await affResponse.json();
          if (affData?.data?.short_link) {
            affiliateLink = affData.data.short_link;
          } else if (affData?.data?.aff_link) {
            affiliateLink = affData.data.aff_link;
          } else if (Array.isArray(affData?.data) && affData.data.length > 0) {
            affiliateLink =
              affData.data[0]?.short_link ||
              affData.data[0]?.aff_link ||
              cleanUrl;
          }
        }

        return NextResponse.json({
          platform: "tiktok",
          cleanUrl,
          affiliateLink,
          productCoupons: [],
          upcomingCoupons: [],
          hotCoupons: [],
          tiktokCoupons: getTikTokCoupons(affiliateLink),
          debugLogs: logs,
        });
      } catch (err: any) {
        return NextResponse.json({
          platform: "tiktok",
          cleanUrl,
          affiliateLink: cleanUrl,
          productCoupons: [],
          upcomingCoupons: [],
          hotCoupons: [],
          tiktokCoupons: getTikTokCoupons(cleanUrl),
          error: err.message,
          debugLogs: logs,
        });
      }
    }

    // ========================================================
    // CASE B: SHOPEE
    // ========================================================
    const shopeeCampaignId =
      process.env.SHOPEE_CAMPAIGN_ID?.trim() || "4751584435713464237";

    // 1. Mã áp dụng cho link sản phẩm (Dùng domain=shopee.vn & url=...)
    const productCouponsPromise = fetch(
      `https://api.accesstrade.vn/v1/offers_informations/coupon?domain=shopee.vn&url=${encodeURIComponent(
        cleanUrl
      )}&limit=30`,
      { headers: authHeaders }
    ).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      const count = Array.isArray(data?.data) ? data.data.length : 0;
      logs.push(`Shopee product coupons: status ${res.status}, items: ${count}`);
      return data;
    }).catch((err) => {
      logs.push(`Shopee product coupons error: ${err.message}`);
      return { data: [] };
    });

    // 2. Mã sắp diễn ra theo URL (is_next_day_coupon=true)
    const upcomingCouponsPromise = fetch(
      `https://api.accesstrade.vn/v1/offers_informations/coupon?domain=shopee.vn&url=${encodeURIComponent(
        cleanUrl
      )}&is_next_day_coupon=true&limit=30`,
      { headers: authHeaders }
    ).then(async (res) => {
      const data = await res.json().catch(() => ({}));
      const count = Array.isArray(data?.data) ? data.data.length : 0;
      logs.push(`Shopee upcoming coupons: status ${res.status}, items: ${count}`);
      return data;
    }).catch((err) => {
      logs.push(`Shopee upcoming coupons error: ${err.message}`);
      return { data: [] };
    });

    // 3. Mã hot / chung toàn sàn (lấy từ cache nếu có)
    const cachedHotCoupons = memoryCache.get<VoucherItem[]>(HOT_COUPONS_CACHE_KEY);
    const hotCouponsPromise = cachedHotCoupons
      ? Promise.resolve({ cached: true, data: cachedHotCoupons })
      : fetch(
          `https://api.accesstrade.vn/v1/offers_informations/coupon?domain=shopee.vn&limit=30`,
          { headers: authHeaders }
        ).then(async (res) => {
          const data = await res.json().catch(() => ({}));
          const count = Array.isArray(data?.data) ? data.data.length : 0;
          logs.push(`Shopee general coupons: status ${res.status}, items: ${count}`);
          return data;
        }).catch((err) => {
          logs.push(`Shopee general coupons error: ${err.message}`);
          return { data: [] };
        });

    // 4. Tạo link Affiliate Shopee
    const affiliateLinkPromise = fetch(
      `https://api.accesstrade.vn/v1/product_link/create`,
      {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          campaign_id: shopeeCampaignId,
          urls: [cleanUrl],
          utm_source: "personal_finder",
        }),
      }
    ).then(async (res) => {
      const data = await res.json().catch(() => null);
      logs.push(`Shopee affiliate link: status ${res.status}`);
      return data;
    }).catch((err) => {
      logs.push(`Shopee affiliate link error: ${err.message}`);
      return null;
    });

    // Chạy đồng thời
    const [productRes, upcomingRes, hotRes, affiliateRes] = await Promise.allSettled([
      productCouponsPromise,
      upcomingCouponsPromise,
      hotCouponsPromise,
      affiliateLinkPromise,
    ]);

    // Trích xuất affiliate link
    let affiliateLink = cleanUrl;
    if (affiliateRes.status === "fulfilled" && affiliateRes.value) {
      const affData = affiliateRes.value;
      if (affData?.data?.short_link) {
        affiliateLink = affData.data.short_link;
      } else if (affData?.data?.aff_link) {
        affiliateLink = affData.data.aff_link;
      } else if (Array.isArray(affData?.data) && affData.data.length > 0) {
        affiliateLink =
          affData.data[0]?.short_link ||
          affData.data[0]?.aff_link ||
          cleanUrl;
      }
    }

    // Xử lý product coupons
    let productCoupons: VoucherItem[] = [];
    if (productRes.status === "fulfilled" && productRes.value) {
      const rawData = productRes.value?.data || [];
      if (Array.isArray(rawData)) {
        productCoupons = rawData.map((item: any) => mapCouponItem(item, affiliateLink));
      }
    }

    // Xử lý upcoming coupons
    let upcomingCoupons: VoucherItem[] = [];
    if (upcomingRes.status === "fulfilled" && upcomingRes.value) {
      const rawData = upcomingRes.value?.data || [];
      if (Array.isArray(rawData)) {
        upcomingCoupons = rawData.map((item: any) => mapCouponItem(item, affiliateLink));
        upcomingCoupons.sort((a, b) => {
          const tA = a.startTime ? new Date(a.startTime).getTime() : 0;
          const tB = b.startTime ? new Date(b.startTime).getTime() : 0;
          return tA - tB;
        });
      }
    }

    // Xử lý hot coupons
    let hotCoupons: VoucherItem[] = [];
    if (hotRes.status === "fulfilled" && hotRes.value) {
      if ("cached" in hotRes.value && hotRes.value.cached) {
        hotCoupons = hotRes.value.data as VoucherItem[];
      } else {
        const rawData = hotRes.value?.data || [];
        if (Array.isArray(rawData)) {
          hotCoupons = rawData.map((item: any) => mapCouponItem(item, affiliateLink));
          memoryCache.set(HOT_COUPONS_CACHE_KEY, hotCoupons, CACHE_TTL_MS);
        }
      }
    }

    const responsePayload: VoucherSearchResponse = {
      platform: "shopee",
      cleanUrl,
      affiliateLink,
      productCoupons,
      upcomingCoupons,
      hotCoupons,
      tiktokCoupons: getTikTokCoupons("https://shop.tiktok.com"),
      debugLogs: logs,
    };

    return NextResponse.json(responsePayload);
  } catch (error: any) {
    console.error("[POST /api/vouchers Exception]:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Đã xảy ra lỗi hệ thống.",
        debugLogs: logs,
      },
      { status: 500 }
    );
  }
}
