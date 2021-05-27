module.exports = {
  root: true,

  env: {
    node: true,
  },

  extends: [
    // TS config
    // "plugin:vue/vue3-essential",
    // "eslint:recommended",
    // "@vue/typescript/recommended",
    // "@vue/prettier",
    // "@vue/prettier/@typescript-eslint",
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/prettier',
  ],

  parserOptions: {
    // TS config
    // ecmaVersion: 2020,
    // sourceType: 'module',
    // project: './tsconfig.json',
    // tsconfigRootDir: __dirname,
    parser: '@babel/eslint-parser',
  },

  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },

  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)',
      ],
      env: {
        jest: true,
      },
    },
  ],
}
