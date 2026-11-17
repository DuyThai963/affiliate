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
          50: "#fff5f1",
          100: "#ffe8e0",
          200: "#ffd5c7",
          300: "#ffb49e",
          400: "#ff8266",
          500: "#ee4d2d",
          600: "#dc3614",
          700: "#b9290c",
          800: "#98240f",
          900: "#7c2213",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
