import reactHooks from "eslint-plugin-react-hooks";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import nextPlugin from "@next/eslint-plugin-next";

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
      "scripts/**"
    ]
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      "react-hooks": reactHooks,
      "@typescript-eslint": tsPlugin,
      "@next/next": nextPlugin
    },
    rules: {
      "react-hooks/exhaustive-deps": "error",
      "no-console": "off"
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
