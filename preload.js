const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  isElectron: true,
  apiVersions: {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
  },
  messaging: {
    ping: () =>  ipcRenderer.invoke('ping'),
    showNotification: (payload) => ipcRenderer.invoke('show-notification', payload), 
  },
});

