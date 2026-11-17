# 🛍️ Shopee & TikTok Shop Voucher Finder & Affiliate Auto-Gen (Mobile-First PWA)

Ứng dụng web tối ưu cho điện thoại di động (Mobile-First PWA) xây dựng bằng **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS** và **Lucide Icons**, hỗ trợ **Tự nhận diện Shopee & TikTok Shop** và tích hợp chuẩn API Accesstrade:

---

## 🌟 Cải Tiến Kiến Trúc & UI Mới Nhất

### 1. Khắc phục triệt để kết nối API Accesstrade
- **Chuẩn hóa Query Parameter:** Chuyển sang sử dụng `domain=shopee.vn` (thay vì `merchant=shopee`) để truy xuất kho voucher thực tế hơn 7,000 mã của Accesstrade.
- **Trích xuất Code toàn diện:** Hỗ trợ đọc cả `item.coupons[0].coupon_code` và `item.coupon_code` (Mã giảm giá, Mã FSV Freeship, Hoàn xu).
- **Hệ thống Server Log chi tiết (`debugLogs`):** Ghi nhận trạng thái từng request và hiển thị trực tiếp trên giao diện qua nút "Xem log phản hồi API Accesstrade".

### 2. Giao diện 2 Khung Trực Quan (Không còn ẩn tab)
- **Tải sẵn mã ngay khi mở web:** Tự động gọi `GET /api/vouchers` để tải trước toàn bộ mã Hot toàn sàn và mã Sắp diễn ra. Người dùng vừa mở app lên là có thể copy mã mua ngay.
- **Khung 1 (Ở trên): Mã Áp Dụng Cho Sản Phẩm Vừa Tìm:**
  - Hiển thị khi người dùng dán link và bấm tìm kiếm.
  - Phân loại rõ các mã dành riêng cho sản phẩm đó.
- **Khung 2 (Ở dưới): Mã Toàn Sàn & Sắp Diễn Ra:**
  - **Mã Hot Toàn Sàn:** Các mã áp dụng ngay (FreeShip 30k, Hoàn xu 50k, giảm giá 100k...) có sẵn nút Copy và nút Dùng ngay.
  - **Mã Sắp Diễn Ra:** Các mã ngày mai và khung giờ kế tiếp, **sắp xếp theo thời gian từ gần đến xa** với thanh tiến độ gradient và đếm ngược thời gian.

---

## 📁 Cấu trúc Thư mục

```text
MyCoupon/
├── app/
│   ├── api/
│   │   ├── fb-funnel/route.ts        # Kích hoạt comment Facebook Graph API v19.0
│   │   └── vouchers/route.ts         # GET (load trước mã sàn) & POST (tìm theo link + debugLogs)
│   ├── globals.css                   # Tokens, ticket styling, dark mode
│   ├── layout.tsx                    # PWA Metadata, appleWebApp, themeColor, Viewport
│   └── page.tsx                      # Giao diện chính Mobile-First 2 khung trực quan
├── components/
│   ├── Header.tsx                    # Thanh tiêu đề, logo PWA, toggle Dark/Light
│   ├── LinkInputBar.tsx              # Sticky Top: Input Shopee/TikTok + Nút "Dán" + Nút "Xóa"
│   ├── QuickActionBar.tsx            # Nút "Mở Shopee ngay" & "Mở qua Facebook (Săn mã 20%)"
│   ├── TikTokShopCard.tsx            # Thẻ TikTok Shop với 1 nút to duy nhất "Mở TikTok Shop"
│   ├── Toast.tsx                     # Floating Toast notification
│   ├── VoucherCard.tsx               # Thẻ voucher kiểu Riokupon: 3 cột, logo Shopee, progress bar, Copy, Dùng ngay
│   ├── VoucherList.tsx               # Hiển thị 2 Khung: Mã sản phẩm & Mã toàn sàn / Sắp diễn ra
│   └── VoucherSkeleton.tsx           # Shimmer Loading Skeleton
├── lib/
│   ├── cache.ts                      # In-memory Cache 10 phút cho Hot & Upcoming Coupons
│   └── url-resolver.ts               # Domain Detection, giải nén vt.tiktok.com & s.shopee.vn
├── public/
│   ├── icons/
│   │   ├── icon-192.svg              # App Icon PWA 192x192
│   │   └── icon-512.svg              # App Icon PWA 512x512
│   └── manifest.json                 # Web App Manifest cài đặt PWA
├── types/
│   └── voucher.ts                    # TypeScript types (debugLogs, upcomingCoupons, SupportedPlatform)
├── .env.example                      # File mẫu biến môi trường
├── .env.local                        # File cấu hình môi trường thực tế
└── README.md
```

---

## ⚙️ Cấu hình Biến Môi trường (.env.local)

```env
# ACCESSTRADE
ACCESSTRADE_API_KEY=BJtpG55PGJtKBW50l-JvH_xgKrXBGkJZ
SHOPEE_CAMPAIGN_ID=4751584435713464237
TIKTOK_CAMPAIGN_ID=749

# FACEBOOK FUNNEL (Tùy chọn)
FB_PAGE_ID=61596746547167
FB_POST_ID=61596746547167
FB_PAGE_ACCESS_TOKEN=
```

---

## 🚀 Khởi chạy Dự án

```bash
# Chạy môi trường Dev
npm run dev

# Build kiểm tra Production
npm run build
npm run start
```
Mở trình duyệt truy cập: [http://localhost:3000](http://localhost:3000)
