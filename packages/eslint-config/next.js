const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  plugins: ['prettier'],
  extends: [
    'airbnb',
    'next/core-web-vitals',
    'plugin:@typescript-eslint/recommended',
    'eslint-config-turbo',
    'plugin:prettier/recommended',
  ],
  rules: {
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/control-has-associated-label': 'off',
    //   "prettier/prettier": "error",
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'jsx-quotes': ['error', 'prefer-single'],
    'no-console': 'warn',
    'max-len': 'off',
    camelcase: [
      'warn',
      {
        ignoreDestructuring: true,
        properties: 'never',
      },
    ],
    //   "func-names": "off",
    //   "no-process-exit": "off",
    //   "object-shorthand": "off",
    //   "class-methods-use-this": "off"
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'react/jsx-filename-extension': [
      'warn',
      {
        extensions: ['.jsx', '.tsx'],
      },
    ],
    'react/no-array-index-key': 'warn',
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        mjs: 'never',
      },
    ],
  },
  overrides: [
    // Do not require default exports in API Routes
    {
      files: [
        '**/route.ts',
        'middleware.ts',
        'pages/api/**/*.ts',
        'app/api/**/*.tsx',
      ],
      rules: {
        'import/prefer-default-export': 'off',
      },
    },
    // allow restricted syntax in tests
    {
      files: ['**/*.test.ts', '**/*.spec.ts', 'playwright-tests/**'],
      rules: {
        'no-restricted-syntax': 'off',
      },
    },
    // Allow require to be used in tailwind config
    {
      files: ['tailwind.config.js'],
      rules: {
        'global-require': 'off',
      },
    },
    // Temp: Disable camelcase for review creation page as it uses a lot of snake_case for form fields
    {
      files: ['app/reviews/create/form.tsx', 'app/reviews/create/actions.ts'],
      rules: {
        camelcase: 'off',
      },
    },
  ],
  globals: {
    React: true,
    JSX: true,
  },
  env: {
    node: true,
    browser: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    '.*.js',
    'node_modules/*',
    '.next/*',
    'tests-examples/*',
    'supabase.types.ts',
    'next.config.js',
  ],
};
