module.exports = {
  roots: ['<rootDir>'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif)$': '<rootDir>/tests/fileMock.ts',
    '^@/(.*)$': '<rootDir>/$1',
    '^~/(.*)$': '<rootDir>/$1',
    '^vue$': 'vue/dist/vue.common.js',
  },
  moduleFileExtensions: ['ts', 'js', 'vue', 'json'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
    '^.+\\.js$': 'babel-jest',
    '.*\\.(vue)$': 'vue-jest',
  },
  testMatch: [
    '**/tests/unit/**/*.spec.(js|jsx|ts|tsx)|**/__tests__/*.(js|jsx|ts|tsx)',
  ],
  collectCoverage: true,
  setupFiles: ['<rootDir>/tests/setup.js', 'jest-canvas-mock'],
  collectCoverageFrom: [
    '<rootDir>/components/**/*.vue',
    '<rootDir>/pages/**/*.vue',
    '<rootDir>/middleware/*.ts',
    '<rootDir>/api/**/*.ts',
    '<rootDir>/mixins/*.ts',
    '<rootDir>/layouts/*.vue',
    '<rootDir>/store/*.ts',
    '<rootDir>/structure/**/*.ts',
  ],
  // coverageReporters: ['html', 'lcovonly', 'text-summary'],
  coverageDirectory: './coverage',
  reporters: ['default', 'jest-junit'],
  testEnvironment: 'jsdom',
};
