const { app, BrowserWindow, Menu, ipcMain, shell, dialog } = require("electron");
const path = require("path");
const os = require('os');
const fs = require('fs');
const isMac = process.platform === "darwin";
const isDev = process.env.NODE_ENV !== 'production'
const html_to_pdf = require('html-pdf-node');

let mainWindow;
let aboutWindow;

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: "CSV to PDF App",
    width: 400,
    height: 500,
    resizable: isDev,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  // Open dev tools if in dev env
  if (isDev) {
    mainWindow.webContents.openDevTools();
    mainWindow.webContents.on("devtools-closed", () => {
      // Adjust the window size when dev tools are closed
      mainWindow.setSize(400, 500);
    });
    mainWindow.webContents.on("devtools-opened", () => {
        // Adjust the window size when dev tools are closed
        mainWindow.setSize(950, 500);
      });
  }

  mainWindow.loadFile(path.join(__dirname, "./Renderer/index.html"));
  
}

//create about
function createAboutWindow() {
  const aboutWindow = new BrowserWindow({
    title: "About CSV to PDF",
    width: 150,
    height: 150,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  });

  aboutWindow.loadFile(path.join(__dirname, "./Renderer/about.html"));
}
// Menu Template

const menu = [
  ...(isMac ? [{
    label: app.name,
    submenu:[
      {
        label:"About",
        click: createAboutWindow

      },
    ],
  },
]: []),
  {
    label: "File", 
    submenu: [
      {
        label: "Quit",
        click: () => app.quit(),
        accelerator: "CmdOrCtrl+W"
      }
    ]
  },
  ...(!isMac ? [{
    label: "Help",
    submenu: [
      {
        label: "about",
        click: createAboutWindow
      }
    ]
  }]
  : [])
]


// App is ready 
app.whenReady().then(() => {
  createMainWindow();

  // implement menu
  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});


app.on("window-all-closed", () => {
  if (isMac) {
    app.quit();
  }
});


ipcMain.on("console-log", (event, ...args) => {
  console.log(...args);
});


ipcMain.on('load:CsvFile', (e, CSV) => {
  dialog.showSaveDialog({ properties: ['saveFile', 'createDirectory', 'title'] }). then(result => {
    if (!result.canceled) {
      const filePath = result.filePath;
      const fileName = path.basename(filePath);
      const saveDirectory = path.dirname(filePath);

      Console.log("File Path: " + filePath);
      Console.log("File Name: " + fileName);
      Console.log("Save Directory: " + saveDirectory);
      
      generatePdfs(CSV, fileName, saveDirectory);
    }
    else {
      console.log("No file selected!");
    }
  }).catch(err => {
    console.log(err);
  });
});




//Generate PDFs script
function generatePdfs(filePath, fileName, saveDirectory) {
  const websiteName = fileName; // created folder name
  // const websiteName = customName; // custom name from the directory search

  const file = []; // array of objects for URLs

  fs.readFile(filePath, 'utf8', (err, data) => { // line by line URL read, put into file format
    if (err) {
      console.error("Invalid format!");
      return;
    }
    const lines = data.split('\n');
    lines.forEach((line) => {
      const fileObject = {
        url: line.trim()
      };
      console.log(fileObject); // debugging
      file.push(fileObject);
    });
  });

  // formatting of the output PDF
  const options = {
    format: 'A4',
    displayHeaderFooter: true,
    printBackground: true,
    headerTemplate: "title",
    scale: 1.0,
  };

  // CHANGE 
  const folderName =
    saveDirectory;

  // const folderName = outputDir;

  try {
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName);
    }
  } catch (error) {
    console.error("Error when creating valid folder!");
  }

  /* 
  generatePdfs:
  input: 
      - file: URLs of websites
      - options: formatting options of output PDF
  */
  html_to_pdf.generatePdfs(file, options).then(output => {
    for (let i = 0; i < output.length; i++) {
      let humanPageCount = i + 1;
      
      // Use base name as PDF name
      const fileName = path.basename(file[i].url);
      const teamName = path.parse(fileName).name;
      let outputFilePath = folderName + "/" + teamName + '.pdf';

      // Buffering time
      let pdfBuffer = Buffer.from(output[i].buffer);
      function convertBufferToPDF(filePath, buffer) {
        try {
          fs.writeFileSync(filePath, buffer);
          console.log('PDF file #' + humanPageCount + ' created');
        } catch (error) {
          console.error('Error creating PDF file #' + humanPageCount + ': ', error);
        }
      }
      convertBufferToPDF(outputFilePath, pdfBuffer);
    }
  });
};


