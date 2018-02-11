const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, './'),
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/../../src/$1'
  },
  transform: {
    '^.+\\.js$': '<rootDir>/../../node_modules/babel-jest'
  },
  setupFiles: ['<rootDir>/setup'],
  mapCoverage: false
}
