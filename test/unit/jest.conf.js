const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, '../../'),
  moduleFileExtensions: ['vue', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // '\\.(css|scss)$': '<rootDir>/node_modules/jest-css-modules'
    // '\\.(css|less)$': 'identity-obj-proxy'
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.js$': '<rootDir>/node_modules/babel-jest',
    // '.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
    '^.+\\.jsx?$': '<rootDir>/node_modules/babel-jest',
    '.*\\.(vue)$': '<rootDir>/node_modules/jest-vue-preprocessor'
    // '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
    //   './fileTransformer.js'
  },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!(@storybook/.*\\.vue$))'
    // '\\.(css|scss)$'
  ],
  testPathIgnorePatterns: ['<rootDir>/test/e2e', '<rootDir>/test/puppeteer'],
  // snapshotSerializers: ['<rootDir>/node_modules/jest-serializer-vue'],
  setupFiles: ['<rootDir>/test/unit/setup'],
  collectCoverage: false,
  coverageDirectory: '<rootDir>/test/unit/coverage',
  collectCoverageFrom: [
    'src/**/*.{js,vue}',
    '!src/main.js',
    '!src/router/index.js',
    '!**/node_modules/**'
  ]
}
