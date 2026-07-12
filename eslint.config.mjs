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
  }
];

export default config;
