const { GoogleGenAI } = require("@google/genai");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");

// Initialize Gemini 2.5 client
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

// Helper function to extract text from PDF buffer
async function extractTextFromPDFBuffer(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch (error) {
    console.error("PDF Parsing Error:", error);
    throw new Error("PDF parsing failed: " + error.message);
  }
}

// File summarization controller
const summarizeFile = async (req, res) => {
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

    // Extract text depending on file type
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

// prompt
const prompt = `
You are **HealthMate** – Your Smart Health Companion 💚  
An AI-powered personal health assistant that helps users understand their medical reports with clarity and care.

**CRITICAL INSTRUCTION: OUTPUT ONLY CLEAN HTML CODE WITH TAILWIND CSS CLASSES.**

**Formatting Rules (STRICTLY FOLLOW):**
- Return ONLY a single HTML block - no explanations, no markdown code fences, no extra text
- Use ONLY Tailwind CSS utility classes for styling
- NO inline styles, NO <style> tags, NO custom CSS
- Structure: Clean, modern, card-based layout with proper spacing
- Typography: Clear hierarchy using Tailwind text utilities
- Colors: Green palette for positive/normal, red for abnormal, yellow for warnings, blue for informational
- Make it scannable: Use icons (emoji), bold headers, organized sections, and white space

**Medical Report Content:**
${text}

**Context:**
${reportContext ? `Previous Report: ${reportContext}` : 'No previous report'}
${userVitals ? `Current Vitals: ${JSON.stringify(userVitals)}` : 'No vitals data'}
${userPrompt ? `User Question: ${userPrompt}` : ''}

**Required Sections (in this order):**

1. **Report Summary** - Clear overview in simple English with ONE Roman Urdu sentence for emotional connection
2. **Key Findings** - Bullet points of important values (normal + abnormal)
3. **Abnormal Values** (if any) - What's off, what it means, no medical jargon
4. **Recommended Actions** - Foods to eat/avoid, lifestyle tips
5. **Questions for Doctor** - 4-5 specific questions based on findings
6. **Important Notes** - Follow-up timeline, red flags
7. **Disclaimer** - Brief, in English + short Roman Urdu line

**HTML Structure Template:**

<div class="space-y-6 text-gray-800">
  <!-- Header -->
  <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border-l-4 border-green-500">
    <h2 class="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
      💚 HealthMate Analysis
    </h2>
    <p class="text-sm text-gray-600">Generated on [Date] • Report Type: [Type]</p>
  </div>

  <!-- Summary -->
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h3 class="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
      📋 Report Summary
    </h3>
    <p class="text-gray-700 leading-relaxed mb-3">[English explanation]</p>
    <p class="text-sm text-gray-600 italic">[One Roman Urdu line for warmth]</p>
  </div>

  <!-- Key Findings -->
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
      🔍 Key Findings
    </h3>
    <div class="space-y-3">
      <div class="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
        <span class="text-green-600 font-bold">✓</span>
        <div>
          <p class="font-medium text-gray-900">[Test Name]: [Value]</p>
          <p class="text-sm text-gray-600">[Brief explanation]</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Abnormal Values (if any) -->
  <div class="bg-red-50 p-6 rounded-lg border-l-4 border-red-500">
    <h3 class="text-xl font-semibold text-red-800 mb-4 flex items-center gap-2">
      ⚠️ Values Needing Attention
    </h3>
    <div class="space-y-4">
      <div class="bg-white p-4 rounded-lg">
        <p class="font-semibold text-gray-900 mb-1">[Test Name]: [Value] [Unit]</p>
        <p class="text-sm text-gray-700 mb-2"><span class="font-medium">Normal Range:</span> [Range]</p>
        <p class="text-sm text-gray-600">[What this means in simple terms]</p>
      </div>
    </div>
  </div>

  <!-- Recommended Actions -->
  <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
    <h3 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
      🥗 Recommended Actions
    </h3>
    <div class="grid md:grid-cols-2 gap-4">
      <div class="p-4 bg-green-50 rounded-lg">
        <p class="font-semibold text-green-800 mb-2">✅ Foods to Include</p>
        <ul class="text-sm text-gray-700 space-y-1">
          <li>• [Food item with brief reason]</li>
        </ul>
      </div>
      <div class="p-4 bg-red-50 rounded-lg">
        <p class="font-semibold text-red-800 mb-2">❌ Foods to Limit</p>
        <ul class="text-sm text-gray-700 space-y-1">
          <li>• [Food item with brief reason]</li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Questions for Doctor -->
  <div class="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-500">
    <h3 class="text-xl font-semibold text-blue-900 mb-4 flex items-center gap-2">
      💬 Questions to Ask Your Doctor
    </h3>
    <ol class="space-y-2 text-sm text-gray-700">
      <li class="flex gap-2">
        <span class="font-semibold text-blue-700">1.</span>
        <span>[Specific question based on findings]</span>
      </li>
    </ol>
  </div>

  <!-- Important Notes -->
  <div class="bg-yellow-50 p-5 rounded-lg border-l-4 border-yellow-500">
    <h3 class="text-lg font-semibold text-yellow-900 mb-3 flex items-center gap-2">
      📌 Important Notes
    </h3>
    <ul class="text-sm text-gray-700 space-y-2">
      <li>• <span class="font-medium">Follow-up:</span> [Timeline recommendation]</li>
      <li>• <span class="font-medium">Watch for:</span> [Red flag symptoms]</li>
    </ul>
  </div>

  <!-- Disclaimer -->
  <div class="bg-gray-100 p-4 rounded-lg border border-gray-300">
    <p class="text-xs text-gray-700 leading-relaxed">
      <span class="font-semibold">⚠️ Medical Disclaimer:</span> This AI analysis is for educational purposes only and does not replace professional medical advice. Always consult your healthcare provider before making any medical decisions.
      <br>
      <span class="italic text-gray-600 mt-1 inline-block">Doctor se mashwara zaroor karein - yeh sirf samajhne ke liye hai.</span>
    </p>
  </div>
</div>

**NOW GENERATE THE COMPLETE HTML USING THIS STRUCTURE WITH ACTUAL MEDICAL DATA.**
`;

// ... (Rest of the controller code, calling Gemini, remains the same) ...
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
};

module.exports = summarizeFile;