const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

class FileParser {
  static async extractTextFromPDFBuffer(buffer) {
    try {
      const data = await pdfParse(buffer);
      return data.text;
    } catch (error) {
      console.error("PDF Parsing Error:", error);
      throw new Error("PDF parsing failed: " + error.message);
    }
  }

  static async extractTextFromDOCXBuffer(buffer) {
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch (error) {
      console.error("DOCX Parsing Error:", error);
      throw new Error("DOCX parsing failed: " + error.message);
    }
  }

  static async extractTextFromTXTBuffer(buffer) {
    try {
      return buffer.toString("utf8");
    } catch (error) {
      console.error("TXT Parsing Error:", error);
      throw new Error("TXT parsing failed: " + error.message);
    }
  }

  static async extractTextFromFile(fileBuffer, fileType) {
    let text = "";

    switch (fileType) {
      case "application/pdf":
        text = await this.extractTextFromPDFBuffer(fileBuffer);
        break;
      case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        text = await this.extractTextFromDOCXBuffer(fileBuffer);
        break;
      case "text/plain":
        text = await this.extractTextFromTXTBuffer(fileBuffer);
        break;
      default:
        throw new Error("Unsupported file type");
    }

    // Limit text length
    const maxLength = 30000;
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + "\n\n[Text truncated due to length...]";
    }

    return text;
  }
}

module.exports = FileParser;