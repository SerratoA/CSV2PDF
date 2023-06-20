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



// document.addEventListener('change', loadCsv);

// function loadCsv(e) {
//     const file = e.target.files[0];

//     if (!isFileCsv){
//         console.log("please select a csv file!")
//         return;
//     }
//     console.log("we are almost there");

//     const csv = new csv();
//     csv.src = URL.createObjectURL(file);
//     form.style.display = "block";
//     filename.innerText = file.name;
//     outputPath.innerText = path.join(os.homedir(), "CSVtoPDF");

// }

// // make sure file is csv 
// function isFileCsv(file){
//     const acceptedFile = ['csv']
//     return file && acceptedFile.includes(file['type']);
// }





 