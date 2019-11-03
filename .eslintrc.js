module.exports = {
  root: true,
  env: {
    node: true,
    jest: true
  },
  'extends': [
    'plugin:vue/essential',
    '@vue/prettier',
    'plugin:jest/recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  plugins: ['jest'],
  rules: {
    'jest/consistent-test-it': ["error", {"fn": "it"}],
    'jest/expect-expect': 0,
    'jest/no-test-callback': 0
  }
}
