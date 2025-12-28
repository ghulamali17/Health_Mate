const { GoogleGenAI } = require("@google/genai");
const fileService = require("../services/fileService");

// Initialize Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const aiController = {
  // HealthLens AI Chat
  healthlens: async (req, res) => {
    try {
      // Validate API key first
      if (!process.env.GOOGLE_API_KEY) {
        console.error("GOOGLE_API_KEY is not set");
        return res.status(500).json({
          success: false,
          error: "AI service configuration error. Please contact support.",
        });
      }

      const { prompt, vitals, reportContext } = req.body;
      const userPrompt =
        prompt?.trim() || "Hello from HealthLens AI Assistant!";
      const userVitals = vitals || null;
      const userReportContext = reportContext || null;

      // Validate prompt
      if (!userPrompt || userPrompt.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Please provide a message or question",
        });
      }

      // Validate prompt length
      if (userPrompt.length > 2000) {
        return res.status(400).json({
          success: false,
          error: "Message too long",
          details: "Please keep your message under 2000 characters",
        });
      }

      console.log("HealthLens chat request:", {
        promptLength: userPrompt.length,
        hasVitals: !!userVitals,
        hasReportContext: !!userReportContext,
      });

      const healthPrompt = `
You are **HealthLens** – Your Smart Health Vision 🔍💚  
An AI-powered personal health companion designed to help users better understand health information and make informed decisions.

**Your Role as HealthLens:**
- Explain health concepts, medical terms, and lab results in simple, clear English
- Translate essential medical terms into Roman Urdu when helpful (e.g., "Blood pressure" = "Blood pressure", "Diabetes" = "Diabetes")
- Help interpret what health numbers mean for overall wellbeing
- Identify unusual values with compassion and context
- Suggest practical questions to discuss with healthcare providers
- Offer general food and lifestyle suggestions based on health principles
- Share evidence-based wellness tips when relevant
- Always emphasize that you provide educational support, not medical advice

**Current Context:**
${
  userReportContext
    ? `Recent Health Information: ${userReportContext}`
    : "No recent health context"
}
${
  userVitals
    ? `Current Vitals Tracking: ${JSON.stringify(userVitals)}`
    : "No current vitals data"
}

**User's Health Question:**
"${userPrompt}"

**Communication Approach:**
- Use 85% English, 15% Roman Urdu (only for key medical terms)
- Maintain warm, supportive, and professional tone
- Break down complex concepts into simple analogies
- Focus on understanding rather than alarming
- If discussing numbers, explain what they mean in practical terms
- For non-health questions, gently guide toward health topics while being helpful

**Response Structure:**
1. **Direct Answer** - Clear response to the user's question
2. **Simple Explanation** - Easy-to-understand details in English
3. **Key Terms Translation** - Essential medical terms in Roman Urdu
4. **Actionable Insights** - Practical suggestions and doctor discussion points
5. **Professional Reminder** - Importance of consulting healthcare providers

**Critical Boundaries:**
- NEVER diagnose medical conditions
- NEVER prescribe treatments or medications
- NEVER provide emergency advice
- ALWAYS encourage professional medical consultation
- Use Roman Urdu strategically - only where it adds clarity

**Required Closing Note:**
🔍💚 **HealthLens Reminder:** I'm here to help you understand health information better. For medical advice, diagnosis, or treatment, please consult with qualified healthcare professionals.

(Roman Urdu: Main health information samajhne mein aapki madad karta hoon. Ilmi mashware ke liye hamesha qualified doctor se raabta karein.)

Please provide your HealthLens response:
`;

      console.log("Sending chat request to Gemini...");
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: healthPrompt,
      });

      if (!response || !response.text) {
        throw new Error("No response received from AI service");
      }

      console.log("Chat response received successfully");
      res.json({
        success: true,
        text: response.text,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("HealthLens chat error:", error);

      if (
        error.message?.includes("API_KEY") ||
        error.message?.includes("authentication")
      ) {
        return res.status(500).json({
          success: false,
          error: "AI service authentication failed",
          details: "Please contact support",
        });
      }

      if (
        error.message?.includes("quota") ||
        error.message?.includes("rate limit")
      ) {
        return res.status(429).json({
          success: false,
          error: "Service temporarily unavailable",
          details: "Our AI is busy. Please try again in a few moments.",
        });
      }

      if (
        error.message?.includes("safety") ||
        error.message?.includes("blocked")
      ) {
        return res.status(400).json({
          success: false,
          error: "Unable to process request",
          details: "Please rephrase your question and try again.",
        });
      }

      res.status(500).json({
        success: false,
        error: "AI service temporarily unavailable",
        details:
          process.env.NODE_ENV === "production"
            ? "Please try again later"
            : error.message,
      });
    }
  },

  // File summarization
  summarizeFile: async (req, res) => {
    console.log("=== SUMMARIZE FILE ENDPOINT HIT ===");
    console.log("Environment:", process.env.NODE_ENV);
    console.log("Request headers:", req.headers["content-type"]);
    console.log("Request body keys:", Object.keys(req.body || {}));
    console.log(
      "File received:",
      req.file
        ? `Yes - ${req.file.originalname} (${req.file.size} bytes)`
        : "No file"
    );

    try {
      // Validate API key first
      if (!process.env.GOOGLE_API_KEY) {
        console.error("GOOGLE_API_KEY is not set");
        return res.status(500).json({
          success: false,
          error: "AI service configuration error. Please contact support.",
        });
      }

      if (!req.file) {
        console.log("❌ No file uploaded");
        return res.status(400).json({
          success: false,
          error: "No file uploaded. Please select a file to summarize.",
        });
      }

      console.log("📁 File details:", {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        encoding: req.file.encoding,
      });

      // Validate file size (10MB max)
      if (req.file.size > 10 * 1024 * 1024) {
        console.log("❌ File too large:", req.file.size, "bytes");
        return res.status(400).json({
          success: false,
          error: "File too large. Please upload files smaller than 10MB.",
        });
      }

      // Validate file type
      const allowedMimeTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "text/markdown",
      ];

      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        console.log("❌ Invalid file type:", req.file.mimetype);
        return res.status(400).json({
          success: false,
          error:
            "Invalid file type. Only PDF, DOCX, TXT, and MD files are allowed.",
        });
      }

      const fileBuffer = req.file.buffer;
      const fileType = req.file.mimetype;

      // Parse additional data from form
      let userPrompt = "Please analyze this medical report";
      let userVitals = null;
      let reportContext = null;

      try {
        if (req.body?.prompt) {
          userPrompt = req.body.prompt.trim();
        }
        if (req.body?.vitals) {
          userVitals =
            typeof req.body.vitals === "string"
              ? JSON.parse(req.body.vitals)
              : req.body.vitals;
        }
        if (req.body?.reportContext) {
          reportContext = req.body.reportContext;
        }
      } catch (parseError) {
        console.warn(
          "Warning: Error parsing additional form data:",
          parseError
        );
      }

      console.log("🔧 Processing parameters:", {
        userPrompt,
        hasVitals: !!userVitals,
        hasReportContext: !!reportContext,
      });

      // Extract text from file
      console.log("📖 Extracting text from file...");
      let text;
      try {
        text = await fileService.extractTextFromFile(fileBuffer, fileType);
        console.log(
          "✅ Text extraction successful, length:",
          text?.length || 0
        );
      } catch (extractionError) {
        console.error("❌ Text extraction failed:", extractionError);
        return res.status(400).json({
          success: false,
          error:
            "Failed to extract text from file. The file might be corrupted, password-protected, or contain only images.",
          details:
            process.env.NODE_ENV === "production"
              ? undefined
              : extractionError.message,
        });
      }

      if (!text || text.trim().length === 0) {
        console.log("❌ No text extracted from file");
        return res.status(400).json({
          success: false,
          error:
            "Could not extract text from file. The file might be empty, corrupted, or contain only images/scanned content.",
        });
      }

      // Limit text length for API constraints
      const maxLength = 30000;
      const truncatedText =
        text.length > maxLength
          ? text.substring(0, maxLength) +
            "\n\n[Text truncated due to length...]"
          : text;

      console.log("📊 Text stats:", {
        originalLength: text.length,
        truncatedLength: truncatedText.length,
        truncated: text.length > maxLength,
      });

      const summaryPrompt = `
You are **HealthLens** – Your Smart Health Vision 🔍💚  
An AI-powered personal health companion that helps users understand medical reports, track vitals, and make informed health decisions.

**Your Mission:**
As HealthLens, your role is to analyze medical reports and provide clear, compassionate explanations that bridge the gap between complex medical terminology and everyday understanding.

**Report to Analyze:**
${truncatedText}

**User Context:**
${
  reportContext
    ? `Previous Health Context: ${reportContext}`
    : "No previous health context available"
}
${
  userVitals
    ? `Current Vitals Tracking: ${JSON.stringify(userVitals)}`
    : "No current vitals data provided"
}
${
  userPrompt
    ? `User's Specific Question: ${userPrompt}`
    : "General analysis requested"
}

