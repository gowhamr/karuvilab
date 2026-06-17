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
      height: {
        'tool-viewport': '70vh',
        'tool-viewport-lg': '80vh',
      },
      maxHeight: {
        'tool-viewport': '70vh',
        'tool-viewport-lg': '80vh',
      },
      scale: {
        '98': '0.98',
        '102': '1.02',
      },
      letterSpacing: {
        'widest-sm': '0.1em',
        'widest-md': '0.15em',
        'widest-lg': '0.2em',
        'widest-xl': '0.25em',
        'widest-2xl': '0.3em',
        'widest-3xl': '0.4em',
      }
    },
  },
  darkMode: ["selector", '[data-theme="dark"]'],
};

export default config;
