const path = require('path')

module.exports = {
  rootDir: path.resolve(__dirname, './'),
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  collectCoverage: false,
}
