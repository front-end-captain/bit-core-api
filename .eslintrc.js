module.exports = {
  parserOptions: { tsconfigRootDir: __dirname, project: "./tsconfig.json" },
  root: true,
  parser: "@typescript-eslint/parser",
  ignorePatterns: ["*.d.ts", "dist/**", "*.js", "fixtures/**"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:promise/recommended",
    "plugin:import/errors",
    "plugin:import/typescript",
    "prettier",
  ],
  rules: {
    "import/no-cycle": ["error", { maxDepth: 6 }],
    "import/no-unresolved": "off",
    // "import/default": "off",
    // "import/namespace": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-empty-function": "warn",
    "@typescript-eslint/ban-types": "warn",
    "@typescript-eslint/no-var-requires": "warn",
    "no-console": "error",
    "no-debugger": "error",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "promise/no-nesting": "off"
  },
};
