const { app, BrowserWindow, Menu, ipcMain, shell, dialog } = require("electron");
const path = require("path");
const os = require('os');
const fs = require('fs');

process.env.NODE_ENV = 'developer';

const isMac = process.platform === "darwin";
const isDev = process.env.NODE_ENV !== 'production';
const html_to_pdf = require('html-pdf-node');

let mainWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "CSV to PDF Converter",
    width: 400,
    height: 500,
    icon: `${__dirname}/img/Cat.png`,
    resizable: isDev,
    maximizable: false,
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
    width: 275,
    height: 275,
    maximizable: false,
    icon: `${__dirname}/img/Cat.png`,
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

    // mainWindow.webContents.send('update-loading', -1);
        // enable loading 

      const filePath = result.filePath;
      const fileName = path.basename(filePath);
      const saveDirectory = path.dirname(filePath);

      console.log("File Path: " + filePath);
      console.log("File Name: " + fileName);
      console.log("Save Directory: " + saveDirectory);
      
      mainWindow.webContents.send("start-loading");

      generatePdfs(CSV, fileName, saveDirectory);
    }
    else {
      console.log("No file selected, please try again!");
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

    const folderNameSave = (folderName + "/" + websiteName);

  // const folderName = outputDir;

  try {
    if (!fs.existsSync(folderNameSave)) {
      fs.mkdirSync(folderNameSave);
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
      let outputFilePath = folderName + "/" + websiteName + "/" + teamName + '.pdf';

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
    
    mainWindow.webContents.send("end-loading");
    shell.openPath(folderNameSave);
  });
};
