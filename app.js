'use strict';

const electron = require('electron');
const Application = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const Server = require('./lib/server');
const config = require('./config');
const storagePath = path.join(Application.getPath('userData'), 'data.json');
const TouchBar = electron.TouchBar
const {TouchBarButton, TouchBarGroup, TouchBarPopover, TouchBarSpacer} = electron.TouchBar

global.Storage = require('./lib/storage')(storagePath);

const WindowWidth = 800;
const WindowHeight = 800;

let mainWindow = null;

const buttonForProfileWithUrl = (browserWindow, profile, url) => {
  return new TouchBarButton({
    label: profile.replace(/^awsaml-/, ''),
    backgroundColor: '#3B86CE',
    click: () => {
      browserWindow.loadURL(Server.get('configureUrl'), {
        postData: [{type: 'rawData', bytes: Buffer.from(`metadataUrl=${url}`)}],
        extraHeaders: 'Content-Type: application/x-www-form-urlencoded'
      });
    }
  });
};

const loadTouchBar = (browserWindow) => {
  const refreshButton = new TouchBarButton({
    label: '🔄',
    backgroundColor: '#62ac5b',
    click: () => {
      browserWindow.loadURL(Server.get('refreshUrl'));
    }
  });
  const storedMetadataUrls = Storage.get('metadataUrls') || {};
  const keys = Object.keys(storedMetadataUrls);
  const profileButtons = keys.map((url) => buttonForProfileWithUrl(browserWindow, storedMetadataUrls[url], url));
  const touchbar = new TouchBar({
    items: [
      refreshButton,
      new TouchBarGroup({items: profileButtons.slice(0, 3)}),
      new TouchBarSpacer({size: 'flexible'}),
      new TouchBarPopover({
        label: '👥 More Profiles',
        items: profileButtons
      })
    ]
  });

  browserWindow.setTouchBar(touchbar);
};

Application.commandLine.appendSwitch('disable-http-cache');

Application.on('window-all-closed', () => {
  Application.quit();
});

Application.on('ready', () => {
  require('./app-menu');

  const host = Server.get('host');
  const port = Server.get('port');

  Server.listen(port, host, () => {
    console.log('Server listening on http://%s:%s', host, port); // eslint-disable-line no-console
  });

  let lastWindowState = Storage.get('lastWindowState');

  if (lastWindowState === null) {
    lastWindowState = {
      width: WindowWidth,
      height: WindowHeight
    };
  }

  mainWindow = new BrowserWindow({
    title: 'Rapid7 - Awsaml',
    x: lastWindowState.x,
    y: lastWindowState.y,
    width: lastWindowState.width,
    height: lastWindowState.height,
    show: false,
    webPreferences: {
      nodeIntegration: false
    }
  });

  mainWindow.on('close', () => {
    const bounds = mainWindow.getBounds();

    Storage.set('lastWindowState', {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      version: 1
    });
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.loadURL(Server.get('configureUrl'));
  mainWindow.show();
  mainWindow.webContents.on('did-finish-load', () => loadTouchBar(mainWindow));

  // TODO: A global clipboard instance must be loaded. Investigate how to load it within the .jsx code.
  mainWindow.webContents.executeJavaScript('new Clipboard(".copy-to-clipboard-button");');

  setInterval(() => {
    const entryPointUrl = Server.get('entryPointUrl');

    if (entryPointUrl) {
      console.log('Reloading...'); // eslint-disable-line no-console
      mainWindow.loadURL(entryPointUrl);
    }
  }, (config.aws.duration - 10) * 1000); // eslint-disable-line rapid7/static-magic-numbers
});
