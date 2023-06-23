module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: 'eslint:recommended',
  sourceType: 'module',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  ignorePatterns: ['dist', 'node_modules'],
};
