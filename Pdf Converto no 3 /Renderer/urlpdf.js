const html_to_pdf = require('html-pdf-node');
const fs = require('fs');
const path = require('path');

module.exports = function generatePdfs(filePath) {
  const websiteName = "App Tester 6"; // created folder name

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

  // make it work with any website
  const folderName =
    "/Users/chaeilyun/Desktop/" + websiteName + " Folder";

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
