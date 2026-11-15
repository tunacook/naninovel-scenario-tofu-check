/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
  moduleNameMapper: {
    '^@actions/core$': '<rootDir>/__mocks__/@actions/core.cjs',
    // ESM の相対 import（./foo.js）を ts-jest が解決できるよう拡張子を外す
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
}
