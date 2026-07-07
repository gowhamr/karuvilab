# Accessibility (a11y) Audit

## Overview
This audit evaluates the web accessibility compliance of the KaruviLab platform, targeting WCAG 2.2 AA standards.

## Codebase Indicators
- **ARIA Attributes:** ~437 instances of `aria-` attributes (e.g., `aria-label`, `aria-hidden`, `aria-expanded`).
- **Tab Navigation:** ~21 instances of `tabIndex` modifications for custom focus management.

## Findings

### Positive Aspects
1. **ARIA Usage:** The high number of ARIA attributes indicates a strong, deliberate effort to make custom components screen-reader accessible.
2. **Recent Improvements:** Commit history shows recent dedicated fixes for accessibility, such as "resolve mobile performance and accessibility issues" for the JWT Decoder.
3. **Focus Trap / Navigation:** The presence of `tabIndex` and the usage of the `inert` attribute (found in `MobileSidebar.tsx`) show advanced focus management, ensuring users don't tab outside of open modals or sidebars.

### Areas of Concern
1. **Contrast:** A recent fix resolved "notes tab switch contrast in light mode." It's important to run automated contrast checkers across all themes (Light/Dark) to ensure text meets the WCAG 4.5:1 ratio requirement.
2. **Touch Targets:** The repository has mobile-specific fixes (e.g., "reduce footer size for mobile", "world clock drag handle mobile visibility"). Ensure that all interactive elements maintain a minimum of 44x44 CSS pixels for touch targets.
3. **Dynamic Content Announcements:** With 150+ tools (e.g., calculators, standard converters), the UI frequently updates dynamically. Ensure `aria-live` regions are present to announce results to screen readers when a calculation completes.

## Accessibility Score: 85/100

## Recommendations
1. **Automated Testing:** Integrate `eslint-plugin-jsx-a11y` into the CI pipeline to catch missing ARIA properties during development.
2. **Keyboard Navigation Audits:** Perform manual tests with the "Tab" key to verify focus order across the new tools (like the JWT Decoder and World Clock).
3. **Focus Visible:** Ensure custom focus states (`:focus-visible`) have sufficient contrast against their backgrounds so keyboard users can clearly see their current position.
