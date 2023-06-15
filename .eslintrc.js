module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true
  },
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': [
      'warn',
      {
        printWidth: 120,
        singleQuote: true,
        tabWidth: 2,
        useTabs: false,
        trailingComma: 'none',
        arrowParens: 'avoid',
        semi: false,
        endOfLine: 'auto'
      }
    ]
  }
}
