document.addEventListener('drop', (event) => {
    event.preventDefault();
    event.stopPropagation();

    for (const f of event.dataTransfer.files) {
        console.log("filepath of dragged files: ", f.path);
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





 