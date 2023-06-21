const { ipcRenderer, contextBridge } = require("electron");
const os = require('os');
const path = require('path');

contextBridge.exposeInMainWorld('os', {
  homedir: () => os.homedir(),
});

contextBridge.exposeInMainWorld('path', {
  join: (...args) => path.join(...args),
});


contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, func) =>
    ipcRenderer.on(channel, (event, ...args) => func(...args)),
});

contextBridge.exposeInMainWorld('Toastify', {
  toast: (options) => Toastify(options).showToast(),
});











// let fileDropped = false;

// window.addEventListener("DOMContentLoaded", () => {
//   document.addEventListener("drop", (event) => {
//     event.preventDefault();
//     event.stopPropagation();

//     for (const f of event.dataTransfer.files) {
//       console.log("filepath of dragged files: ", f.path);
//       console.log("Hello, dropped file alert");
//       ipcRenderer.send("file-path", f.path);
//     }
//   });

//   document.addEventListener("dragover", (event) => {
//     event.preventDefault();
//     event.stopPropagation();
//   });

//   document.addEventListener("dragenter", (event) => {
//     console.log("File is in the drop space");
//   });

//   document.addEventListener("dragleave", (event) => {
//     console.log("File has left the drop space");
//   });
// });

// document.addEventListener('drop', (event) => {
//     event.preventDefault();
//     event.stopPropagation();

//     for (const f of event.dataTransfer.files) {
//         console.log("filepath of dragged files: ", f.path);
//         fileDropped = true;
//     }
// });

// document.addEventListener('dragover', (e) => {
//     e.preventDefault();
//     e.stopPropagation();
// });

// document.addEventListener("dragcenter", (event) => {
//     console.log("File is in the drop space");
// });

// document.addEventListener("dragleave", (event) => {
//     console.log("file has left the drop space");
// });


