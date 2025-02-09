// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");
const typescriptEslint = require("@typescript-eslint/eslint-plugin");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    plugins: {
      typescriptEslint,
    },
    processor: angular.processInlineTemplates,
    rules: {
      ...eslintConfigPrettier.rules,
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
    // overrides: [
    //   {
    //     files: ["*.ts"],
    //     parserOptions: {
    //       project: [
    //         "tsconfig.*?.json",
    //         "e2e/tsconfig.json"
    //       ],
    //       createDefaultProgram: true
    //     },
    //     extends: [
    //       "plugin:@angular-eslint/recommended",
    //       'prettier/@typescript-eslint',
    //       'plugin:prettier/recommended'
    //     ],
    //     rules: {
    //     }
    //   },
    // ]
  },
);
