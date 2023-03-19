const {
  app,
  BrowserWindow,
  ipcMain,
  nativeTheme,
} = require('electron');
const path = require('path');
const {
  app: Server,
} = require('../api/server');
const config = require('../api/config.json');
const {
  loadTouchBar,
} = require('./touchbar');
const {
  channels,
} = require('./constants');

const storagePath = path.join(app.getPath('userData'), 'data.json');

global.Storage = require('../api/storage')(storagePath);

const WindowWidth = 800;
const WindowHeight = 800;

let mainWindow = null;

const baseUrl = process.env.ELECTRON_START_URL || Server.get('baseUrl');

let storedMetadataUrls = Storage.get('metadataUrls') || [];

const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]';

// Migrate from old metadata url storage schema to new one
if (isPlainObject(storedMetadataUrls)) {
  storedMetadataUrls = Object.keys(storedMetadataUrls).map((k) => ({
    name: storedMetadataUrls[k],
    url: k,
  }));

  Storage.set('metadataUrls', storedMetadataUrls);
}

app.commandLine.appendSwitch('disable-http-cache');
// No reason for Awsaml to force Macs to use dedicated gfx
app.disableHardwareAcceleration();

app.on('window-all-closed', () => {
  app.quit();
});

app.on('ready', async () => {
  // eslint-disable-next-line global-require
  require('./menu');

  const host = Server.get('host');
  const port = Server.get('port');

  Server.listen(port, host, () => {
    console.log('Server listening on http://%s:%s', host, port); // eslint-disable-line no-console
  });

  let lastWindowState = Storage.get('lastWindowState');

  if (lastWindowState === null) {
    lastWindowState = {
      height: WindowHeight,
      width: WindowWidth,
    };
  }

  Storage.set('session', {});

  mainWindow = new BrowserWindow({
    height: lastWindowState.height,
    show: false,
    title: 'Rapid7 - Awsaml',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    width: lastWindowState.width,
    x: lastWindowState.x,
    y: lastWindowState.y,
  });

  mainWindow.on('close', () => {
    const bounds = mainWindow.getBounds();

    Storage.set('lastWindowState', {
      height: bounds.height,
      version: 1,
      width: bounds.width,
      x: bounds.x,
      y: bounds.y,
    });

    Storage.delete('session');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('reset', () => {
    setImmediate(() => {
      mainWindow.loadURL(baseUrl);
      mainWindow.show();
    });
  });

  mainWindow.webContents.on('did-finish-load', () => loadTouchBar(mainWindow, storedMetadataUrls));

  mainWindow.emit('reset');

  // set up IPC handlers
  Object.entries(channels).forEach(([namespace, value = {}]) => {
    console.log(`loading handlers for ${namespace}`); // eslint-disable-line no-console
    Object.entries(value).forEach(([channelName, handler]) => {
      ipcMain.handle(channelName, handler);
    });
  });

  // set up  dark mode handler
  ipcMain.handle('dark-mode:get', () => nativeTheme.shouldUseDarkColors);

  setInterval(() => {
    const entryPointUrl = Server.get('entryPointUrl');
    const lastEntryPointLoad = Server.get('lastEntryPointLoad');
    const elapsedSinceLastLoad = Date.now() - lastEntryPointLoad;
    const needLoad = !lastEntryPointLoad
      || elapsedSinceLastLoad > ((config.aws.duration / 2) * 1000);

    if (entryPointUrl && needLoad) {
      console.log('Reloading...', entryPointUrl); // eslint-disable-line no-console
      mainWindow.loadURL(entryPointUrl);
      Server.set('lastEntryPointLoad', Date.now());
    }
  }, (config.aws.duration / 2) * 1000);
});
