module.exports = {
  root: true,
  parser: 'babel-eslint',
  plugins: ['prettier', 'react-hooks'],
  extends: ['airbnb', 'prettier', 'plugin:react-hooks/recommended'],
  env: {
    jest: true
  },
  rules: {
    'no-plusplus': ['error', {allowForLoopAfterthoughts: true}],
    'no-use-before-define': 0,
    'react/prop-types': 0,
    semi: 0,
    'prettier/prettier': 'error',
    'global-require': 0,
    camelcase: 0,
    'prefer-destructuring': 0,
    'object-curly-spacing': 0,
    'import/no-useless-path-segments': 0,
    'react/forbid-prop-types': 0,
    'import/no-cycle': 0,
    'class-methods-use-this': 0,
    'import/no-named-as-default-member': 0,
    'import/no-named-as-default': 0,
    'import/prefer-default-export': 0,
    'import/order': 0,
    'prefer-const': 0,
    'linebreak-style': 0,
    'react/destructuring-assignment': 0,
    'spaced-comment': 0,
    'import/no-extraneous-dependencies': 0,
    'no-unused-vars': 0,
    'no-return-assign': 0,
    'react/jsx-closing-bracket-location': 0,
    'react/jsx-filename-extension': [1, {extensions: ['.js', '.jsx']}],
    'react/jsx-wrap-multilines': 0,
    'react/jsx-one-expression-per-line': 0,
    'no-nested-ternary': 0,
    'react/no-unescaped-entities': 'off',
    'no-console': ['error', {allow: ['tron', 'log']}],
    'comma-dangle': ['error', 'never'],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'off'
  },
  globals: {
    fetch: false
  }
};