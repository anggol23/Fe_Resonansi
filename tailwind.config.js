/* eslint-env node */
/* eslint-disable no-undef */
const flowbite = require("flowbite-react/tailwind");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // File HTML utama
    "./src/**/*.{js,ts,jsx,tsx}", // Semua file React di folder src
    flowbite.content(), // Konten Flowbite
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#eef5fd",
          100: "#dbe9fb",
          200: "#b6d3f6",
          300: "#8ebcf1",
          400: "#5b98e7",
          500: "#2f79da",
          600: "#1c66ca",
          700: "#0d5cb6", // Suara Merdeka-like blue
          800: "#0a4a90",
          900: "#083a72",
        },
        accent: {
          50:  "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
      },
      fontFamily: {
        sans: ["Outfit", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "Noto Sans", "sans-serif"],
      },
    },
  },
  plugins: [
    flowbite.plugin(),
    require("tailwind-scrollbar"), // Plugin Flowbite
    // Tambahkan plugin lain jika diperlukan, misalnya:
    // require("@tailwindcss/forms"),
    // require("@tailwindcss/typography"),
  ],
};
