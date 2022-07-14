const packager = require('electron-packager');

const platforms = (process.env.PLATFORM) ? process.env.PLATFORM.split(',') : ['darwin', 'linux', 'win32'];
const ignoreRegex = new RegExp('^\\/(' +
  // Insert files/directories in this project that should be ignored.
  // Note: This regex is required because electron-packager's `ignore` property only accepts a regex
  // See: https://github.com/electron-userland/electron-packager/blob/master/readme.md
  // specifically: `You can use --ignore to ignore files and folders via a regular expression (not a glob pattern).`
  'dist|src|test|public|.editorconfig|.eslintrc|.gitignore|.travis.yml|CHANGELOG.md|README.md' +
  ')(\\/|$)', 'g');

for (i in platforms) {

  let __arch = 'x64';

  // Allows MacOS builds for both x64 and ARM64 in one universal binary.
  if (platforms[i] === 'darwin') {
    __arch = 'universal';
  }

  // build a unique package
  packager({
    appBundleId: 'com.rapid7.awsaml',
    arch: __arch,
    asar: true,
    dir: __dirname,
    helperBundleId: 'com.rapid7.awsaml.helper',
    ignore: ignoreRegex,
    name: 'Awsaml',
    out: 'dist',
    platform: platforms[i],
  }).catch((err) => {
    console.error(err);
  });
}