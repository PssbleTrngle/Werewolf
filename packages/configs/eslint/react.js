import eslintReact from "@eslint-react/eslint-plugin";
import baseOverrides from "./base.js";

/**
 * @param {string} tsconfigRootDir
 * @returns {import("eslint").Linter.Config[]}
 */
export default function overrides(tsconfigRootDir) {
  return [
    ...baseOverrides(tsconfigRootDir),
    {
      extends: [eslintReact.configs["recommended-typescript"]],
    },
  ];
}
