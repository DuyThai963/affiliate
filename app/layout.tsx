import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Săn Voucher Shopee & Tạo Link Affiliate",
  description:
    "Công cụ Mobile-First tìm kiếm mã giảm giá Shopee độc quyền và tự động tạo link Affiliate qua Accesstrade",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Săn Voucher",
  },
  icons: {
    icon: "/icons/logo.png",
    apple: "/icons/logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ee4d2d" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <meta name="apple-mobile-web-app-title" content="Săn Voucher" />
        <link rel="apple-touch-icon" href="/icons/logo.png" />
      </head>
      <body className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased selection:bg-shopee-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
