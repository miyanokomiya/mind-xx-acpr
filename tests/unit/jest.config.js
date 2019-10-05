module.exports = {
  rootDir: '../../',
  setupFiles: ['<rootDir>/tests/unit/setup.js'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'vue'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '.+\\.(css|styl|less|sass|scss|svg|png|jpg|ttf|woff|woff2)$': 'jest-transform-stub',
    '^.+\\.jsx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/tests/puppeteer/',
    '<rootDir>/tests/storybook/',
  ],
  modulePathIgnorePatterns: ['<rootDir>/tests/puppeteer/', '<rootDir>/tests/storybook/'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  snapshotSerializers: ['jest-serializer-vue'],
  testMatch: ['**/tests/unit/**/*.spec.(js|jsx|ts|tsx)'],
  testURL: 'http://localhost/',
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/registerServiceWorker.js',
    '!src/utils/track.js',
    '!**/node_modules/**',
  ],
}
