const html_to_pdf = require('html-pdf-node');
const fs = require('fs');
const path = require('path');



const websiteName = "Fixed HT Great Lakes"; // created folder name

const file = [] // array of objects for urls

fs.readFile('Hightower Great Lakes URLs.csv', 'utf8', (err, data) =>{ // line by line url read, put into file format 
    if (err) {
        console.error("Invalid format! HUh");
        return;
    }
    const lines = data.split('\n');
    lines.forEach((line) => {

        const fileObject = {
            url: line.trim()
        };
        console.log(fileObject); // debugging
        file.push(fileObject);
    })
})

// formatting of the output pdf
const options = {
    format: 'A4',
    displayHeaderFooter: true,
    printBackground: true,
    headerTemplate: "title",
    scale: 1.0,
};

// make it so that it works with any website
const folderName = 
    "/Users/chaeilyun/Desktop/Robert's Zipped Pdfs/" + websiteName + " Folder";

try {
    if(!fs.existsSync(folderName)){
        fs.mkdirSync(folderName);
    }
} catch (error) {
    console.error("Error when creating valid folder!");
}

/* 
generatePdfs:
input: 
    - file: urls of websites
    - options: formatting options of output pdf
*/ 
html_to_pdf.generatePdfs(file, options).then(output => {
    for (let i = 0; i < output.length; i++) {

        let humanPageCount = i + 1; 

        // uses base name as pdf name
        const fileName = path.basename(file[i].url);
        const teamName = path.parse(fileName).name;
        let outputFilePath = folderName + "/" + teamName + '.pdf'; 
        
        //buffering time
        let pdfBuffer = Buffer.from(output[i].buffer);
        function convertBufferToPDF(filePath, buffer) {
            try {
                fs.writeFileSync(filePath, buffer);
                console.log('PDF file #' + humanPageCount + ' created');
            } catch (error) {
                console.error('Error creating PDF file #'+humanPageCount+': ', error);
            }
        }
        convertBufferToPDF(outputFilePath, pdfBuffer);
    }
}) 