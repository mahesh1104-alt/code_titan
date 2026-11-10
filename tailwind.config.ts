import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#b9ddfe",
          300: "#7cc2fd",
          400: "#36a2fa",
          500: "#164E8A", // TechNova primary
          600: "#0f3d6e",
          700: "#0b2c50",
          800: "#08203a",
          900: "#051627",
        },
        accent: {
          50: "#fffdf0",
          100: "#fff9c2",
          200: "#fff185",
          300: "#fee447",
          400: "#F4B942", // TechNova accent
          500: "#e59e1b",
          600: "#c77c12",
          700: "#9d5811",
          800: "#804414",
          900: "#6a3714",
        },
      },
    },
  },
  plugins: [],
};
export default config;
