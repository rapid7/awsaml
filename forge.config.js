const util = require('node:util');
const fs = require('node:fs');
const path = require('node:path');
const exec = util.promisify(require('node:child_process').exec);
const awsaml = require('./package.json');

const buildDirName = path.join(__dirname, 'build');
const buildDirStat = fs.statSync(buildDirName, {
  throwIfNoEntry: false,
});

/**
 * This is a type annotation for excellent editor autocompletion.
 * @type {import('@electron-forge/shared-types').ForgeConfig}
 */
const config = {
  // packagerConfig is where we configure Electron Packager.
  packagerConfig: {
    // asar: true bundles our app's source code into a single archive.
    // This improves startup performance, hides source code from casual inspection,
    // and prevents "path too long" errors on Windows. This is a critical best practice.
    asar: true,
    // prune: true automatically removes all packages listed in the `devDependencies`
    // section of your package.json. This is the primary mechanism for reducing
    // the size of your node_modules folder in the final build.
    prune: true,
    // The ignore array provides a blocklist of files and folders to exclude from
    // the final application. We use it for things that `prune` might not catch.
    // This is much more robust than maintaining a list of files to include.
    ignore: [
      // Ignore directories related to development, CI, and tooling
      /^\/out($|\/)/,
      /^\/\.github($|\/)/,
      /^\/\.yarn($|\/)/,
      /^\/brew($|\/)/,
      /^\/test($|\/)/,

      // The `public` folder's contents are handled by `react-build` and copied into
      // the `build` directory. The original `public` folder is not needed at runtime.
      /^\/public($|\/)/,

      // Ignore all top-level dotfiles for git, editors, and node/yarn version managers
      /^\/\.editorconfig$/,
      /^\/\.gitattributes$/,
      /^\/\.gitignore$/,
      /^\/\.nvmrc$/,
      /^\/\.yarnrc\.yml$/,

      // Ignore all build, test, and linting configuration files
      /^\/babel\.config\.js$/,
      /^\/build\.js$/,
      /^\/cortex\.yaml$/,
      /^\/craco\.config\.js$/,
      /^\/forge\.config\.js$/,
      /^\/jest\.config\.js$/,
      /^\/\.eslintrc\.js$/,

      // Ignore documentation and lockfiles
      /^\/yarn\.lock$/,
      /^\/CHANGELOG\.md$/,
      /^\/CODE_OF_CONDUCT\.md$/,
      /^\/README\.md$/,
    ],
    name: 'Awsaml',
    appBundleId: 'com.rapid7.awsaml',
    helperBundleId: 'com.rapid7.awsaml.helper',
    darwinDarkModeSupport: true,
    icon: 'images/icon',
  },
  rebuildConfig: {},
  // hooks are run at specific points in the build process.
  hooks: {
    // generateAssets runs before packaging begins. It's the perfect place
    // to build your frontend assets.
    generateAssets: async () => {
      console.log('INFO: Clearing previous React build...');
      if (buildDirStat && buildDirStat.isDirectory()) {
        fs.rmSync(buildDirName, { force: true, recursive: true });
      }
      console.log('INFO: Building React assets...');
      await exec('yarn react-build');
      console.log('INFO: React build complete.');
    },
  },
  // makers create the final distributable files (e.g., .exe, .dmg).
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        authors: awsaml.contributors.join(', '),
        setupIcon: path.join(__dirname, 'images', 'icon.ico'),
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
  // publishers handle uploading your app to services like GitHub Releases.
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

// This section for macOS code signing remains unchanged and is a best practice.
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
