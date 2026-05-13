import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // Removed the "src/" from these paths
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      },
      colors: {
        offWhite: "#F7F7F8",
        matteBlack: "#1C1C1C",
        accentBlue: "#0055FF",
        accentRed: '#EF4444',
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
export default config;