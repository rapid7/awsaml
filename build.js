const { api } = require('@electron-forge/core');
const { initializeProxy } = require('@electron/get');
const { officialPlatformArchCombos } = require('electron-packager/src/targets');

const dir = process.cwd();
const platforms = (process.env.PLATFORM || '').split(',').filter(Boolean);
const arch = (process.env.ARCH || '').split(',').filter(Boolean);

const makeOpts = {
  dir,
  interactive: true,
  skipPackage: false,
};

// special handling for when we want to build for all architectures
if (arch.length === 1 && arch[0].toLowerCase() === 'all') {
  makeOpts.arch = 'all';
}

initializeProxy();

platforms.forEach(async (p) => {
  makeOpts.platform = p;
  if (makeOpts.arch !== 'all') {
    makeOpts.arch = arch.filter((v) => officialPlatformArchCombos[p].includes(v)).join(',');
  }

  if (makeOpts.arch.length === 0) {
    throw new Error(`No supported architectures specified for ${p}. Choices are ${officialPlatformArchCombos[p].join(', ')}`);
  }

  await api.make(makeOpts);
});
