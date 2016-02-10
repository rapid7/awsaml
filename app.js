'use strict';

const Application = require('app');
const BrowserWindow = require('browser-window');
const Storage = require('./lib/storage');
const Server = require('./lib/server');
const config = require('./config');

const WindowWidth = 800;
const WindowHeight = 700;

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
    'web-preferences': {
      'node-integration': false
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

  mainWindow.loadUrl(Server.get('configureUrl'));
  mainWindow.show();

  setInterval(() => {
    console.log('Reloading...'); // eslint-disable-line no-console
    mainWindow.loadUrl(Server.get('entryPointUrl'));
  }, (config.aws.duration - 10) * 1000); // eslint-disable-line rapid7/static-magic-numbers
});
