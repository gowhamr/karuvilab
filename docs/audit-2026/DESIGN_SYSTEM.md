# KaruviLab Design System Audit

## Architecture Overview
KaruviLab employs a hybrid Material Design 2.0 system merged with a custom utility token setup, managed via a mixed Tailwind v3/v4 architecture. 
- **Token Centralization**: The core single-source-of-truth resides in `src/theme/tokens.ts`, mapping properties like colors, radius, typography, spacing, and z-index.
- **Tailwind Integration**: Uses `globals.css` with a `@theme` block alongside `@config "../tailwind.config.ts"`, indicating a transitional or hybrid architectural pattern.
- **CSS Variables**: Extensive use of CSS variables (e.g., `--kv-mat-surface`) provides dynamic theming (Dark/Light/High Contrast) completely independent of Tailwind's built-in dark mode classes.

## Token Adherence & Violations
While a robust token system exists within `src/theme/`, adherence across UI components is inconsistent.

### 1. Z-Index Management
- **Intended Pattern**: Use semantic keys from `zindex.ts` (e.g., `z-modal`, `z-content`).
- **Current State**: Primarily well-adopted. Components like `QRModal` and `BottomNav` correctly use `z-modal` and `z-nav`.
- **Debt**: Duplicate definitions remain in `globals.css` under the `@theme` block as legacy stubs. A comment explicitly states this is tech debt, but it presents a risk of desynchronization.

### 2. Spacing and Sizing
- **Intended Pattern**: Use `tokens.spacing` and Tailwind's default layout utility scales.
- **Violations**: Pervasive use of arbitrary brackets `-[value]` bypassing the spacing scale.
  - Examples found: `min-w-[140px]`, `pb-[136px]` (`ClientLayout.tsx`), `max-w-[120px]` (`WorkbenchClient.tsx`).
  - Hardcoded padding and positioning: `bottom-[110px]`, `border-[40px]`.
  
### 3. Typography
- **Intended Pattern**: `tokens.typography` defines strict scales (`text-xs` to `text-6xl`).
- **Violations**: Heavy reliance on arbitrary font sizes for edge cases.
  - Micro-typography: `text-[10px]` is widely used in badges, chips, and secondary labels (e.g., `QuickActionsDashboard.tsx`, `Sidebar.tsx`).
  - Hero-typography: Oversized typography in Timer tools using `text-[10rem]`, `text-[14rem]`, and `text-[18rem]` (`CountdownTimerClient.tsx`, `StopwatchClient.tsx`).

### 4. Colors
- **Intended Pattern**: `tokens.colors` defines semantic values (`bg-surface`, `text-muted`, `border`, `mat-hover`).
- **Violations**: Occasional hardcoded hex values completely bypassing theming capabilities.
  - Example: `text-[#1E293B]` in `PrivacyFeatures.tsx`.
  - Occasional arbitrary alpha values: `bg-black/40` when a standardized overlay token could be used.

## Migration & Improvement Recommendations
1. **Complete Tailwind v4 Migration**: Consolidate all token logic exclusively into the `@theme` directive in `globals.css` or convert fully to CSS variables. Eliminate the dual-maintenance of `tailwind.config.ts` and `tokens.css`.
2. **Expand Typography Scale**: Add standard tokens for micro-typography (`text-2xs` for `10px`, `text-3xs` for `8px`) and hero-typography (`text-7xl` to `text-[18rem]`) to eliminate arbitrary bracket usage.
3. **Linting Rules**: Introduce `eslint-plugin-tailwindcss` and configure the `no-custom-classname` rule to strictly forbid arbitrary values (`-[...]`) where a token must be used. Create exceptions only for genuinely dynamic values.
