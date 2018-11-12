const electron = require('electron');

const Application = electron.app;
const BrowserWindow = electron.BrowserWindow;
const isPlainObject = require('lodash.isplainobject');
const path = require('path');
const Server = require('../api/server');
const config = require('../api/config');

const storagePath = path.join(Application.getPath('userData'), 'data.json');
const TouchBar = electron.TouchBar;
const {TouchBarButton, TouchBarGroup, TouchBarPopover, TouchBarSpacer} = electron.TouchBar;

global.Storage = require('../api/storage')(storagePath);

const WindowWidth = 800;
const WindowHeight = 800;

let mainWindow = null;

const baseUrl = process.env.ELECTRON_START_URL || Server.get('baseUrl');
const configureUrl = path.join(baseUrl, Server.get('configureUrlRoute'));
const refreshUrl = path.join(baseUrl, Server.get('refreshUrlRoute'));

let storedMetadataUrls = Storage.get('metadataUrls') || [];

// Migrate from old metadata url storage schema to new one
if (isPlainObject(storedMetadataUrls)) {
  storedMetadataUrls = Object.keys(storedMetadataUrls).map((k) => ({
    name: storedMetadataUrls[k],
    url: k,
  }));

  Storage.set('metadataUrls', storedMetadataUrls);
}

const buttonForProfileWithUrl = (browserWindow, profile, url) => new TouchBarButton({
  backgroundColor: '#3B86CE',
  click: () => {
    browserWindow.loadURL(configureUrl, {
      extraHeaders: 'Content-Type: application/x-www-form-urlencoded',
      postData: [{
        bytes: Buffer.from(`metadataUrl=${url}&origin=electron`),
        type: 'rawData',
      }],

    });
  },
  label: profile.replace(/^awsaml-/, ''),
});

const loadTouchBar = (browserWindow) => {
  const refreshButton = new TouchBarButton({
    backgroundColor: '#62ac5b',
    click: () => {
      browserWindow.loadURL(refreshUrl);
    },
    label: '🔄',
  });

  const profileButtons = storedMetadataUrls.map((storedMetadataUrl) =>
    buttonForProfileWithUrl(browserWindow, storedMetadataUrl.name, storedMetadataUrl.url));
  const touchbar = new TouchBar({
    items: [
      refreshButton,
      new TouchBarGroup({items: profileButtons.slice(0, 3)}),
      new TouchBarSpacer({size: 'flexible'}),
      new TouchBarPopover({
        items: profileButtons,
        label: '👥 More Profiles',
      }),
    ],
  });

  browserWindow.setTouchBar(touchbar);
};

Application.commandLine.appendSwitch('disable-http-cache');
// No reason for Awsaml to force Macs to use dedicated gfx
Application.disableHardwareAcceleration();

Application.on('window-all-closed', () => {
  Application.quit();
});

Application.on('ready', async () => {
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

  mainWindow = new BrowserWindow({
    height: lastWindowState.height,
    show: false,
    title: 'Rapid7 - Awsaml',
    webPreferences: {
      nodeIntegration: false,
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
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  if (process.env.NODE_ENV === 'development') {
    const {default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} = require('electron-devtools-installer');

    try {
      const name = await installExtension([REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS]);

      console.log(`Added Extension:  ${name}`);
    } catch (err) {
      console.log('An error occurred: ', err);
    }

    mainWindow.openDevTools();
  }

  mainWindow.on('reset', () => {
    setImmediate(() => {
      mainWindow.loadURL(baseUrl);
      mainWindow.show();
    });
  });

  mainWindow.webContents.on('did-finish-load', () => loadTouchBar(mainWindow));

  mainWindow.emit('reset');

  setInterval(() => {
    const entryPointUrl = Server.get('entryPointUrl');

    if (entryPointUrl) {
      console.log('Reloading...'); // eslint-disable-line no-console
      mainWindow.loadURL(entryPointUrl);
    }
  }, (config.aws.duration / 2) * 1000); // eslint-disable-line rapid7/static-magic-numbers
});
