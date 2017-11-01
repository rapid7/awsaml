'use strict';

const electron = require('electron');
const Application = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const Server = require('./lib/server');
const config = require('./config');
const storagePath = path.join(Application.getPath('userData'), 'data.json');
const TouchBar = electron.TouchBar
const {TouchBarLabel, TouchBarButton, TouchBarSpacer} = electron.TouchBar

global.Storage = require('./lib/storage')(storagePath);

const WindowWidth = 800;
const WindowHeight = 800;

let mainWindow = null;

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
  const refreshButton = new TouchBarButton({
    label: '♻️ Refresh',
    backgroundColor: '#595959',
    click: () => {
      mainWindow.loadURL(Server.get('refreshUrl'))
    }
  });
  const logoutButton = new TouchBarButton({
    label: '😴 Logout',
    backgroundColor: '#d43f3a',
    click: () => {
      mainWindow.loadURL(Server.get('logoutUrl'))
    }
  });
  const touchbar = new TouchBar([refreshButton, new TouchBarSpacer({size: 'small'}),, logoutButton]);

  mainWindow.setTouchBar(touchbar);
  mainWindow.show();

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
