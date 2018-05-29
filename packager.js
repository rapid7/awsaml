const packager = require('electron-packager');
const rebuild = require('electron-rebuild').default;

const platforms = (process.env.PLATFORM) ? process.env.PLATFORM.split(',') : ['darwin', 'linux', 'win32'];

packager({
  dir: __dirname,
  out: 'dist',
  arch: 'x64',
  ignore: [
    'test'
  ],
  asar: true,
  name: 'Awsaml',
  platform: platforms,
  // Mac Options
  appBundleId: 'com.rapid7.awsaml',
  helperBundleId: 'com.rapid7.awsaml.helper',
  // Resolve issue where dependencies didn't get all of their sub-dependencies by forcing a rebuild
  afterCopy: [(buildPath, electronVersion, platform, arch, callback) => {
    rebuild({buildPath, electronVersion, arch})
      .then(() => {
        return callback();
      }).catch((error) => {
        return callback(error);
      });
  }]
}).catch((err) => {
  console.error(err);
});
