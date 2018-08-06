module.exports = {
  automock: false,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
  ],
  roots: [
    '<rootDir>/src',
    '<rootDir>/test',
  ], // Required to find __mocks__ in test dir
  setupFiles: [
    './test/setup.js',
  ],
  testMatch: [
    '<rootDir>/test/**/?(*.)(spec|test).js?(x)',
  ],
};
