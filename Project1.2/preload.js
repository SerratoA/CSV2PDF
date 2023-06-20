const { ipcRenderer } = require("electron");
const { contextBridge } = require('electron');

let fileDropped = false;

window.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();

    for (const f of event.dataTransfer.files) {
      console.log("filepath of dragged files: ", f.path);
      ipcRenderer.send("file-path", f.path);
    }
  });

  document.addEventListener("dragover", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });

  document.addEventListener("dragenter", (event) => {
    console.log("File is in the drop space");
  });

  document.addEventListener("dragleave", (event) => {
    console.log("File has left the drop space");
  });
});

document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();

    for (const f of event.dataTransfer.files) {
        console.log("filepath of dragged files: ", f.path);
        fileDropped = true;
    }
});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

document.addEventListener("dragcenter", (event) => {
    console.log("File is in the drop space");
});

document.addEventListener("dragleave", (event) => {
    console.log("file has left the drop space");
});
