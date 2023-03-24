/* eslint-disable no-param-reassign */
module.exports = {
  webpack: {
    configure: (webpackConfig, { paths }) => {
      webpackConfig.entry = `${__dirname}/src/renderer/index.js`;
      paths.appIndexJs = `${__dirname}/src/renderer/index.js`;

      return webpackConfig;
    },
  },
};
