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
  }
];

export default config;
