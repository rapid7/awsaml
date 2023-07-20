const path = require('node:path');
const {
  app,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  clipboard,
} = require('electron');
const { app: Server } = require('./api/server');
const { loadTouchBar } = require('./touchbar');
const protocol = require('./protocol');
const { channels } = require('./containers/index');

// See https://www.electronforge.io/config/makers/squirrel.windows#handling-startup-events
// for more details.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Bootstrap the updater
if (app.isPackaged) {
  require('update-electron-app')();
}

protocol.registerSchemas();

const isPlainObject = (value) => Object.prototype.toString.call(value) === '[object Object]';
const storagePath = path.join(app.getPath('userData'), 'data.json');
const isDev = process.env.NODE_ENV === 'development';
const WindowWidth = 800;
const WindowHeight = 800;

let mainWindow = null;
let baseUrl = process.env.ELECTRON_START_URL || Server.get('baseUrl');

global.Storage = require('./api/storage')(storagePath);
global.Manager = require('./api/reloader/manager')();

let storedMetadataUrls = Storage.get('metadataUrls') || [];

// Migrate from old metadata url storage schema to new one
if (isPlainObject(storedMetadataUrls)) {
  storedMetadataUrls = Object.keys(storedMetadataUrls).map((k) => ({
    name: storedMetadataUrls[k],
    url: k,
  }));

  Storage.set('metadataUrls', storedMetadataUrls);
}

// Disable cache
app.commandLine.appendSwitch('disable-http-cache');
// No reason for Awsaml to force Macs to use dedicated gfx
app.disableHardwareAcceleration();

app.on('window-all-closed', () => {
  app.quit();
});

let lastWindowState = Storage.get('lastWindowState');

if (lastWindowState === null) {
  lastWindowState = {
    height: WindowHeight,
    width: WindowWidth,
  };
}

app.on('ready', async () => {
  // eslint-disable-next-line global-require
  require('./menu');

  protocol.registerHandlers();

  const host = Server.get('host');
  const port = Server.get('port');

  Server.listen(port, host, () => {
    console.log(`Server listening on ${host}:${port}`); // eslint-disable-line no-console
  });

  Storage.set('session', {});

  mainWindow = new BrowserWindow({
    height: lastWindowState.height,
    show: false,
    title: 'Rapid7 - Awsaml',
    icon: 'images/icon.png',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    width: lastWindowState.width,
    x: lastWindowState.x,
    y: lastWindowState.y,
  });

  mainWindow.on('close', () => {
    const bounds = mainWindow.getBounds();

    Storage.delete('manager');
    Storage.set('lastWindowState', {
      height: bounds.height,
      version: 1,
      width: bounds.width,
      x: bounds.x,
      y: bounds.y,
    });

    Storage.delete('session');
    Storage.delete('authenticated');
    Storage.delete('multipleRoles');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (isDev) {
    mainWindow.openDevTools({ mode: 'detach' });
  } else {
    baseUrl = `awsaml://${path.join(__dirname, '/../../build/index.html')}`;
    Server.set('baseUrl', baseUrl);
  }

  await mainWindow.loadURL(baseUrl);

  mainWindow.on('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.on('did-finish-load', () => loadTouchBar(mainWindow, storedMetadataUrls));

  // set up IPC handlers
  Object.entries(channels).forEach(([namespace, value = {}]) => {
    console.log(`loading handlers for ${namespace}`); // eslint-disable-line no-console
    Object.entries(value).forEach(([channelName, handler]) => {
      ipcMain.handle(channelName, handler);
    });
  });

  // set up dark mode handler
  ipcMain.handle('dark-mode:get', () => nativeTheme.shouldUseDarkColors);
  nativeTheme.on('updated', () => {
    mainWindow.webContents.send('dark-mode:updated', nativeTheme.shouldUseDarkColors);
  });

  // set up clipboard handler
  ipcMain.handle('copy', async (event, value) => {
    clipboard.writeText(value);
  });
});
