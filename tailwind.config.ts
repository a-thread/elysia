import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

const config: Config = {
  darkMode: "class", // Enables class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx,mdx}",
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["InterVariable", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        leafGreen: {
          50: "#f0f8eb",
          100: "#d9eed4",
          200: "#b3dbaa",
          300: "#8dc880",
          400: "#67b456",
          500: "#4a9c3d",
          600: "#3a6b41",
          700: "#2f5734",
          800: "#23412a",
          900: "#162d1e",
        },
      },
    },
  },
  plugins: [],
};

export default config;
