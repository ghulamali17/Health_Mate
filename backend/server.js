// const express = require("express");
// const cors = require("cors");
// const connectDB = require("./connection");
// const userRouter = require("./routes/userRoutes");
// const itemRouter = require("./routes/itemRoutes");
// const cookieParser = require('cookie-parser')

// const app = express();
// const PORT = 3001;

// // Middleware
// app.use(express.json());
// app.use(cors());
// app.use(cookieParser());
// app.use("/images", express.static("public/images"));

// // MongoDB connection
// connectDB();

// // Routes
// app.use("/api/users", userRouter);
// app.use("/api/items", itemRouter);

// // Server start
// app.listen(PORT, () => {
//   console.log(`Server is running at http://localhost:${PORT}`);
// });

const express = require("express");
const cors = require("cors");
const connectDB = require("./connection");
const userRouter = require("./routes/userRoutes");
const itemRouter = require("./routes/itemRoutes");
// const benefRouter = require("./routes/benefRoutes");
const cookieParser = require("cookie-parser");
const { GoogleGenAI } = require("@google/genai");
const multer = require("multer");
const fs = require("fs");
const PDFParser = require("pdf2json");
const mammoth = require("mammoth");

const app = express();
const PORT = 3001;
const upload = multer({ dest: "uploads/" });

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/images", express.static("public/images"));

// Initialize Gemini 2.5 client
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// MongoDB connection
connectDB();

// Routes
app.use("/api/users", userRouter);
app.use("/api/items", itemRouter);
// app.use("/api/beneficiaries", benefRouter);

// Helper function to extract text from PDF
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
          pdfData.Pages.forEach((page) => {
            page.Texts.forEach((textItem) => {
              textItem.R.forEach((run) => {
                text += decodeURIComponent(run.T) + " ";
              });
            });
            text += "\n";
          });
        }
        resolve(text);
      } catch (err) {
        console.error("Error processing PDF data:", err);
        reject(err);
      }
    });

    pdfParser.loadPDF(filePath);
  });
}

// 🧠 Gemini test (chat) route
app.post("/api/gemini", async (req, res) => {
  try {
    const userPrompt = req.body.prompt || "Hello from HealthMate AI Assistant!";

    const prompt = `
You are **HealthMate**, an AI medical assistant created to help users understand health information in a friendly, accurate, and non-alarming way.

Respond clearly and compassionately.  
If the question is not medical, still respond helpfully but politely guide toward health-related insights when possible.  
Avoid self-diagnosis suggestions. Use simple English.

User says: "${userPrompt}"
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ text: response.text });
  } catch (error) {
    console.error("Gemini API error:", error);
    res.status(500).json({
      error: "Something went wrong",
      details: error.message,
    });
  }
});

// 📄 File summarization route
app.post("/api/summarize", upload.single("file"), async (req, res) => {
  let filePath;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    filePath = req.file.path;
    const fileType = req.file.mimetype;
    const userPrompt = req.body?.prompt?.trim();
    let text = "";

    console.log("Processing file:", req.file.originalname);
    console.log("File type:", fileType);

    // Extract text depending on file type
    if (fileType === "application/pdf") {
      text = await extractTextFromPDF(filePath);
    } else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({
        buffer: fs.readFileSync(filePath),
      });
      text = result.value;
    } else if (fileType.startsWith("text/")) {
      text = fs.readFileSync(filePath, "utf8");
    } else {
      fs.unlinkSync(filePath);
      return res
        .status(400)
        .json({ error: "Unsupported file type. Please upload PDF, DOCX, or TXT files." });
    }

    fs.unlinkSync(filePath); // Clean up uploaded file

    if (!text || text.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "Could not extract text from file. The file might be empty or corrupted." });
    }

    // Limit text length for API
    const maxLength = 30000;
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + "\n\n[Text truncated due to length...]";
    }

    //  Smart HealthMate prompt
    const basePrompt = `
You are **HealthMate**, a professional AI health assistant.
Analyze the provided document carefully and summarize it clearly.

If it's a medical report, explain it in this structure:
1. 🧾 **Report Summary**
2. 📊 **Key Observations**
3. ⚠️ **Abnormal or Concerning Points**
4. 💡 **Meaning in Simple Terms**
5. 🩺 **Possible Next Steps or Doctor Advice**
6. 🌐 **Roman Urdu Summary** — short and easy for patients to understand.

If it's not medical, give a concise summary with important highlights.

${userPrompt ? `\nUser also requested: "${userPrompt}"\n` : ""}
Here is the document text:
${text}
`;

    console.log("Sending to Gemini for summarization...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: basePrompt,
    });

    res.json({ summary: response.text });
  } catch (error) {
    console.error("Summarization error:", error);
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.status(500).json({
      error: "Summarization failed",
      details: error.message,
    });
  }
});

// Server start
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
