const util = require('node:util');
const fs = require('node:fs');
const path = require('node:path');
const exec = util.promisify(require('node:child_process').exec);
const { globSync } = require('glob');
const awsaml = require('./package.json');

const includeFiles = [
  // we need to make sure the project root directory is included
  '',
  ...globSync('build/**'),
  ...globSync('src/**'),
  'LICENSE.md',
  'package.json',
  // per electron-packager's docs, a set of files in the node_modules directory are always ignored
  // unless we are providing an IgnoreFunction. Because we want to ignore a lot more files than
  // packager does by default, we need to ensure that we're including the relevant node_modules
  // while ignoring what packager normally would.
  // See https://electron.github.io/electron-packager/main/interfaces/electronpackager.options.html#ignore.
  ...globSync('node_modules/**', {
    ignore: [
      'node_modules/.bin/**',
      'node_modules/electron/**',
      'node_modules/electron-prebuilt/**',
      'node_modules/electron-prebuilt-compile/**',
    ],
  }),
];

const outDirName = path.join(__dirname, 'out');
const outDirStat = fs.statSync(outDirName, {
  throwIfNoEntry: false,
});
const buildDirName = path.join(__dirname, 'build');
const buildDirStat = fs.statSync(buildDirName, {
  throwIfNoEntry: false,
});

const config = {
  packagerConfig: {
    appBundleId: 'com.rapid7.awsaml',
    asar: true,
    helperBundleId: 'com.rapid7.awsaml.helper',
    prune: true,
    ignore: (p) => !includeFiles.includes(p.replace('/', '')),
    name: 'Awsaml',
    darwinDarkModeSupport: true,
    icon: 'images/icon',
  },
  rebuildConfig: {},
  hooks: {
    generateAssets: async () => {
      // Clear the build directory if it exists
      if (buildDirStat && buildDirStat.isDirectory()) {
        fs.rmSync(buildDirName, {
          force: true,
          recursive: true,
        });
      }

      await exec('yarn react-build');
    },
    prePackage: () => {
      // Clear the out directory if it exists
      if (outDirStat && outDirStat.isDirectory()) {
        fs.rmSync(outDirName, {
          force: true,
          recursive: true,
        });
      }
    },
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: awsaml.contributors.join(', '),
      },
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'],
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          homepage: awsaml.repository.url.replace('.git', ''),
          maintainer: awsaml.contributors.join(', '),
          icon: 'images/icon.png',
        },
      },
    },
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'rapid7',
          name: 'awsaml',
        },
        draft: true,
        prerelease: false,
      },
    },
  ],
};

// If we're running in Jenkins (or the env indicates we are) attempt to
// code sign.
if (process.env.BUILD_NUMBER && process.env.BUILD_NUMBER !== '') {
  config.packagerConfig.osxSign = {};
  config.packagerConfig.osxNotarize = {
    tool: 'notarytool',
    appleId: process.env.NOTARIZE_CREDS_USR,
    appleIdPassword: process.env.NOTARIZE_CREDS_PSW,
    teamId: process.env.MAC_TEAM_ID,
  };
}

module.exports = config;
