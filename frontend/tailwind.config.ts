// tailwind.config.js — e-Anatra Cyber-Luxury Edition
// Nouvelle palette : Cyan électrique · Bleu glacier · Turquoise · Argent
import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // ── PRIMARY : Cyan électrique (remplace indigo/primary) ──
        primary: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
          950: "#083344",
        },
        // ── ACCENT : Sky / Bleu glacier ──
        accent: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },
        // ── TEAL : Turquoise lumineux ──
        teal: {
          50: "#f0fdfa",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
          950: "#042f2e",
        },
        // ── SURFACE : Noir profond & Argent métallique ──
        surface: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          700: "#334155",
          800: "#1e293b",
          850: "#131c2e", // custom deep navy
          900: "#0f172a",
          925: "#070f1e", // custom abyss
          950: "#0000", // deepest space black
        },
        // ── GLOW : Effets lumineux ──
        glow: {
          cyan: "rgba(34,211,238,0.15)",
          sky: "rgba(56,189,248,0.12)",
          teal: "rgba(45,212,191,0.12)",
          emerald: "rgba(52,211,153,0.10)",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Consolas", "monospace"],
        display: ["Inter", "system-ui", "sans-serif"], // swap for Syne/Clash if desired
      },
      backgroundImage: {
        // ── Gradients holographiques ──
        "cyber-radial":
          "radial-gradient(circle at 50% 50%, rgba(34,211,238,0.15), transparent 70%)",
        "cyber-mesh":
          "linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(14,165,233,0.05) 50%, rgba(45,212,191,0.08) 100%)",
        "glass-surface":
          "linear-gradient(135deg, rgba(7,25,48,0.8), rgba(3,15,30,0.9))",
        "glass-premium":
          "linear-gradient(135deg, rgba(6,18,40,0.95), rgba(3,10,25,0.98))",
        "hero-gradient":
          "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,182,212,0.12), transparent 70%)",
        "cyan-shimmer":
          "linear-gradient(90deg, transparent, rgba(34,211,238,0.3), transparent)",
        "clip-gradient":
          "linear-gradient(135deg, #67e8f9 0%, #38bdf8 40%, #2dd4bf 80%, #34d399 100%)",
      },
      boxShadow: {
        "glow-cyan": "0 0 30px rgba(34,211,238,0.25)",
        "glow-sky": "0 0 30px rgba(56,189,248,0.2)",
        "glow-teal": "0 0 30px rgba(45,212,191,0.2)",
        "glow-lg-cyan":
          "0 0 80px rgba(34,211,238,0.15), 0 0 160px rgba(34,211,238,0.05)",
        holo: "0 0 60px rgba(34,211,238,0.12), inset 0 0 40px rgba(34,211,238,0.05)",
        "card-glass":
          "0 4px 24px rgba(0,0,0,0.4), 0 1px 0 rgba(34,211,238,0.1)",
        "btn-cyan": "0 0 20px rgba(34,211,238,0.3), 0 4px 12px rgba(0,0,0,0.3)",
        "inset-glow": "inset 0 0 40px rgba(34,211,238,0.06)",
      },
      borderColor: {
        glass: "rgba(34,211,238,0.12)",
        "glass-md": "rgba(34,211,238,0.2)",
        "glass-lg": "rgba(34,211,238,0.35)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-right": "slideRight 0.5s ease-out",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "bounce-dot": "bounceDot 1.4s infinite ease-in-out both",
        float: "float 6s ease-in-out infinite",
        scan: "scan 4s linear infinite",
        "rotate-slow": "rotate 20s linear infinite",
        "rotate-rev": "rotateRev 14s linear infinite",
        shimmer: "shimmer 3s linear infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        bounceDot: {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%": { transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        scan: {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(34,211,238,0.3)" },
          "50%": {
            boxShadow:
              "0 0 40px rgba(34,211,238,0.6), 0 0 80px rgba(34,211,238,0.2)",
          },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.7" },
        },
        rotateRev: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(-360deg)" },
        },
      },
      backdropBlur: {
        xs: "4px",
      },
    },
  },
  plugins: [],
} satisfies Config;
