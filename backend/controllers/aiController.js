const { GoogleGenAI } = require("@google/genai");
const fileService = require("../services/fileService");

// Initialize Gemini AI
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const aiController = {
  // HealthMate AI Chat
  healthMate: async (req, res) => {
    try {
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
  },

  // File summarization
  summarizeFile: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false,
          error: "No file uploaded." 
        });
      }

      // Validate file size (10MB max)
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

      // Extract text from file
      const text = await fileService.extractTextFromFile(fileBuffer, fileType);

      if (!text || text.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: "Could not extract text from file. The file might be empty, corrupted, or contain only images."
        });
      }

      // Limit text length for API constraints
      const maxLength = 30000;
      const truncatedText = text.length > maxLength 
        ? text.substring(0, maxLength) + "\n\n[Text truncated due to length...]"
        : text;

      const summaryPrompt = `
You are **HealthMate** – Sehat ka Smart Dost 💚  
An AI-powered personal health companion that helps users understand their medical reports, track vitals, and make informed health decisions.

**Your Task:**
Analyze the following medical report and provide a comprehensive, easy-to-understand summary.

**Medical Report Content:**
${truncatedText}

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
  }
};

module.exports = aiController;