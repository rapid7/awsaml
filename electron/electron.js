const path = require('node:path');
const url = require('node:url');
const {
  app,
  BrowserWindow,
  ipcMain,
  nativeTheme,
  protocol,
  clipboard,
} = require('electron');
const { app: Server } = require('../api/server');
const config = require('../api/config.json');
const { loadTouchBar } = require('./touchbar');
const { channels } = require('./constants');

// See https://www.electronforge.io/config/makers/squirrel.windows#handling-startup-events
// for more details.
if (require('electron-squirrel-startup')) app.quit();

const storagePath = path.join(app.getPath('userData'), 'data.json');
const isDev = process.env.NODE_ENV === 'development';

global.Storage = require('../api/storage')(storagePath);

const WindowWidth = 800;
const WindowHeight = 800;

let mainWindow = null;

let baseUrl = process.env.ELECTRON_START_URL || Server.get('baseUrl');

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

  // register a custom protocol so we can redirect from the webserver that handles SSO to our UI
  protocol.registerFileProtocol('awsaml', (request, callback) => {
    const filePath = url.fileURLToPath(`file://${request.url.slice('awsaml://'.length)}`);
    callback(filePath);
  });

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
    Storage.delete('authenticated');
    Storage.delete('multipleRoles');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (isDev) {
    mainWindow.openDevTools({ mode: 'detach' });
  } else {
    baseUrl = `awsaml://${path.join(__dirname, '/../build/index.html')}`;
    Server.set('baseUrl', baseUrl);
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

  // set up dark mode handler
  ipcMain.handle('dark-mode:get', () => nativeTheme.shouldUseDarkColors);
  nativeTheme.on('updated', () => {
    mainWindow.webContents.send('dark-mode:updated', nativeTheme.shouldUseDarkColors);
  });

  // set up clipboard handler
  ipcMain.handle('copy', async (event, value) => {
    clipboard.writeText(value);
  });

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
