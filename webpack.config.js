'use strict';

const webpack = require('webpack');
const path = require('path');

const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const publicPath = path.resolve(__dirname, 'public');
const buildPath = path.resolve(publicPath, 'js');
const mainPath = path.resolve(__dirname, 'views', 'index.jsx');

module.exports = {
  cache: true,
  debug: true,
  entry: [
    'webpack/hot/dev-server',
    mainPath
  ],
  output: {
    path: buildPath,
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/js/'
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: 8080, // eslint-disable-line rapid7/static-magic-numbers
    contentBase: './public',
    inline: true,
    hot: true,
    colors: true,
    progress: true,
    historyApiFallback: true
  },
  eslint: {
    configFile: './.eslintrc',
    emitError: true,
    failOnError: true,
    failOnWarning: false,
    formatter: require('eslint-friendly-formatter')
  },
  module: {
    preLoaders: [
      {test: /\.(js|jsx)?$/, loader: 'eslint-loader', exclude: [nodeModulesPath]}
    ],
    loaders: [
      {test: /\.(js|jsx)?$/, loaders: ['react-hot', 'babel-loader'], exclude: [nodeModulesPath]},
      {test: /\.css$/, loader: 'style-loader!css-loader'}
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new webpack.DefinePlugin({
      PRODUCTION: false
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.IgnorePlugin(new RegExp('^(fs|ipc)$'))
  ],
  root: __dirname
};
