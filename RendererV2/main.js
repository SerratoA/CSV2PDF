const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const isMac = process.platform === "darwin";
const isDev = process.env.NODE_ENV !== 'production'

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "CSV to PDF",
    width: isDev ? 950 : 400,
    height: 500,
    resizable: isDev,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  // Open dev tools if in dev env
  if (isDev) {
    mainWindow.webContents.openDevTools();
    mainWindow.webContents.on("devtools-closed", () => {
      // Adjust the window size when dev tools are closed
      mainWindow.setSize(isDev ? 950 : 400, 500);
    });
  }

  mainWindow.loadFile(path.join(__dirname, "./renderer/index.html"));
}

app.whenReady().then(() => {
  createMainWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (!isMac) {
    app.quit();
  }
});

ipcMain.on("console-log", (event, ...args) => {
  console.log(...args);
});

ipcMain.on("file-path", (event, filePath) => {
  // Pass the file path to the second JavaScript file
  require('/Users/chaeilyun/Desktop/Project1/Renderer/urlpdf.js')(filePath);
});
