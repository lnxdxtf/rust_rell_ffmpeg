/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
  ],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        bg: {
          1: "#1c1830",
          2: "#293052"
        },
        main: {
          1: "",
          2: "#7175fe",
          3: "#9c9ee9",
        }
      }
    },
  },
  plugins: [

  ],
}