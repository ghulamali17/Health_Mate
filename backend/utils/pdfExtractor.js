// utils/pdfExtractor.js
const PDFParser = require("pdf2json");

async function extractTextFromPDF(filePath) {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (errData) => {
      console.error("PDF Parser Error:", errData);
      reject(new Error(errData.parserError || "PDF parsing failed"));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      try {
        let text = pdfParser.getRawTextContent();
        if (!text || text.trim().length === 0) {
          text = "";
          (pdfData.Pages || []).forEach((page) => {
            (page.Texts || []).forEach((textItem) => {
              (textItem.R || []).forEach((run) => {
                text += decodeURIComponent(run.T) + " ";
              });
            });
            text += "\n";
          });
        }
        resolve(text);
      } catch (err) {
        reject(err);
      }
    });

    pdfParser.loadPDF(filePath);
  });
}

module.exports = { extractTextFromPDF };
