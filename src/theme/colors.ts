export const colors = {
  // Brand color mappings
  primary: {
    DEFAULT: "var(--color-primary)",
    glow: "var(--color-brand-glow)",
  },
  secondary: "var(--color-secondary)",
  success: "var(--color-success)",
  error: "var(--color-error)",
  warning: "var(--color-warning)",
  danger: "var(--color-danger)",
  divider: "var(--color-divider)",

  blue: {
    DEFAULT: "var(--color-blue)",
    dark: "var(--color-blue-dark)",
    light: "var(--color-blue-light)",
    glow: "var(--color-blue-glow)",
  },
  ocean: "var(--color-ocean)",
  warn: "var(--color-warn)",

  bg: {
    DEFAULT: "var(--color-bg)",
    input: "var(--color-bg-input)",
  },
  surface: "var(--color-surface)",
  elevated: "var(--color-elevated)",
  surfaceElevated: "var(--color-surface-elevated)",
  hover: "var(--color-hover)",
  
  border: {
    DEFAULT: "var(--color-border)",
    2: "var(--color-border-2)",
    focus: "var(--color-border-focus)",
  },
  
  text: {
    DEFAULT: "var(--color-text)",
    1: "var(--color-text-1)",
    2: "var(--color-text-2)",
    3: "var(--color-text-3)",
    4: "var(--color-text-4)",
    muted: "var(--kv-text-muted)",
    primary: "var(--color-text-primary)",
    secondary: "var(--color-text-secondary)",
  },

  mat: {
    base: "var(--color-mat-base)",
    surface: "var(--color-mat-surface)",
    raised: "var(--color-mat-raised)",
    overlay: "var(--color-mat-overlay)",
    hover: "var(--color-mat-hover)",
    border: "var(--color-mat-border)",
    "border-focus": "var(--color-mat-border-focus)",
  },
  brand: {
    primary: "var(--color-brand-primary)",
    glow: "var(--color-brand-glow)",
  },
} as const;
