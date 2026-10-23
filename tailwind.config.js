/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        light: "#FAFAF9",
        charcoal: "#0C0E12",
        "accent-purple": "#7C3AED",
        "accent-cyan": "#0EA5E9",
        "accent-mint": "#34D399",
        "accent-amber": "#F59E0B",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "Segoe UI", "sans-serif"],
      },
      animation: {
        "border-glow": "borderGlow 8s linear infinite",
        "mesh-drift-1": "orbDrift1 25s ease-in-out infinite",
        "mesh-drift-2": "orbDrift2 28s ease-in-out infinite",
        "mesh-drift-3": "orbDrift3 22s ease-in-out infinite",
        "pulse-slow": "pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