**Please Provide This Analysis:**

**1. Bilingual Report Summary**
- **English Overview:** Clear explanation of main findings in simple terms
- **Roman Urdu Key Points:** Only essential medical terms translated (e.g., "Blood pressure" = "Blood pressure", "Diabetes" = "Diabetes")

**2. Health Values Analysis**
- Normal ranges highlighted with ✅
- Abnormal values marked with ⚠️ and explained simply
- What each value means for overall health

**3. Practical Health Guidance**
- **Foods to Include:** 2-3 specific food recommendations
- **Foods to Limit:** 2-3 items to reduce or avoid
- **Lifestyle Tips:** Simple daily habits for better health

**4. Doctor Discussion Prep**
- 3 specific questions to ask healthcare provider
- Focus on understanding next steps and monitoring

**5. Important Health Notes**
- Any values needing prompt medical attention
- Suggested timeline for follow-up checks
- Key observations about health trends

**Communication Guidelines:**
- Use 90% English, 10% Roman Urdu (only for essential medical terms)
- Maintain warm, reassuring, and professional tone
- Focus on education and understanding, not diagnosis
- Use simple analogies for complex medical concepts
- Be encouraging and supportive throughout

**Critical Rules:**
- NEVER provide medical diagnosis or treatment plans
- ALWAYS emphasize consulting healthcare professionals
- Use Roman Urdu sparingly - only for key medical terms that need translation
- Keep explanations practical and actionable

