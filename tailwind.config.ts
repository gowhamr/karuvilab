import type { Config } from "tailwindcss";
import { tokens } from "./src/theme/tokens";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: tokens.colors,
      fontSize: tokens.typography,
      boxShadow: tokens.shadows,
      transitionTimingFunction: {
        'expo': tokens.motion.ease.expo,
      },
      transitionDuration: tokens.motion.duration,
      borderRadius: tokens.radius,
      spacing: tokens.spacing,
      zIndex: tokens.zIndex,
    },
  },
  darkMode: ["selector", '[data-theme="dark"]'],
};

export default config;
