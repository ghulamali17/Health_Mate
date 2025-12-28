const { GoogleGenAI } = require("@google/genai");

// Initialize Gemini 2.5 client
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// HealthLens Gemini controller
const healthlensChat = async (req, res) => {
  try {
    // Validate API key
    if (!process.env.GOOGLE_API_KEY) {
      console.error("GOOGLE_API_KEY is not set");
      return res.status(500).json({
        error: "AI service configuration error. Please contact support.",
      });
    }

    const userPrompt =
      req.body.prompt?.trim() || "Hello from HealthLens AI Assistant!";
    const userVitals = req.body.vitals || null;
    const reportContext = req.body.reportContext || null;

    // Validate user prompt
    if (!userPrompt || userPrompt.length === 0) {
      return res.status(400).json({
        error: "Please provide a question or message",
      });
    }

    // Limit prompt length
    if (userPrompt.length > 5000) {
      return res.status(400).json({
        error: "Message is too long. Please keep it under 5000 characters.",
      });
    }

    console.log("HealthLens chat request:", {
      promptLength: userPrompt.length,
      hasVitals: !!userVitals,
      hasReportContext: !!reportContext,
    });

    const prompt = `
You are **HealthLens** – Your Smart Health Vision 🔍💚  
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
${
  reportContext
    ? `Recent Report Analysis: ${reportContext}`
    : "No recent report context"
}
${
  userVitals
    ? `Current Vitals: ${JSON.stringify(userVitals)}`
    : "No vitals data"
}

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

    console.log("Sending request to Gemini...");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    if (!response || !response.text) {
      throw new Error("No response received from AI service");
    }

    console.log("HealthLens response generated successfully");
    res.json({ text: response.text });
  } catch (error) {
    console.error("HealthLens chat error:", error);

    // Handle specific error types
    if (error.message?.includes("API key")) {
      return res.status(500).json({
        error: "AI service configuration error",
        details: "Please contact support",
      });
    }

    if (
      error.message?.includes("quota") ||
      error.message?.includes("rate limit")
    ) {
      return res.status(429).json({
        error: "Service temporarily unavailable",
        details: "Our AI is busy right now. Please try again in a few moments.",
      });
    }

    if (
      error.message?.includes("safety") ||
      error.message?.includes("blocked")
    ) {
      return res.status(400).json({
        error: "Unable to process request",
        details:
          "Your message couldn't be processed. Please rephrase and try again.",
      });
    }

    res.status(500).json({
      error: "Something went wrong",
      details:
        process.env.NODE_ENV === "production"
          ? "Please try again later"
          : error.message,
    });
  }
};

module.exports = healthlensChat;
