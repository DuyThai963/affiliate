# 🛍️ Shopee, TikTok Shop & F&B Deals (Mobile-First PWA)

Ứng dụng web tối ưu cho điện thoại di động (Mobile-First PWA) xây dựng bằng **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS** và **Lucide Icons**, kết hợp 2 hệ sinh thái:
1. **Săn Mã Sàn (E-Commerce)**: Shopee (Coupon code, mã theo link, mã hot, mã sắp diễn ra) & TikTok Shop (Trợ giá sàn, voucher LIVE).
2. **Cà Phê & Deal (F&B)**: Tích hợp 2 chiến dịch lớn từ Accesstrade là **Highlands Coffee (Zalo Redeem - 774)** và **The Coffee House (756)** với trang riêng biệt (`/highlands` & `/tch`).

---

## 🌟 Tính Năng Nổi Bật Mới Bổ Sung

### 1. Trang Riêng Biệt Cho Highlands Coffee & The Coffee House
- **Trang Highlands Coffee (`/highlands`)**:
  - Giao diện đỏ đô đặc trưng, nút **Back (&larr; Quay lại Home)** tiện lợi.
  - Tích hợp săn deal **Mua 1 Tặng 1**, Giảm 30K Trà Sen Vàng qua **Zalo Mini App**.
  - Hướng dẫn 3 bước đổi mã QR trực tiếp tại quầy thu ngân.
- **Trang The Coffee House (`/tch`)**:
  - Giao diện cam nâu đặc trưng của Nhà, nút **Back (&larr; Quay lại Home)**.
  - Săn mã **Mua 2 Tặng 1**, FreeShip 30K, mã giảm giá trực tiếp trên App.
  - Bộ lọc trạng thái: *Đang áp dụng*, *Sắp hết hạn*, *Sắp diễn ra*.

### 2. Backend Route Handler `GET /api/fnb-deals`
- Gọi đồng thời (`Promise.allSettled`) dữ liệu 2 chiến dịch ID `774` và `756` qua các endpoint của Accesstrade.
- Tự động tạo link Affiliate cá nhân qua `/v1/product_link/create` cho cả Highlands và The Coffee House.
- Tự động tính toán trạng thái deal theo thời gian thực (`Đang áp dụng`, `Sắp hết hạn`, `Sắp diễn ra`).
- Bộ đệm In-memory Cache 30 phút chống rate-limit, hỗ trợ làm mới thủ công qua query `?refresh=true`.

### 3. Thanh Bottom Navigation Chuẩn Mobile App
- **Tab 1 - Săn mã Sàn**: Giữ nguyên tính năng dán link Shopee / TikTok Shop, hiển thị 2 khung voucher trực quan.
- **Tab 2 - Cà phê & Deal**: Tự động tải ưu đãi F&B khi mở tab (không cần ô nhập link), kèm 2 thẻ thương hiệu lớn bấm sang trang riêng `/highlands` và `/tch`.

---

## 📁 Cấu trúc Thư mục

```text
MyCoupon/
├── app/
│   ├── api/
│   │   ├── fb-funnel/route.ts        # Kích hoạt comment Facebook Graph API v19.0
│   │   ├── fnb-deals/route.ts        # Backend API F&B: Highlands (774) & TCH (756)
│   │   └── vouchers/route.ts         # Backend API: Shopee & TikTok Shop
│   ├── globals.css                   # Tokens, ticket styling, dark mode
│   ├── highlands/
│   │   └── page.tsx                  # TRANG RIÊNG Highlands Coffee (Zalo Redeem) có nút Back
│   ├── tch/
│   │   └── page.tsx                  # TRANG RIÊNG The Coffee House có nút Back
│   ├── layout.tsx                    # PWA Metadata, appleWebApp, themeColor, Viewport
│   └── page.tsx                      # Giao diện Home tích hợp Bottom Navigation 2 chế độ
├── components/
│   ├── BottomNav.tsx                 # Thanh điều hướng App cố định dưới đáy màn hình
│   ├── FnbDealCard.tsx               # Thẻ deal F&B (Highlands đỏ / TCH cam, nút Zalo / Copy)
│   ├── FnbHubView.tsx                # Giao diện Tab Cà phê & Deal (2 Card lớn + Lọc deal)
│   ├── Header.tsx                    # Thanh tiêu đề, logo PWA, toggle Dark/Light
│   ├── LinkInputBar.tsx              # Sticky Top: Input Shopee/TikTok + Nút "Dán" + Nút "Xóa"
│   ├── QuickActionBar.tsx            # Nút "Mở Shopee ngay" & "Mở qua Facebook (Săn mã 20%)"
│   ├── TikTokShopCard.tsx            # Thẻ TikTok Shop với 1 nút to duy nhất
│   ├── Toast.tsx                     # Floating Toast notification
│   ├── VoucherCard.tsx               # Thẻ voucher Shopee & TikTok
│   ├── VoucherList.tsx               # 2 Khung: Mã sản phẩm & Mã toàn sàn (Shopee / TikTok)
│   └── VoucherSkeleton.tsx           # Shimmer Loading Skeleton
├── lib/
│   ├── cache.ts                      # In-memory Cache cho Hot Coupons & F&B Deals
│   └── url-resolver.ts               # Domain Detection, giải nén vt.tiktok.com & s.shopee.vn
├── public/
│   ├── icons/                        # PWA Icons & Brand Logo
│   └── manifest.json                 # Web App Manifest cài đặt PWA
├── types/
│   ├── fnb.ts                        # TypeScript types cho F&B (Highlands & TCH)
│   └── voucher.ts                    # TypeScript types cho E-Commerce
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
HIGHLANDS_CAMPAIGN_ID=774
TCH_CAMPAIGN_ID=756

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
