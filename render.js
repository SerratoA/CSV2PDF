
// From video (above)
const convert = document.querySelector("#convertor");
//s
//send file path to main.js to generate pdfs
function urlToPdf(path) {
    console.log("Converting...");
    console.log(path);
    console.log(typeof(path));
    ipcRenderer.send('load:CsvFile', path)
}

document.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();

for (const f of e.dataTransfer.files) {
    console.log("filepath of dragged files: ", f.path);
    console.log("I have the file", f.path);
    fileInputName.innerHTML = f.name;
    if(convert){
        console.log("hello")
        convert.addEventListener("click", (e) => {
            urlToPdf(f.path);
        });
    }
}   
});


//Event listeners for drag and drop including
document.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
});

document.addEventListener("dragcenter", (e) => {
    console.log("File is in the drop space");
});

document.addEventListener("dragleave", (e) => {
    console.log("file has left the drop space");
});


function alertSuccess() {
    Toastify.toast({
        text: "Success!",
        duration: 3000,
        close: false,
        style: {
            background: "green",
            color: "white",
            textAlign: "center",
        },
    });
}

function alertError(message) {
    Toastify.toast({
        text: message,
        duration: 3000,
        close: false,
        style: {
            background: "red",
            color: "white",
            textAlign: "center",
        },
    });
}




 