const { contextBridge, ipcRenderer } = require('electron');

// Expose ipcRenderer to the renderer process for communication
contextBridge.exposeInMainWorld('electron', {
  // A method to call main process to fetch weather data
  fetchWeather: (url) => ipcRenderer.invoke('fetch-weather', url)
});
