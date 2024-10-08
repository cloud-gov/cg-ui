const nextJest = require('next/jest');

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const config = {
  // CODE COVERAGE
  collectCoverage: true,
  collectCoverageFrom: ['**/*.{ts,tsx}', '!next-env.d.ts'],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/app/prototype/', '/.next/'],
  coverageProvider: 'babel',
  coverageThreshold: {
    global: {
      branches: 45,
      functions: 60,
      lines: 60,
    },
  },
  moduleNameMapper: {
    '@/(.*)': ['<rootDir>/src/$1'],
  },
  // testEnvironment: node works for api testing, but to test anything needing a browser, like React components, set @jest-environment to jsdom in the file: https://jestjs.io/docs/configuration#testenvironment-string
  testEnvironment: 'node',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testPathIgnorePatterns: ['<rootDir>/__tests__/api/mocks'],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(config);
