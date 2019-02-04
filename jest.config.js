module.exports = {
  collectCoverage: true,
  coverageDirectory: '.coverage',
  projects: [
    {
      runner: 'jest-runner-eslint',
      displayName: 'eslint',
      testMatch: ['<rootDir>/lib/**/*.js', '<rootDir>/index.js'],
    },
    {
      setupFiles: ['<rootDir>/jest/setup.js'],
    },
  ],
};
