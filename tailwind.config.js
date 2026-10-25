/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#070707",
        navy: { DEFAULT: "#0B1F44", 900: "#061230", 800: "#0B1F44", 700: "#13306B", 600: "#1B4090", 100: "#E6ECF7", 50: "#F3F6FB" },
        gold: { DEFAULT: "#C9A227", 300: "#EAD488", 400: "#DDB73F", 600: "#A18119", 700: "#7C6312" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: { rise: { "0%": { opacity: "0", transform: "translateY(14px)" }, "100%": { opacity: "1", transform: "none" } } },
      animation: { rise: "rise .7s ease-out both" },
    },
  },
  plugins: [],
};
