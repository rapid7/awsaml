module.exports = {
  env: {
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/core-modules': [
      'electron',
      'electron-packager',
      'electron-devtools-installer',
    ],
  },
  extends: [
    'airbnb',
  ],
  globals: {
    require: true,
    process: true,
    __dirname: true,
    console: true,
    Storage: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: true,
    }],
    'global-require': 0,
  },
  overrides: [
    {
      files: 'api/**/*.js',
      extends: ['plugin:node/recommended'],
    },
    {
      files: 'test/**/*.js',
      env: {
        'jest/globals': true,
      },
      plugins: ['jest'],
      parserOptions: {
        sourceType: 'module',
      },
      rules: {
        'func-names': 0,
        'prefer-arrow-callback': 0,
        'max-nested-callbacks': 0,
        'space-before-function-paren': 0,
      },
    },
    {
      files: 'src/**/*.js',
      env: {
        browser: true,
      },
      plugins: [
        'react-hooks',
      ],
    },
  ],
};
