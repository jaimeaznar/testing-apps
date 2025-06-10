module.exports = {
  root: true,
  env: {
    node: true,
    browser: true,
    es6: true,
  },

  extends: [
    'eslint:recommended',
    '@nuxtjs', // nuxt-related configuration
    '@nuxtjs/eslint-config-typescript', // nuxt-related configuration
    'plugin:nuxt/recommended', // nuxt-related configuration
    'plugin:vue/base',
    'plugin:vue/essential',
    'plugin:vue/recommended',
    '@vue/prettier',
    'prettier',
    'plugin:prettier/recommended',
  ],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    curly: 'error',
    'no-debugger': 'error',
    'no-array-constructor': 'off',
    'prefer-const': 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        ignoreRestSiblings: true,
      },
    ],
    'prettier/prettier': [
      // former prettierrc rules
      'error',
      {
        singleQuote: true,
        semi: true,
        trailingComma: 'all',
      },
    ],
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
};
