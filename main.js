const { app, BrowserWindow, session, ipcMain, nativeImage, Notification } = require("electron/main");
const path = require('node:path');

// *** MAIN ***

app.setName("Focus Timer");


// Error Handling
process.on('uncaughtException', (error) => {
    console.error("Unexpected error: ", error);
});

// setup listeners

let mainWindow;

app.whenReady().then(() => {
  addContentSecurityPolicy();
  setCommunications();
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// *** HELPERS ***

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: buildAppIcon(),
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    }
  });
  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // load file
  mainWindow.loadFile('dist/angular-electron-sandbox/browser/index.html');

  mainWindow.on('close', () => { mainWindow = null; });
}

function buildAppIcon() {
  const iconPath = path.join(__dirname, "public", "images", "focus-timer.png");
  return nativeImage.createFromPath(iconPath);
}

//#region >>> COMMUNICATION <<< 

function setCommunications() {

  ipcMain.handle('ping', () => 'pong!');
  ipcMain.handle("show-notification", (e, payload) => {
    const { title, body } = payload;
    return showNotification(title, body);
  })

}



function showNotification(title, body) {
  if (Notification.isSupported()) {
    const n = new Notification({title, body});
    n.show();
    return true;
  }
  else {
    console.log("Notifications are not supported", {title});
    return false;
  }
}

//#endregion (communication)

function addContentSecurityPolicy() {
  // Security (create context security policy header)
  const policy_parts = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data",
    "font-src 'self' https://fonts.gstatic.com",
  ].join('; ');
  const csp = `Content-Security-Policy': ["${policy_parts}"]`;

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        csp
      }
    })
  })
}

//Content-Security-Policy-Report-Only: 
// default-src 'none'; script-src 'self'; 
// connect-src 'self'; 
// img-src 'self'; style-src 'self';
// base-uri 'self';form-action 'self'


