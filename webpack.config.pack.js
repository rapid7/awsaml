'use strict';

const webpack = require('webpack');
const defaultConfig = require('./webpack.config');
const productionPlugins = defaultConfig.plugins.concat([
  new webpack.optimize.DedupePlugin()
]);

productionPlugins[0] = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify('production')
  }
});

productionPlugins[1] = new webpack.DefinePlugin({
  PRODUCTION: true
});

const prodConfig = Object.assign(defaultConfig, {
  debug: false,
  cache: false,
  plugins: productionPlugins
});

delete prodConfig.devtool;

module.exports = prodConfig;
