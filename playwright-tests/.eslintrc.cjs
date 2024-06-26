/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@repo/eslint-config/next.js'],
  parser: '@typescript-eslint/parser',
  rules: {
    'import/no-extraneous-dependencies': ['off'],
    'no-restricted-syntax': ['off'],
    'no-console': 'off',
  },
};
