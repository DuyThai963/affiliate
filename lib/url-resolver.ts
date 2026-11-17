/**
 * Helper xử lý và làm sạch URL Shopee & TikTok
 * - Nhận diện nền tảng (Domain Detection): Shopee hoặc TikTok Shop
 * - Trích xuất link từ văn bản (nếu người dùng dán kèm text)
 * - Giải mã link rút gọn (s.shopee.vn, shp.ee, vt.tiktok.com...) bằng cách follow redirects
 * - Loại bỏ toàn bộ query parameters rác / tracking
 */

export type PlatformType = "shopee" | "tiktok";

const SHOPEE_DOMAINS = [
  "shopee.vn",
  "s.shopee.vn",
  "shp.ee",
  "vn.shp.ee",
  "shope.ee",
];

const TIKTOK_DOMAINS = [
  "tiktok.com",
  "vt.tiktok.com",
  "vm.tiktok.com",
  "shop.tiktok.com",
  "m.tiktok.com",
  "v.douyin.com",
];

// Danh sách các query param cần loại bỏ
const COMMON_TRACKING_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "sp_atk",
  "is_from_signup",
  "smtt",
  "previous_page",
  "xptdk",
  "gad_source",
  "gclid",
  "fbclid",
  "aff_sub",
  "aff_sub1",
  "aff_sub2",
  "aff_sub3",
  "aff_sub4",
  "aff_sub5",
  // TikTok specific params
  "_d",
  "sec_user_id",
  "share_app_id",
  "share_author_id",
  "share_link_id",
  "sharer_language",
  "timestamp",
  "ug_btm",
  "checksum",
  "u_code",
  "preview_pb",
  "source",
];

/**
 * Trích xuất URL hợp lệ từ một chuỗi bất kỳ
 */
export function extractUrl(text: string): string | null {
  if (!text || typeof text !== "string") return null;

  // Regex tìm URL bắt đầu bằng http:// hoặc https://
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const matches = text.match(urlRegex);

  if (matches && matches.length > 0) {
    return matches[0].trim();
  }

  // Nếu người dùng chỉ gõ domain không có http://
  const trimmed = text.trim();
  const allDomains = [...SHOPEE_DOMAINS, ...TIKTOK_DOMAINS];
  if (allDomains.some((d) => trimmed.startsWith(d))) {
    return `https://${trimmed}`;
  }

  return null;
}

/**
 * Nhận diện nền tảng: Shopee hay TikTok
 */
export function detectPlatform(urlStr: string): PlatformType | null {
  try {
    const parsed = new URL(urlStr);
    const hostname = parsed.hostname.toLowerCase();

    if (
      SHOPEE_DOMAINS.some(
        (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
      )
    ) {
      return "shopee";
    }

    if (
      TIKTOK_DOMAINS.some(
        (domain) => hostname === domain || hostname.endsWith(`.${domain}`)
      )
    ) {
      return "tiktok";
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Kiểm tra xem URL có phải link rút gọn cần follow redirect không
 */
function isShortUrl(urlStr: string): boolean {
  return /s\.shopee\.vn|shp\.ee|vn\.shp\.ee|shope\.ee|vt\.tiktok\.com|vm\.tiktok\.com|v\.douyin\.com/i.test(
    urlStr
  );
}

/**
 * Theo dõi chuyển hướng (Redirects) để giải nén URL đích thực sự
 */
async function followRedirects(initialUrl: string): Promise<string> {
  if (!isShortUrl(initialUrl)) {
    return initialUrl;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000); // 7s timeout

    const response = await fetch(initialUrl, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    clearTimeout(timeout);

    // response.url là URL cuối cùng sau khi hoàn tất các bước redirect
    if (response.url && response.url !== initialUrl) {
      return response.url;
    }
    return initialUrl;
  } catch (error) {
    console.warn("Lỗi khi theo dõi redirect của URL:", error);
    return initialUrl;
  }
}

/**
 * Làm sạch query parameters của URL (Shopee hoặc TikTok)
 */
export function cleanUrlParams(rawUrl: string): string {
  try {
    const parsed = new URL(rawUrl);

    // Xóa toàn bộ params tracking
    for (const param of COMMON_TRACKING_PARAMS) {
      parsed.searchParams.delete(param);
    }

    // Nếu query rỗng
    const cleanSearch = parsed.searchParams.toString();
    return `${parsed.origin}${parsed.pathname}${
      cleanSearch ? `?${cleanSearch}` : ""
    }`;
  } catch {
    return rawUrl;
  }
}

/**
 * Hàm chính giải quyết toàn bộ quá trình:
 * 1. Trích xuất URL
 * 2. Nhận diện Platform (Shopee | TikTok)
 * 3. Follow Redirect (giải nén vt.tiktok.com, s.shopee.vn...)
 * 4. Xóa query params rác
 */
export async function resolveUrl(input: string): Promise<{
  success: boolean;
  platform?: PlatformType;
  cleanUrl: string;
  error?: string;
}> {
  const extracted = extractUrl(input);

  if (!extracted) {
    return {
      success: false,
      cleanUrl: "",
      error: "Không tìm thấy đường link hợp lệ trong nội dung bạn vừa nhập.",
    };
  }

  // 1. Nhận diện nền tảng từ URL đầu vào
  let platform = detectPlatform(extracted);

  // 2. Follow redirect nếu là link rút gọn (s.shopee.vn, vt.tiktok.com...)
  const targetUrl = await followRedirects(extracted);

  // 3. Nếu ban đầu chưa nhận diện được hoặc sau redirect domain thay đổi (vd vt.tiktok.com -> shop.tiktok.com)
  if (!platform || isShortUrl(extracted)) {
    platform = detectPlatform(targetUrl) || platform;
  }

  if (!platform) {
    return {
      success: false,
      cleanUrl: "",
      error:
        "Đường dẫn không hợp lệ. Vui lòng nhập link Shopee (shopee.vn, s.shopee.vn, shp.ee) hoặc TikTok (tiktok.com, vt.tiktok.com).",
    };
  }

  // 4. Xóa rác tracking
  const cleanUrl = cleanUrlParams(targetUrl);

  return {
    success: true,
    platform,
    cleanUrl,
  };
}
