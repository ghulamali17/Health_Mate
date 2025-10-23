const pdfModule = require("pdf-parse");
const pdfParse = pdfModule.default || pdfModule; 
const mammoth = require("mammoth");

const fileService = {
  extractTextFromPDFBuffer: async (buffer) => {
    try {
      console.log("📄 Starting PDF text extraction using pdf-parse...");
      const data = await pdfParse(buffer);
      
      if (!data.text || data.text.trim().length === 0) {
        throw new Error("PDF appears to be image-based or contains no extractable text");
      }
      
      console.log(`✅ PDF text extraction successful, extracted ${data.text.length} characters`);
      return data.text.trim();
    } catch (error) {
      console.error("❌ PDF parsing error:", error.message);
      throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
  },

  extractTextFromDOCXBuffer: async (buffer) => {
    try {
      console.log("📄 Starting DOCX text extraction using mammoth...");
      const result = await mammoth.extractRawText({ buffer });
      
      if (!result.value || result.value.trim().length === 0) {
        throw new Error("DOCX file appears to be empty or corrupted");
      }
      
      console.log(`✅ DOCX text extraction successful, extracted ${result.value.length} characters`);
      return result.value.trim();
    } catch (error) {
      console.error("❌ DOCX parsing error:", error.message);
      throw new Error(`Failed to extract text from DOCX: ${error.message}`);
    }
  },

  extractTextFromFile: async (buffer, fileType) => {
    console.log(`🔍 Extracting text from file, type: ${fileType}`);
    
    try {
      let text = "";

      if (fileType === "application/pdf") {
        text = await fileService.extractTextFromPDFBuffer(buffer);
      } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        text = await fileService.extractTextFromDOCXBuffer(buffer);
      } else if (fileType.startsWith("text/")) {
        text = buffer.toString("utf8");
        console.log(`✅ Text file extracted, ${text.length} characters`);
      } else {
        throw new Error(`Unsupported file type: ${fileType}`);
      }

      if (!text || text.trim().length === 0) {
        throw new Error("No text content could be extracted from the file");
      }

      return text;
    } catch (error) {
      console.error(`❌ File extraction error: ${error.message}`);
      throw error;
    }
  }
};

module.exports = fileService;