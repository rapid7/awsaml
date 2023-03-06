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
  },
  overrides: [
    {
      files: 'api/**/*.js',
      extends: ['plugin:node/recommended'],
      rules: {
        'global-require': 0,
      },
    },
    {
      files: 'test/**/*.js',
      env: {
        mocha: true,
      },
      extends: ['plugin:node/recommended'],
      rules: {
        'func-names': 0,
        'global-require': 0,
        'prefer-arrow-callback': 0,
        'max-nested-callbacks': 0,
        'space-before-function-paren': 0,
        'node/no-unpublished-require': ['error', {
          allowModules: ['should'],
        }],
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
      rules: {
        'import/no-extraneous-dependencies': 0,
        'react/require-default-props': 0,
        'no-console': 0,
      },
    },
  ],
};
