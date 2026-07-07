import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
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
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    plugins: {
      "react-hooks": reactHooks
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/exhaustive-deps": "error",
      "no-console": "off",
      "jsx-a11y/control-has-associated-label": "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "react-hooks/set-state-in-effect": "off",
      "@next/next/no-img-element": "off"
    }
  },
  {
    files: [
      "app/**/*.ts",
      "app/**/*.tsx",
      "src/workers/**/*.ts",
      "src/workers/**/*.js",
      "src/engine/workers/**/*.ts",
      "src/engine/workers/**/*.js",
      "src/__tests__/**/*.ts",
      "src/__tests__/**/*.tsx",
      "src/tool-engine/**/*.ts",
      "src/tool-engine/**/*.tsx",
      "src/utils.ts",
      "src/store/**/*.ts",
      "src/lib/**/*.ts",
      "src/lib/**/*.tsx",
      "src/registry/**/*.ts",
      "src/security/**/*.ts",
      "src/features/**/*.ts",
      "src/features/**/*.tsx",
      "src/hooks/**/*.ts",
      "src/hooks/**/*.tsx",
      "src/file-system/**/*.ts",
      "src/file-system/**/*.tsx",
      "src/globals.d.ts",
      "src/format-utils.ts",
      "src/engine/**/*.ts",
      "src/engine/**/*.tsx",
      "src/data/**/*.ts",
      "components/**/*.ts",
      "components/**/*.tsx"
    ],
    rules: {
      "@typescript-eslint/no-explicit-any": "off"
    }
  }
];

export default config;
