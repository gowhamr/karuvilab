export const radius = {
  // Spec defined border-radius values
  card: "var(--radius-card)",                 // 22px
  btn: "var(--radius-btn)",                   // 16px
  input: "var(--radius-input)",               // 18px
  "bottom-sheet": "var(--radius-bottom-sheet)", // 32px
  dialog: "var(--radius-dialog)",             // 28px
  fab: "var(--radius-fab)",                   // 999px

  // Tailwind scale compatibility
  xs: "var(--radius-xs)",
  sm: "var(--radius-sm)",
  md: "var(--radius-md)",
  lg: "var(--radius-lg)",
  xl: "var(--radius-xl)",
  "2xl": "var(--radius-2xl)",
  "3xl": "var(--radius-3xl)",
  "4xl": "var(--radius-4xl)",
  "5xl": "var(--radius-5xl)",
  "6xl": "var(--radius-6xl)",
} as const;
