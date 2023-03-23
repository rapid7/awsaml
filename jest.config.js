module.exports = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  testMatch: [
    '**/test/**/*.js',
  ],
  reporters: [
    'default',
    ['jest-junit', { outputName: 'test-results.xml' }],
  ],
};
