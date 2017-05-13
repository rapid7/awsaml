'use strict';

const webpack = require('webpack');
const defaultConfig = require('./webpack.config');

defaultConfig.plugins[0] = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production')
  }
});

defaultConfig.plugins[1] = new webpack.DefinePlugin({
  PRODUCTION: true
});

const prodConfig = Object.assign(defaultConfig, {
  cache: false,
  plugins: defaultConfig.plugins
});

delete prodConfig.devtool;

module.exports = prodConfig;
