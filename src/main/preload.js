const {
  contextBridge,
  ipcRenderer,
} = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  getMetadataUrls: () => ipcRenderer.invoke('configure:metadataUrls:get'),
  getDefaultMetadata: () => ipcRenderer.invoke('configure:defaultMetadata:get'),
  login: (args) => ipcRenderer.invoke('configure:login', args),
  isAuthenticated: () => ipcRenderer.invoke('configure:is-authenticated'),
  hasMultipleRoles: () => ipcRenderer.invoke('configure:has-multiple-roles'),
  logout: () => ipcRenderer.invoke('logout:get'),
  getRoles: () => ipcRenderer.invoke('select-role:get'),
  setRole: (args) => ipcRenderer.invoke('select-role:set', args),
  deleteProfile: (args) => ipcRenderer.invoke('configure:profile:delete', args),
  getProfile: (args) => ipcRenderer.invoke('configure:profile:get', args),
  refresh: () => ipcRenderer.invoke('refresh:get'),
  getDarkMode: () => ipcRenderer.invoke('dark-mode:get'),
  darkModeUpdated: (callback) => ipcRenderer.on('dark-mode:updated', callback),
  copy: (args) => ipcRenderer.invoke('copy', args),
  reloadUi: (callback) => ipcRenderer.on('reloadUi', callback),
});
