/**
 * @param {string} tsconfigRootDir
 * @returns {import("eslint").Linter.Config[]}
 */
export default function overrides(tsconfigRootDir) {
  return [
    {
      rules: {
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            argsIgnorePattern: "^_",
          },
        ],
      },
      languageOptions: {
        parserOptions: {
          tsconfigRootDir,
          projectService: true,
        },
      },
    },
  ];
}
