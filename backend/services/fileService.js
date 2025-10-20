const PDFParser = require("pdf2json");
const mammoth = require("mammoth");

const fileService = {
  // Extract text from PDF buffer
  extractTextFromPDFBuffer: (buffer) => {
    return new Promise((resolve, reject) => {
      try {
        const pdfParser = new PDFParser(null, 1);

        pdfParser.on("pdfParser_dataError", (errData) => {
          console.error("PDF Parser Error:", errData);
          reject(new Error("PDF parsing failed: " + (errData.parserError || "Unknown error")));
        });

        pdfParser.on("pdfParser_dataReady", (pdfData) => {
          try {
            let text = "";
            if (pdfData.Pages && pdfData.Pages.length > 0) {
              pdfData.Pages.forEach((page) => {
                if (page.Texts && page.Texts.length > 0) {
                  page.Texts.forEach((textItem) => {
                    if (textItem.R && textItem.R.length > 0) {
                      textItem.R.forEach((run) => {
                        if (run.T) {
                          text += decodeURIComponent(run.T) + " ";
                        }
                      });
                    }
                  });
                }
                text += "\n";
              });
            }
            
            if (!text || text.trim().length === 0) {
              text = pdfParser.getRawTextContent() || "";
            }
            
            resolve(text.trim());
          } catch (err) {
            console.error("Error processing PDF data:", err);
            reject(err);
          }
        });

        pdfParser.parseBuffer(buffer);
      } catch (error) {
        reject(new Error("PDF parser initialization failed: " + error.message));
      }
    });
  },

  // Extract text from various file types
  extractTextFromFile: async (buffer, fileType) => {
    let text = "";

    if (fileType === "application/pdf") {
      text = await fileService.extractTextFromPDFBuffer(buffer);
    } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ buffer: buffer });
      text = result.value;
    } else if (fileType.startsWith("text/")) {
      text = buffer.toString("utf8");
    } else {
      throw new Error("Unsupported file type");
    }

    return text;
  }
};

module.exports = fileService;