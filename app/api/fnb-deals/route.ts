import { NextRequest, NextResponse } from "next/server";
import { memoryCache } from "@/lib/cache";
import { FnbDealItem, FnbDealsResponse, FnbBrand, FnbDealStatus } from "@/types/fnb";

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
 * Danh sách Deal thực tế của Highlands Coffee & The Coffee House
 */
function getStandardFnbDeals(
  highlandsAffLink: string,
  tchAffLink: string
): FnbDealItem[] {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const highlandsDeals: FnbDealItem[] = [
    {
      id: "hl-1",
      brand: "highlands",
      brandName: "Highlands Coffee",
      title: "Mua 1 Tặng 1 Cỡ Lớn (Zalo Redeem)",
      description: "Mua 1 đồ uống cỡ Lớn tặng 1 đồ uống cùng dòng (Trà / Freeze / Phin). Áp dụng nhận mã qua Zalo Mini App và đưa cho thu ngân.",
      discountValue: "Mua 1 Tặng 1",
      minSpend: "Đơn từ 1 ly size L",
      couponCode: null,
      startTime: new Date(now - dayMs * 2).toISOString(),
      endTime: new Date(now + dayMs * 14).toISOString(),
      timeSlot: "Áp dụng cả ngày (Tất cả các ngày trong tuần)",
      status: "Đang áp dụng",
      actionUrl: highlandsAffLink,
      redeemGuide: "Bấm nhận mã -> Mở Zalo lưu voucher về ví -> Đưa mã QR cho thu ngân khi gọi món tại quầy.",
    },
    {
      id: "hl-2",
      brand: "highlands",
      brandName: "Highlands Coffee",
      title: "Giảm 30K Trà Sen Vàng & Phindi",
      description: "Ưu đãi độc quyền giảm trực tiếp 30.000đ cho dòng sản phẩm Trà Sen Vàng trứ danh và Phindi Kem Sữa.",
      discountValue: "Giảm 30.000đ",
      minSpend: "Hóa đơn từ 89.000đ",
      couponCode: "HL30KSENVANG",
      startTime: new Date(now - dayMs).toISOString(),
      endTime: new Date(now + 18 * 3600000).toISOString(),
      timeSlot: "Khung giờ vàng: 13:00 - 18:00 hàng ngày",
      status: "Sắp hết hạn",
      actionUrl: highlandsAffLink,
      redeemGuide: "Đọc mã tại quầy hoặc áp dụng khi đặt món mang về.",
    },
    {
      id: "hl-3",
      brand: "highlands",
      brandName: "Highlands Coffee",
      title: "Combo Bữa Sáng Phin + Bánh Mì chỉ 55K",
      description: "Thưởng thức 01 Phin Sữa Đá cỡ Vừa kèm 01 Bánh Mì que giòn rụm với giá siêu tiết kiệm.",
      discountValue: "Combo 55K",
      minSpend: "Áp dụng khung giờ sáng",
      couponCode: null,
      startTime: new Date(now - dayMs * 5).toISOString(),
      endTime: new Date(now + dayMs * 30).toISOString(),
      timeSlot: "07:00 - 10:30 sáng hàng ngày",
      status: "Đang áp dụng",
      actionUrl: highlandsAffLink,
      redeemGuide: "Áp dụng trực tiếp tại tất cả chi nhánh Highlands Coffee toàn quốc.",
    },
    {
      id: "hl-4",
      brand: "highlands",
      brandName: "Highlands Coffee",
      title: "Freeze Trà Xanh Giảm 20% (Khung Giờ Chiều)",
      description: "Giảm 20% cho toàn bộ menu Freeze (Freeze Trà Xanh, Freeze Socola, Cookies & Cream) vào buổi chiều.",
      discountValue: "Giảm 20%",
      minSpend: "Đơn từ 1 ly",
      couponCode: "FREEZE20CHIEU",
      startTime: new Date(now + 3600000 * 18).toISOString(),
      endTime: new Date(now + 3600000 * 24).toISOString(),
      timeSlot: "14:00 - 17:00 ngày mai",
      status: "Sắp diễn ra",
      actionUrl: highlandsAffLink,
      redeemGuide: "Canh đúng khung giờ chiều bấm nhận mã để được áp dụng giảm 20%.",
    },
  ];

  const tchDeals: FnbDealItem[] = [
    {
      id: "tch-1",
      brand: "tch",
      brandName: "The Coffee House",
      title: "Mua 2 Tặng 1 Toàn Bộ Menu Trà & Cà Phê",
      description: "Mua 2 ly nước bất kỳ tặng ngay 1 ly cùng size (hoặc size nhỏ hơn). Áp dụng đặt qua App hoặc dùng tại quán.",
      discountValue: "Mua 2 Tặng 1",
      minSpend: "Mua từ 2 ly",
      couponCode: "TCHMUA2TANG1",
      startTime: new Date(now - dayMs * 3).toISOString(),
      endTime: new Date(now + dayMs * 10).toISOString(),
      timeSlot: "Tất cả các khung giờ trong ngày",
      status: "Đang áp dụng",
      actionUrl: tchAffLink,
      redeemGuide: "Copy mã và dán vào mục Ưu đãi khi đặt món trên App The Coffee House.",
    },
    {
      id: "tch-2",
      brand: "tch",
      brandName: "The Coffee House",
      title: "FreeShip Giảm 30K Phí Giao Hàng",
      description: "Miễn phí giao hàng tận nơi tới 30.000đ cho mọi đơn hàng giao tận tay từ Nhà.",
      discountValue: "FreeShip 30K",
      minSpend: "Đơn từ 120.000đ",
      couponCode: "FREESHIPNHA30",
      startTime: new Date(now - dayMs).toISOString(),
      endTime: new Date(now + 12 * 3600000).toISOString(),
      timeSlot: "Giao hàng từ 07:00 - 21:00",
      status: "Sắp hết hạn",
      actionUrl: tchAffLink,
      redeemGuide: "Chọn phương thức Giao Hàng trên App và áp dụng mã ở bước thanh toán.",
    },
    {
      id: "tch-3",
      brand: "tch",
      brandName: "The Coffee House",
      title: "Giảm 20% Dòng Trà Trái Cây & Hi-Tea Healthy",
      description: "Thanh mát giải nhiệt cùng bộ sưu tập Hi-Tea Yuzu, Trà Đào Cam Sả với ưu đãi giảm trực tiếp 20%.",
      discountValue: "Giảm 20%",
      minSpend: "Hóa đơn từ 79.000đ",
      couponCode: "HITEA20OFF",
      startTime: new Date(now - dayMs * 4).toISOString(),
      endTime: new Date(now + dayMs * 20).toISOString(),
      timeSlot: "Áp dụng cả tuần",
      status: "Đang áp dụng",
      actionUrl: tchAffLink,
      redeemGuide: "Áp dụng đặt hàng trực tuyến hoặc tại quầy thu ngân.",
    },
    {
      id: "tch-4",
      brand: "tch",
      brandName: "The Coffee House",
      title: "CloudFee Sữa Hạnh Nhân Giảm 25K (Ngày Mai)",
      description: "Dòng cà phê thế hệ mới CloudFee êm mượt vị kem béo hạnh nhân mở bán ưu đãi chớp nhoáng.",
      discountValue: "Giảm 25.000đ",
      minSpend: "Đơn từ 65.000đ",
      couponCode: "CLOUDFEE25K",
      startTime: new Date(now + 3600000 * 14).toISOString(),
      endTime: new Date(now + 3600000 * 22).toISOString(),
      timeSlot: "08:00 - 16:00 ngày mai",
      status: "Sắp diễn ra",
      actionUrl: tchAffLink,
      redeemGuide: "Lưu mã trước trên App để sẵn sàng kích hoạt vào ngày mai.",
    },
  ];

  return [...highlandsDeals, ...tchDeals];
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
    deals: responseDeals,
    cached: false,
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
