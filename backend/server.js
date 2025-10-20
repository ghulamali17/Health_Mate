const express = require("express");
const cors = require("cors");
const connectDB = require("./connection");
const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const cookieParser = require("cookie-parser");
const { GoogleGenAI } = require("@google/genai");
const multer = require("multer");
const fs = require("fs");
const PDFParser = require("pdf2json");
const mammoth = require("mammoth");

const app = express();
const PORT = process.env.PORT || 3001;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://health-mate-dcv3.vercel.app",
    "https://health-mate-3x6x-h4sg0hzj5-ghulam-alis-projects-b7b1d0e4.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options("*", cors());

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
app.use("/api/chat", chatRouter);

// Helper function to extract text from PDF buffer (updated for Vercel)
async function extractTextFromPDFBuffer(buffer) {
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

    pdfParser.parseBuffer(buffer);
  });
}

// HealthMate Gemini route
app.post("/api/healthmate", async (req, res) => {
  try {
    const userPrompt = req.body.prompt || "Hello from HealthMate AI Assistant!";
    const userVitals = req.body.vitals || null;
    const reportContext = req.body.reportContext || null;

    const prompt = `
You are **HealthMate** – Sehat ka Smart Dost 💚  
An AI-powered personal health companion that helps users understand their medical reports, track vitals, and make informed health decisions.

**Your Role:**
- Explain medical reports, lab results, and health data in **simple, easy-to-understand language**
- Provide responses in **both English and Roman Urdu** when appropriate
- Help users understand what their health numbers mean (BP, sugar levels, cholesterol, etc.)
- Highlight abnormal values compassionately without causing alarm
- Suggest 3-5 relevant questions users can ask their doctor
- Recommend foods to eat or avoid based on their health data
- Share simple home remedies when applicable
- Always remind users: **"AI is for understanding only, not for medical advice. Always consult your doctor before making any decision."** (Roman Urdu: "Yeh AI samajhne ke liye hai, ilaaj ke liye nahi. Koi bhi faisla lene se pehle apne doctor se zaroor mashwara karein.")

**Context:**
${reportContext ? `Recent Report Analysis: ${reportContext}` : 'No recent report context'}
${userVitals ? `Current Vitals: ${JSON.stringify(userVitals)}` : 'No vitals data'}

**User's Question:**
"${userPrompt}"

**Guidelines:**
- Be warm, friendly, and reassuring
- Use simple words, avoid heavy medical jargon
- If values are abnormal, explain what it means and why it matters
- Never provide diagnosis or treatment plans
- For non-medical questions, respond helpfully but gently guide back to health topics
- Include both English and Roman Urdu explanations when explaining medical terms
- End with encouragement to consult a healthcare professional

**Response Format:**
- Start with a clear answer
- Add Roman Urdu explanation if medical terms are used
- Include actionable insights (foods, questions for doctor, etc.)
- Close with the disclaimer

Respond now:
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

// File summarization route 
app.post("/api/summarize", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const fileBuffer = req.file.buffer;
    const fileType = req.file.mimetype;
    const userPrompt = req.body?.prompt?.trim() || "Please analyze this medical report";
    const userVitals = req.body?.vitals ? JSON.parse(req.body.vitals) : null;
    const reportContext = req.body?.reportContext || null;
    let text = "";

    console.log("Processing file:", req.file.originalname);
    console.log("File type:", fileType);

    // Extract text depending on file type (using buffers instead of file system)
    if (fileType === "application/pdf") {
      text = await extractTextFromPDFBuffer(fileBuffer);
    } else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({
        buffer: fileBuffer,
      });
      text = result.value;
    } else if (fileType.startsWith("text/")) {
      text = fileBuffer.toString("utf8");
    } else {
      return res
        .status(400)
        .json({ error: "Unsupported file type. Please upload PDF, DOCX, or TXT files." });
    }

    if (!text || text.trim().length === 0) {
      return res
        .status(400)
        .json({ error: "Could not extract text from file. The file might be empty or corrupted." });
    }

    // Limit text length
    const maxLength = 30000;
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + "\n\n[Text truncated due to length...]";
    }

    // prompt
    const prompt = `
You are **HealthMate** – Sehat ka Smart Dost 💚  
An AI-powered personal health companion that helps users understand their medical reports, track vitals, and make informed health decisions.

**Your Task:**
Analyze the following medical report and provide a comprehensive, easy-to-understand summary.

**Medical Report Content:**
${text}

**Additional Context:**
${reportContext ? `Previous Report Context: ${reportContext}` : 'No previous report context'}
${userVitals ? `Current Vitals: ${JSON.stringify(userVitals)}` : 'No current vitals provided'}
${userPrompt ? `User's Specific Question: ${userPrompt}` : ''}

**Please provide:**

1. **Summary (English + Roman Urdu)**
   - Overview of the report in simple terms
   - Key findings and what they mean

2. **Abnormal Values** (if any)
   - Highlight values outside normal range
   - Explain what each abnormality means
   - Use compassionate language (avoid alarming tone)

3. **Foods to Eat / Avoid**
   - Based on the report findings
   - Practical dietary recommendations

4. **Home Remedies** (if applicable)
   - Simple, safe remedies
   - Only evidence-based suggestions

5. **Questions to Ask Your Doctor**
   - 3-5 relevant questions based on findings
   - Help users have better doctor conversations

6. **Important Notes**
   - Any red flags that need immediate attention
   - Timeline for follow-up if needed

**Guidelines:**
- Use simple, non-technical language
- Include Roman Urdu translations for medical terms
- Be warm, friendly, and reassuring
- Never diagnose or prescribe treatment
- Encourage consulting healthcare professionals

**Always end with this disclaimer:**
⚠️ **Disclaimer:** AI is for understanding only, not for medical advice. Always consult your doctor before making any decision.
(Roman Urdu: Yeh AI samajhne ke liye hai, ilaaj ke liye nahi. Koi bhi faisla lene se pehle apne doctor se zaroor mashwara karein.)

Provide your analysis now:
`;

    console.log("Sending to Gemini for summarization...");
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ summary: response.text });
  } catch (error) {
    console.error("Summarization error:", error);
    res.status(500).json({
      error: "Summarization failed",
      details: error.message,
    });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    message: "HealthMate Backend API is running!",
    version: "1.0.0",
    endpoints: {
      healthmate: "/api/healthmate",
      summarize: "/api/summarize",
      users: "/api/users",
      chat: "/api/chat"
    }
  });
});

// Export the app for Vercel
module.exports = app;

// Start server only in local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
  });
}