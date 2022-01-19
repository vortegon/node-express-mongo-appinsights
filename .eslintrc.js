module.exports = {
  parserOptions: {
    sourceType: 'module'
  },
  parser: 'babel-eslint',
  env: {
    node: true
  },
  extends: ['airbnb-base', 'plugin:jest/recommended', 'prettier'],
  plugins: ['prettier', 'jest'],
  rules: {
    'prettier/prettier': 'error',
    'no-use-before-define': ['error', 'nofunc'],
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }]
  }
};