**Required Closing Disclaimer:**
💡 **Important Reminder:** This AI analysis is for educational purposes only to help you understand medical information better. Always consult with qualified healthcare professionals for medical advice and treatment decisions.

(Roman Urdu: Yeh AI analysis samajhne mein madad ke liye hai. Asal ilaaj ke liye hamesha doctor se mashwara karein.)

Now provide your HealthLens analysis:
`;

      console.log("🚀 Sending to Gemini for summarization...");
      console.log("Prompt length:", summaryPrompt.length);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: summaryPrompt,
      });

      if (!response || !response.text) {
        throw new Error("No response received from AI service");
      }

      console.log(
        "✅ Summarization successful, response length:",
        response.text?.length || 0
      );

      res.json({
        success: true,
        summary: response.text,
        timestamp: new Date().toISOString(),
        fileInfo: {
          name: req.file.originalname,
          type: req.file.mimetype,
          size: req.file.size,
          textLength: text.length,
        },
      });
    } catch (error) {
      console.error("❌ Summarization error:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
        code: error.code,
      });

      // Handle specific Gemini API errors
      if (
        error.message?.includes("API_KEY") ||
        error.message?.includes("authentication")
      ) {
        return res.status(500).json({
          success: false,
          error: "AI service authentication failed",
          details: "Please check the API configuration",
        });
      }

      if (
        error.message?.includes("quota") ||
        error.message?.includes("rate limit")
      ) {
        return res.status(429).json({
          success: false,
          error: "AI service temporarily unavailable",
          details: "API quota exceeded. Please try again later.",
        });
      }

      if (
        error.message?.includes("content") ||
        error.message?.includes("safety")
      ) {
        return res.status(400).json({
          success: false,
          error: "Content could not be processed",
          details:
            "The file content might be inappropriate or contain unsupported material.",
        });
      }

      res.status(500).json({
        success: false,
        error: "File summarization failed",
        details:
          process.env.NODE_ENV === "production"
            ? "Please try again with a different file or check the file format."
            : error.message,
      });
    }
  },

  // Health check endpoint for AI services
  healthCheck: async (req, res) => {
    try {
      if (!process.env.GOOGLE_API_KEY) {
        return res.status(503).json({
          success: false,
          message: "AI services are unavailable",
          geminiStatus: "not configured",
          error: "GOOGLE_API_KEY not set",
          timestamp: new Date().toISOString(),
        });
      }

      // Test Gemini API with a simple prompt
      const testResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: "Say 'HealthLens AI is working' in 3 words or less.",
      });

      res.json({
        success: true,
        message: "AI services are operational",
        geminiStatus: "connected",
        response: testResponse.text,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("AI health check failed:", error);
      res.status(503).json({
        success: false,
        message: "AI services are unavailable",
        geminiStatus: "disconnected",
        error:
          process.env.NODE_ENV === "production"
            ? "Service unavailable"
            : error.message,
        timestamp: new Date().toISOString(),
      });
    }
  },
};

module.exports = aiController;
