import reactHooks from "eslint-plugin-react-hooks";

const config = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "public/**",
      "node_modules/**",
      "next-env.d.ts",
      "dist/**",
      "scripts/**",
      "*.js",
      "*.ts",
      "*.cjs"
    ]
  },
  {
    plugins: {
      "react-hooks": reactHooks
    },
    rules: {
      "react-hooks/exhaustive-deps": "error",
      "no-console": "off",
      "jsx-a11y/control-has-associated-label": "off",
      "react/no-unescaped-entities": "off",
      "react-hooks/set-state-in-effect": "off",
      "@next/next/no-img-element": "off"
    }
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["src/lib/security.ts"],
    rules: {
      "no-restricted-imports": ["error", {
        "paths": [{
          "name": "dompurify",
          "message": "Never import DOMPurify directly in UI components. Always use sanitizeHtml() from '@/src/lib/security' (Rule P-21)."
        }]
      }]
    }
  }
];

export default config;
