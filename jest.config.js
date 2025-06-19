const config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    "\\.(css|scss)$": "identity-obj-proxy",
  },
  setupFiles: ['<rootDir>/tests/__mocks__/importMetaEnvMock.js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
};

module.exports = config;
