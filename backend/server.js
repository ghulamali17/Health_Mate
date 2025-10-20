const express = require("express");
const cors = require("cors");
const connectDB = require("./connection");
const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const cookieParser = require("cookie-parser");
const { GoogleGenAI } = require("@google/genai");
const multer = require("multer");
const PDFParser = require("pdf2json");
const mammoth = require("mammoth");

const app = express();
const PORT = process.env.PORT || 3001;

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const allowedOrigins = [
  "http://localhost:5173",
  "https://health-mate-dcv3.vercel.app",
  "https://health-mate-3x6x-h4sg0hzj5-ghulam-alis-projects-b7b1d0e4.vercel.app",
  "https://health-mate-git-main-ghulam-alis-projects-b7b1d0e4.vercel.app",
  "https://health-mate-*.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.some(allowedOrigin => {
      if (allowedOrigin.includes('*')) {
        const regex = new RegExp(allowedOrigin.replace('*', '.*'));
        return regex.test(origin);
      }
      return allowedOrigin === origin;
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

app.use("/images", express.static("public/images"));

// Initialize Gemini 2.5 
let ai;
try {
  ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY,
  });
  console.log("✅ Gemini AI client initialized");
} catch (error) {
  console.error("❌ Failed to initialize Gemini AI:", error);
}

// MongoDB connection 
if (process.env.NODE_ENV !== 'production') {
  connectDB();
} else {
  connectDB().catch(err => {
    console.error('MongoDB connection error:', err);
  });
}

app.get("/api/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "HealthMate API is running smoothly!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes with error handling
try {
  app.use("/api/users", userRouter);
  console.log("✅ User routes loaded");
} catch (error) {
  console.error("❌ Error loading user routes:", error);
}

try {
  app.use("/api/chat", chatRouter);
  console.log("✅ Chat routes loaded");
} catch (error) {
  console.error("❌ Error loading chat routes:", error);
}

// PDF text extraction
async function extractTextFromPDFBuffer(buffer) {
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
}

// HealthMate Gemini 
app.post("/api/healthmate", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({ 
        error: "AI service not available",
        details: "Gemini AI client not initialized" 
      });
    }

    const { prompt, vitals, reportContext } = req.body;
    const userPrompt = prompt || "Hello from HealthMate AI Assistant!";
    const userVitals = vitals || null;
    const userReportContext = reportContext || null;

    // Validate prompt length
    if (userPrompt.length > 1000) {
      return res.status(400).json({
        error: "Prompt too long",
        details: "Please keep your prompt under 1000 characters"
      });
    }

    const healthPrompt = `
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
${userReportContext ? `Recent Report Analysis: ${userReportContext}` : 'No recent report context'}
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
      contents: healthPrompt,
    });

    res.json({ 
      success: true,
      text: response.text,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Gemini API error:", error);

    if (error.message?.includes('API_KEY') || error.message?.includes('authentication')) {
      return res.status(500).json({
        error: "Authentication failed",
        details: "Please check your Google API key configuration"
      });
    }
    
    if (error.message?.includes('quota') || error.message?.includes('rate limit')) {
      return res.status(429).json({
        error: "Service temporarily unavailable",
        details: "API quota exceeded. Please try again later."
      });
    }
    
    res.status(500).json({
      error: "AI service temporarily unavailable",
      details: process.env.NODE_ENV === 'production' ? "Please try again later" : error.message
    });
  }
});

// File summarization 
app.post("/api/summarize", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        error: "No file uploaded." 
      });
    }

    // Validating
    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        error: "File too large. Please upload files smaller than 10MB."
      });
    }

    const fileBuffer = req.file.buffer;
    const fileType = req.file.mimetype;
    const userPrompt = req.body?.prompt?.trim() || "Please analyze this medical report";
    const userVitals = req.body?.vitals ? JSON.parse(req.body.vitals) : null;
    const reportContext = req.body?.reportContext || null;
    let text = "";

    console.log("Processing file:", req.file.originalname, "Type:", fileType, "Size:", req.file.size);

    // Extract text depending on file type
    if (fileType === "application/pdf") {
      text = await extractTextFromPDFBuffer(fileBuffer);
    } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      text = result.value;
    } else if (fileType.startsWith("text/")) {
      text = fileBuffer.toString("utf8");
    } else {
      return res.status(400).json({
        success: false,
        error: "Unsupported file type. Please upload PDF, DOCX, or TXT files."
      });
    }

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "Could not extract text from file. The file might be empty, corrupted, or contain only images."
      });
    }

    // Limit text length for API constraints
    const maxLength = 30000;
    if (text.length > maxLength) {
      text = text.substring(0, maxLength) + "\n\n[Text truncated due to length...]";
    }

    const summaryPrompt = `
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
      contents: summaryPrompt,
    });

    res.json({ 
      success: true,
      summary: response.text,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Summarization error:", error);
    res.status(500).json({
      success: false,
      error: "Summarization failed",
      details: process.env.NODE_ENV === 'production' ? "Please try again later" : error.message
    });
  }
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({ 
    success: true,
    message: "HealthMate Backend API is running!",
    version: "1.0.0",
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: "/api/health",
      healthmate: "/api/healthmate",
      summarize: "/api/summarize",
      users: "/api/users",
      chat: "/api/chat"
    }
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl
  });
});

app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    success: false,
    error: "Internal server error",
    details: process.env.NODE_ENV === 'production' ? "Something went wrong" : error.message
  });
});


module.exports = app;

// Start server only in local development
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`✅ Server is running at http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}