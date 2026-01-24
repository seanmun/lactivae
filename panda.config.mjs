import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        colors: {
          // Light mode backgrounds
          bg: {
            primary: { value: "#FFFDF5" },    // Warm cream white
            secondary: { value: "#FFF9E8" },  // Slightly warmer
            tertiary: { value: "#F8F7F5" },   // Light gray-cream
          },
          // Text colors
          text: {
            primary: { value: "#1A1A1A" },    // Near black
            secondary: { value: "#4D4D4D" },  // Dark gray
            muted: { value: "#666666" },      // Medium gray
          },
          // Accent colors - Brown (Cow colors)
          accent: {
            primary: { value: "#3D2D22" },    // Dark espresso brown
            secondary: { value: "#C67830" },  // Warm caramel
            warm: { value: "#DE924A" },       // Golden brown
          },
          // Borders
          border: {
            light: { value: "rgba(61, 45, 34, 0.1)" },
            medium: { value: "rgba(61, 45, 34, 0.2)" },
          },
        },
        fonts: {
          heading: { value: "'Playfair Display', Georgia, 'Times New Roman', serif" },
          body: { value: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
          mono: { value: "'JetBrains Mono', 'Courier New', Courier, monospace" },
        },
        fontSizes: {
          xs: { value: "clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)" },
          sm: { value: "clamp(0.875rem, 0.8rem + 0.375vw, 1rem)" },
          base: { value: "clamp(1rem, 0.9rem + 0.5vw, 1.125rem)" },
          lg: { value: "clamp(1.125rem, 1rem + 0.625vw, 1.25rem)" },
          xl: { value: "clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem)" },
          "2xl": { value: "clamp(1.5rem, 1.3rem + 1vw, 2rem)" },
          "3xl": { value: "clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem)" },
          "4xl": { value: "clamp(2.25rem, 1.75rem + 2.5vw, 3.5rem)" },
          "5xl": { value: "clamp(3rem, 2.25rem + 3.75vw, 4.5rem)" },
        },
      },
    },
  },

  // Global CSS
  globalCss: {
    ":root": {
      "--line-height": "1.6",
      "--animation-duration": "0.3s",
      "--transition-duration": "0.3s",
    },
    "html[data-theme='dark']": {
      "--bg-primary": "#1A1310",
      "--bg-secondary": "#2A1F18",
      "--bg-tertiary": "#3D2D22",
      "--text-primary": "#FFFDF5",
      "--text-secondary": "#E8DED6",
      "--text-muted": "#B89E8A",
      "--accent-primary": "#F9E8D4",
      "--accent-secondary": "#E9B175",
      "--accent-warm": "#DE924A",
      "--border-light": "rgba(249, 232, 212, 0.1)",
      "--border-medium": "rgba(249, 232, 212, 0.2)",
    },
    "html[data-reduce-motion='true'] *": {
      animationDuration: "0.01ms !important",
      animationIterationCount: "1 !important",
      transitionDuration: "0.01ms !important",
      scrollBehavior: "auto !important",
    },
    "@media (prefers-reduced-motion: reduce)": {
      "*": {
        animationDuration: "0.01ms !important",
        animationIterationCount: "1 !important",
        transitionDuration: "0.01ms !important",
        scrollBehavior: "auto !important",
      },
    },
    body: {
      fontFamily: "body",
      color: "text.primary",
      bg: "bg.primary",
      lineHeight: "var(--line-height)",
      transition: "background-color 0.3s ease-out, color 0.3s ease-out",
    },
    "html[data-theme='dark'] body": {
      bg: "var(--bg-primary)",
      color: "var(--text-primary)",
    },
  },

  // The output directory for your css system
  outdir: "styled-system",
});
