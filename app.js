const { app, BrowserWindow, session } = require("electron");

// *** MAIN ***



// Error Handling
process.on('uncaughtException', (error) => {
    console.error("Unexpected error: ", error);
});

// setup listeners

let mainWindow;

app.whenReady().then(() => {
  addContentSecurityPolicy();
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
  });
  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // load file
  mainWindow.loadFile('dist/angular-electron-sandbox/browser/index.html');

  mainWindow.on('close', () => { mainWindow = null; });
}

function addContentSecurityPolicy() {
  // Security (create context security policy header)
  const policy_parts = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
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