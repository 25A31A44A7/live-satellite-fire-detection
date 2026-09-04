import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        space: {
          950: "#04070d",
          900: "#070c18",
          850: "#0a1122",
          800: "#0f1a30",
          700: "#182846",
          600: "#23395d",
        },
        satellite: {
          cyan: "#00e5ff",
          blue: "#38bdf8",
          amber: "#f59e0b",
          orange: "#ff5722",
          crimson: "#ff1744",
          emerald: "#10b981",
        },
        fire: {
          low: "#10b981",
          moderate: "#eab308",
          high: "#f97316",
          critical: "#ef4444",
          industrial: "#a855f7",
        }
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ping-slow": "ping 2s cubic-bezier(0, 0, 0.2, 1) infinite",
        "radar-sweep": "radar 4s linear infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        radar: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(255, 69, 0, 0.4)" },
          "100%": { boxShadow: "0 0 20px rgba(255, 69, 0, 0.9)" },
        }
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
