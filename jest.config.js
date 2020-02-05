module.exports = {
  verbose: true,
  browser: false,
  testEnvironment: 'node',
  transform: {},
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/coverage/**',
    '!**/tests/**',
    '!**/.eslintrc.js',
    '!**/jest.config.js'
  ],
  globals: {
  }
}
