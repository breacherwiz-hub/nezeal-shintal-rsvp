import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        dusty: {
          50: "#f5f7f7",
          100: "#e8eef0",
          200: "#d6e0e5",
          300: "#b9cbd4",
          400: "#9db3c0",
          500: "#7f9aa8",
          600: "#657f8d"
        },
        champagne: "#d9cbb9",
        ink: "#31383c"
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "serif"],
        sans: ["var(--font-montserrat)", "sans-serif"]
      }
    }
  },
  plugins: []
};
export default config;