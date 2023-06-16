const { ipcRenderer } = require("electron");

window.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("drop", (event) => {
    event.preventDefault();
    event.stopPropagation();

    for (const f of event.dataTransfer.files) {
      console.log("filepath of dragged files: ", f.path);
      ipcRenderer.send("file-path", f.path); // Send the file path to the main process
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

// Forward console.log messages to the main process
console.log = (...args) => {
  ipcRenderer.send("console-log", ...args);
};
