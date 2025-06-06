import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.+(js|jsx|ts|tsx)"],
    ignores: ["node_modules", ".next", "lib", "dist", "app/lib"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-unused-imports": "off",
      "@typescript-eslint/no-unused-imports-ts": "off",
      "@typescript-eslint/no-unused-imports-tsx": "off",
      "@typescript-eslint/no-unused-imports-tsx": "off",
    },
  },
];

export default eslintConfig;
