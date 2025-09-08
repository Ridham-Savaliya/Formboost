// eslint.config.cjs
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';

export default [
  {
    ignores: ['node_modules', 'dist', 'build'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module', // Changed from 'commonjs' to 'module' for ESM,
      globals: {
        ...globals.node,
        ...globals.browser, // optional, if you also target the browser
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    rules: {
      ...js.configs.recommended.rules,
      'prettier/prettier': 'error',
      'no-unused-vars': 'warn', // Downgrade unused-vars to warning
      'no-undef': 'error', // Enforce detection of undefined variables
    },
    plugins: {
      prettier: prettierPlugin,
    },
  },
  prettier,
];
