/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366f1",
        secondary: "#1e1b4b",
        accent: "#f59e0b",
        surface: "#18181b",
        background: "#09090b",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-in": "slideIn 0.4s ease-out",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        glow: {
          "from": { boxShadow: "0 0 20px rgba(99, 102, 241, 0.3)" },
          "to": { boxShadow: "0 0 30px rgba(99, 102, 241, 0.6)" },
        },
      },
    },
  },
  plugins: [],
}