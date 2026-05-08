/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        aiden: {
          bg: "#050816",
          surface: "#0b1020",
          primary: "#3b82f6",
          secondary: "#8b5cf6",
          text: "#ffffff",
          textMuted: "#94a3b8",
          border: "rgba(255,255,255,0.08)",
          glass: "rgba(255,255,255,0.05)",
        },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [daisyui],
};
