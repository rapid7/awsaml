const packager = require('electron-packager');

const platforms = (process.env.PLATFORM) ? process.env.PLATFORM.split(',') : ['darwin', 'linux', 'win32'];

packager({
  dir: __dirname,
  out: 'dist',
  arch: 'x64',
  ignore: /^\/(dist|src|test|public|.editorconfig|.eslintrc|.gitignore|.travis.yml|CHANGELOG.md|electron-wait-react.js|README.md)(\/|$)/g,
  asar: true,
  name: 'Awsaml',
  platform: platforms,
  // Mac Options
  appBundleId: 'com.rapid7.awsaml',
  helperBundleId: 'com.rapid7.awsaml.helper'
}).catch((err) => {
  console.error(err);
});
