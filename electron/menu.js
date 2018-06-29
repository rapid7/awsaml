const electron = require('electron');
const Menu = electron.Menu;
const Application = electron.app;

const template = [{
  label: 'Edit',
  submenu: [{
    label: 'Undo',
    accelerator: 'CmdOrCtrl+Z',
    role: 'undo'
  }, {
    label: 'Redo',
    accelerator: 'Shift+CmdOrCtrl+Z',
    role: 'redo'
  }, {
    type: 'separator'
  }, {
    label: 'Cut',
    accelerator: 'CmdOrCtrl+X',
    role: 'cut'
  }, {
    label: 'Copy',
    accelerator: 'CmdOrCtrl+C',
    role: 'copy'
  }, {
    label: 'Paste',
    accelerator: 'CmdOrCtrl+V',
    role: 'paste'
  }, {
    label: 'Select All',
    accelerator: 'CmdOrCtrl+A',
    role: 'selectall'
  }]
}, {
  label: 'View',
  submenu: [{
    label: 'Reload',
    accelerator: 'CmdOrCtrl+R',
    click(item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.reload();
      }
    }
  }, {
    label: 'Reset',
    click(item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.emit('reset');
      }
    }
  }, {
    label: 'Toggle Full Screen',
    accelerator: (function a() {
      return (process.platform === 'darwin') ? 'Ctrl+Command+F' : 'F11';
    }()),
    click(item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
      }
    }
  }, {
    label: 'Toggle Developer Tools',
    accelerator: (function a() {
      return (process.platform === 'darwin') ? 'Alt+Command+I' : 'Ctrl+Shift+I';
    }()),
    click(item, focusedWindow) {
      if (focusedWindow) {
        focusedWindow.toggleDevTools();
      }
    }
  }]
}, {
  label: 'Window',
  role: 'window',
  submenu: [{
    label: 'Minimize',
    accelerator: 'CmdOrCtrl+M',
    role: 'minimize'
  }, {
    label: 'Close',
    accelerator: 'CmdOrCtrl+W',
    role: 'close'
  }]
}];

if (process.platform === 'darwin') {
  const name = 'Awsaml';

  template.unshift({
    label: name,
    submenu: [{
      label: `About ${name}`,
      role: 'about'
    }, {
      type: 'separator'
    }, {
      label: 'Services',
      role: 'services',
      submenu: []
    }, {
      type: 'separator'
    }, {
      label: `Hide ${name}`,
      accelerator: 'Command+H',
      role: 'hide'
    }, {
      label: 'Hide Others',
      accelerator: 'Command+Shift+H',
      role: 'hideothers'
    }, {
      label: 'Show All',
      role: 'unhide'
    }, {
      type: 'separator'
    }, {
      label: 'Quit',
      accelerator: 'Command+Q',
      click() {
        Application.quit();
      }
    }]
  });

  // Window menu.
  template[3].submenu.push({ // eslint-disable-line rapid7/static-magic-numbers
    type: 'separator'
  }, {
    label: 'Bring All to Front',
    role: 'front'
  });
}

const menu = Menu.buildFromTemplate(template);

Menu.setApplicationMenu(menu);
