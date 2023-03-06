const electron = require('electron');

const {
  Menu,
} = electron;
const Application = electron.app;

const template = [{
  label: 'Edit',
  submenu: [{
    accelerator: 'CmdOrCtrl+Z',
    label: 'Undo',
    role: 'undo',
  }, {
    accelerator: 'Shift+CmdOrCtrl+Z',
    label: 'Redo',
    role: 'redo',
  }, {
    type: 'separator',
  }, {
    accelerator: 'CmdOrCtrl+X',
    label: 'Cut',
    role: 'cut',
  }, {
    accelerator: 'CmdOrCtrl+C',
    label: 'Copy',
    role: 'copy',
  }, {
    accelerator: 'CmdOrCtrl+V',
    label: 'Paste',
    role: 'paste',
  }, {
    accelerator: 'CmdOrCtrl+A',
    label: 'Select All',
    role: 'selectall',
  }],
}, {
  label: 'View',
  submenu: [{
    accelerator: 'CmdOrCtrl+R',
    click(item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.reload();
      }
    },
    label: 'Reload',
  }, {
    accelerator: 'CmdOrCtrl+Shift+R',
    click(item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.emit('reset');
      }
    },
    label: 'Reset',
  }, {
    accelerator: (function a() {
      return (process.platform === 'darwin') ? 'Ctrl+Command+F' : 'F11';
    }()),
    click(item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
      }
    },
    label: 'Toggle Full Screen',
  }, {
    accelerator: (function a() {
      return (process.platform === 'darwin') ? 'Alt+Command+I' : 'Ctrl+Shift+I';
    }()),
    click(item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.toggleDevTools();
      }
    },
    label: 'Toggle Developer Tools',
  }],
}, {
  label: 'Window',
  role: 'window',
  submenu: [{
    accelerator: 'CmdOrCtrl+M',
    label: 'Minimize',
    role: 'minimize',
  }, {
    accelerator: 'CmdOrCtrl+W',
    label: 'Close',
    role: 'close',
  }],
}];

if (process.platform === 'darwin') {
  const name = 'Awsaml';

  template.unshift({
    label: name,
    submenu: [{
      label: `About ${name}`,
      role: 'about',
    }, {
      type: 'separator',
    }, {
      label: 'Services',
      role: 'services',
      submenu: [],
    }, {
      type: 'separator',
    }, {
      accelerator: 'Command+H',
      label: `Hide ${name}`,
      role: 'hide',
    }, {
      accelerator: 'Command+Shift+H',
      label: 'Hide Others',
      role: 'hideothers',
    }, {
      label: 'Show All',
      role: 'unhide',
    }, {
      type: 'separator',
    }, {
      accelerator: 'Command+Q',
      click() {
        Application.quit();
      },
      label: 'Quit',
    }],
  });

  // Window menu.
  template[3].submenu.push({
    type: 'separator',
  }, {
    label: 'Bring All to Front',
    role: 'front',
  });
}

const menu = Menu.buildFromTemplate(template);

Menu.setApplicationMenu(menu);
