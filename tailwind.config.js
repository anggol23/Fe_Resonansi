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
      // Tambahkan konfigurasi kustomisasi tema jika diperlukan
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
