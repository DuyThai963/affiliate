import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        shopee: {
          50: "#fdf6f2",
          100: "#fbebe3",
          200: "#f7d5c4",
          300: "#f0b69c",
          400: "#e58e6e",
          500: "#d96947", // Soft warm terracotta, không neon
          600: "#c45433",
          700: "#a34125",
          800: "#863620",
          900: "#6e301d",
        },
        highlands: {
          50: "#fcf4f5",
          100: "#f8e6e7",
          500: "#982b32", // Muted Burgundy sang trọng
          600: "#822127",
        },
        tch: {
          50: "#fdf7f1",
          100: "#f9ede0",
          500: "#b86c28", // Warm caramel latte
          600: "#9e591c",
        },
        tiktok: {
          red: "#fe2c55",
          redHover: "#e0264b",
          cyan: "#25f4ee",
          dark: "#121212",
          surface: "#18181c",
          pill: "#26262b",
        },
        canvas: {
          light: "#faf9f6", // Giấy kem mỹ thuật ấm dịu
          card: "#ffffff",
          dark: "#121214", // Than chì êm dịu, không đen kịt
          cardDark: "#1a1a1e",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
