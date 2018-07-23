const packager = require('electron-packager');

const platforms = (process.env.PLATFORM) ? process.env.PLATFORM.split(',') : ['darwin', 'linux', 'win32'];
const ignoreRegex = new RegExp('^\\/(' +
  // Insert files/directories in this project that should be ignored.
  // Note: This regex is required because electron-packager's `ignore` property only accepts a regex
  // See: https://github.com/electron-userland/electron-packager/blob/master/readme.md
  // specifically: `You can use --ignore to ignore files and folders via a regular expression (not a glob pattern).`
  'dist|src|test|public|.editorconfig|.eslintrc|.gitignore|.travis.yml|CHANGELOG.md|README.md' +
  ')(\\/|$)', 'g');

packager({
  appBundleId: 'com.rapid7.awsaml',
  arch: 'x64',
  asar: true,
  dir: __dirname,
  helperBundleId: 'com.rapid7.awsaml.helper',
  ignore: ignoreRegex,
  name: 'Awsaml',
  out: 'dist',
  platform: platforms,
}).catch((err) => {
  console.error(err);
});
