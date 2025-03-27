const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const axios = require('axios');  // Import axios to make API requests

function createWindow() {
  const win = new BrowserWindow({
    width: 600,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),  
      nodeIntegration: false,  
      contextIsolation: true,  
    }
  });

  win.loadFile('index.html');  // Load the HTML file into the window

  // Create a custom menu with an Exit button
  const menu = Menu.buildFromTemplate([
    {
      label: 'File',
      submenu: [
        { label: 'Exit', click: () => app.quit() }
      ]
    }
  ]);

  Menu.setApplicationMenu(menu);  // Set the application menu
  win.setMenuBarVisibility(false); // Hide the default menu
}

ipcMain.handle('fetch-weather', async (event, url) => {
  try {
    const response = await axios.get(url); // Make the HTTP request to fetch weather data using axios
    return response.data;  // Return the weather data to the renderer process
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;  // Propagate the error to the renderer process
  }
});

app.whenReady().then(createWindow);  // When the app is ready, create the window
