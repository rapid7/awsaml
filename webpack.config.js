'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {
  cache: true,
  devtool: 'cheap-module-eval-source-map',
  entry: path.resolve(__dirname, 'views', 'index.jsx'),
  output: {
    path: path.resolve(__dirname, 'public', 'js'),
    filename: 'bundle.js',
    publicPath: 'http://localhost:8080/js/'
  },

  devServer: {
    port: 8080, // eslint-disable-line rapid7/static-magic-numbers
    contentBase: './public',
    inline: true,
    hot: true,
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)?$/,
        loader: 'eslint-loader',
        exclude: [/node_modules/],
        options: {
          configFile: './.eslintrc',
          emitError: true,
          failOnError: true,
          failOnWarning: false,
          formatter: require('eslint-friendly-formatter')
        }
      }, {
        test: /\.(js|jsx)?$/,
        loaders: ['react-hot-loader', 'babel-loader'],
        exclude: [/node_modules/]
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      }
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
  ]
};
