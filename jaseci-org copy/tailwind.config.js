const theme = require("./config/theme.json");

let font_base = Number(theme.fonts.font_size.base.replace("px", ""));
let font_scale = Number(theme.fonts.font_size.scale);
let h6 = font_base / font_base;
let h5 = h6 * font_scale;
let h4 = h5 * font_scale;
let h3 = h4 * font_scale;
let h2 = h3 * font_scale;
let h1 = h2 * font_scale;
let fontPrimary, fontPrimaryType, fontSecondary, fontSecondaryType;
if (theme.fonts.font_family.primary) {
  fontPrimary = theme.fonts.font_family.primary
    .replace(/\+/g, " ")
    .replace(/:[ital,]*[ital@]*[wght@]*[0-9,;]+/gi, "");
  fontPrimaryType = theme.fonts.font_family.primary_type;
}
if (theme.fonts.font_family.secondary) {
  fontSecondary = theme.fonts.font_family.secondary
    .replace(/\+/g, " ")
    .replace(/:[ital,]*[ital@]*[wght@]*[0-9,;]+/gi, "");
  fontSecondaryType = theme.fonts.font_family.secondary_type;
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    screens: {
      sm: "540px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        text: theme.colors.default.text_color.default,
        light: theme.colors.default.text_color.light,
        dark: theme.colors.default.text_color.dark,
        primary: theme.colors.default.theme_color.primary,
        secondary: theme.colors.default.theme_color.secondary,
        body: theme.colors.default.theme_color.body,
        border: theme.colors.default.theme_color.border,
        "theme-light": theme.colors.default.theme_color.theme_light,
        "theme-dark": theme.colors.default.theme_color.theme_dark,
        // Added custom colors for the new design
        "primary-orange": "#ff6b35",
        "primary-yellow": "#f7931e",
        "dark-bg": "#1a1a1a",
        "medium-bg": "#2d2d2d",
        "light-bg": "#404040",
        "dark-text": "#cccccc",
        "light-text": "#ffffff",
        glass: "rgba(45, 45, 45, 0.7)",
        about: {
          background: "#09090b",
          foreground: "#fafafa",
          card: "#18181b",
          primary: "#f97316",
          secondary: "#3f3f46",
          accent: "#fb923c",
          "muted-foreground": "#a1a1aa",
          border: "#27272a",
        },
        community: {
          background: "#09090b",
          "card-bg": "rgba(24, 24, 27, 0.55)",
          "card-bg-hover": "#18181b",
          border: "#27272a",
          text: "#e7e7ea",
          muted: "#a1a1aa",
          primary: "#f97316",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(90deg, #fb923c, #f97316)",
        "gradient-border": "linear-gradient(90deg, #fb923c, #ea580c)",
      },
      fontSize: {
        base: font_base + "px",
        h1: h1 + "rem",
        "h1-sm": h1 * 0.8 + "rem",
        h2: h2 + "rem",
        "h2-sm": h2 * 0.8 + "rem",
        h3: h3 + "rem",
        "h3-sm": h3 * 0.8 + "rem",
        h4: h4 + "rem",
        h5: h5 + "rem",
        h6: h6 + "rem",
      },
      fontFamily: {
        primary: [fontPrimary, fontPrimaryType],
        secondary: [fontSecondary, fontSecondaryType]
      },
      // Added animations for the new design
      animation: {
        "gradient-border": "gradient-border 4s ease infinite",
        bounce: "bounce 0.6s ease",
        pulse: "pulse 1.5s infinite",
        fadeInLine: "fadeInLine 0.5s ease forwards",
        blink: "blink 1s infinite",
        "blob-pulse": "blob-pulse 8s infinite alternate ease-in-out",
      },
      keyframes: {
        "blob-pulse": {
          "0%": { transform: "scale(1) rotate(0deg)" },
          "100%": { transform: "scale(1.2) rotate(45deg)" },
        },
        "gradient-border": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        bounce: {
          "0%, 20%, 60%, 100%": { transform: "translateY(0) scale(1)" },
          "40%": { transform: "translateY(-10px) scale(1.1)" },
          "80%": { transform: "translateY(-5px) scale(1.05)" },
        },
        pulse: {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.05)", opacity: "0.8" },
        },
        fadeInLine: {
          from: { opacity: "0", transform: "translateX(-10px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        blink: {
          "0%, 50%": { opacity: "1" },
          "51%, 100%": { opacity: "0" },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwind-bootstrap-grid")({ generateContainer: false }),
  ],
};
