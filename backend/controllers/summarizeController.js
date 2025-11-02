const { GoogleGenAI } = require("@google/genai");
const fileService = require("../services/fileService");
const fileUploadService = require("../services/fileUploadService");
const Report = require("../models/Report");

// Initialize Gemini client
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const summarizeFile = async (req, res) => {
  try {
    // ✅ Validate API key first
    if (!process.env.GOOGLE_API_KEY) {
      console.error("GOOGLE_API_KEY is not set");
      return res.status(500).json({
        error: "AI service configuration error. Please contact support.",
      });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded." });
    }


    let userId = null;
    if (req.user && req.user._id) {
      userId = req.user._id.toString();
      console.log("✅ User authenticated:", userId);
    } else {
      console.log("⚠️ No user authenticated - guest mode");
    }
    
    const shouldSaveReport = !!userId;

    console.log("User ID from request:", userId);
    console.log("Should save report:", shouldSaveReport);
    console.log("Request headers authorization:", req.headers.authorization ? "Present" : "Missing");

    const fileBuffer = req.file.buffer;
    const fileType = req.file.mimetype;
    const fileName = req.file.originalname;
    const fileSize = req.file.size;
    const userPrompt = req.body?.prompt?.trim() || "Please analyze this medical report";
    const userVitals = req.body?.vitals ? JSON.parse(req.body.vitals) : null;
    const reportContext = req.body?.reportContext || null;

    console.log("Processing file:", fileName);
    console.log("File type:", fileType);
    console.log("File size:", fileSize, "bytes");

    //: Upload file to Cloudinary 
    let uploadResult = null;
    if (shouldSaveReport) {
      console.log("📤 Uploading file to Cloudinary...");
      try {
        uploadResult = await fileUploadService.uploadToCloudinary(fileBuffer, {
          folder: "medical-reports",
          filename: fileName.replace(/\.[^/.]+$/, ""), 
          userId: userId,
          tags: ["medical", "report"],
        });
      } catch (uploadError) {
        console.error("❌ Cloudinary upload failed:", uploadError);
        return res.status(500).json({
          error: "Failed to upload file to cloud storage",
          details: uploadError.message,
        });
      }
    } else {
      console.log("⚠️ Guest mode: File will not be saved to cloud storage");
    }

    // Extract text from file
    console.log("📄 Extracting text from file...");
    let extractedText;
    try {
      extractedText = await fileService.extractTextFromFile(fileBuffer, fileType);
      
      if (!extractedText || extractedText.trim().length === 0) {
        if (uploadResult) {
          await fileUploadService.deleteFromCloudinary(uploadResult.publicId);
        }
        return res.status(400).json({
          error: "Could not extract text from file. The file might be empty or corrupted.",
        });
      }

      console.log("✅ Extracted text length:", extractedText.length);
    } catch (extractError) {
  
      if (uploadResult) {
        await fileUploadService.deleteFromCloudinary(uploadResult.publicId);
      }
      return res.status(400).json({
        error: "Failed to process file",
        details: extractError.message,
      });
    }

    // Limit text length
    const maxLength = 30000;
    if (extractedText.length > maxLength) {
      console.log("Text truncated from", extractedText.length, "to", maxLength);
      extractedText = extractedText.substring(0, maxLength) + "\n\n[Text truncated due to length...]";
    }

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
${extractedText}

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

**NOW GENERATE THE COMPLETE HTML USING THIS STRUCTURE WITH ACTUAL MEDICAL DATA.**
`;

    console.log("🤖 Sending to Gemini for summarization...");
    let aiSummary;
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      if (!response || !response.text) {
        throw new Error("No response received from AI service");
      }

      aiSummary = response.text;
      console.log("✅ AI summarization successful");
    } catch (aiError) {
  
      if (uploadResult) {
        await fileUploadService.deleteFromCloudinary(uploadResult.publicId);
      }
      
      if (aiError.message.includes("quota") || aiError.message.includes("rate limit")) {
        return res.status(429).json({
          error: "AI service temporarily unavailable",
          details: "Please try again in a few moments",
        });
      }
      
      return res.status(500).json({
        error: "AI analysis failed",
        details: process.env.NODE_ENV === "production" 
          ? "An error occurred while processing your request" 
          : aiError.message,
      });
    }

    //  Save report metadata to MongoDB
    if (shouldSaveReport && uploadResult) {
      console.log("💾 Saving report to database...");
      try {
        const newReport = new Report({
          userId: userId,
          fileName: fileName,
          fileUrl: uploadResult.url,
          cloudinaryPublicId: uploadResult.publicId,
          fileType: fileType,
          fileSize: fileSize,
          aiSummary: aiSummary,
          extractedText: extractedText.substring(0, 5000), 
          reportType: "general", 
          tags: ["medical", "report"],
        });

        await newReport.save();
        console.log("✅ Report saved to database:", newReport._id);

      
        return res.json({
          success: true,
          summary: aiSummary,
          reportId: newReport._id,
          fileUrl: uploadResult.url,
          message: "Report uploaded and analyzed successfully",
        });
      } catch (dbError) {
        console.error("❌ Database save error:", dbError);
        return res.json({
          success: true,
          summary: aiSummary,
          fileUrl: uploadResult.url,
          warning: "Report analyzed but database save failed",
        });
      }
    } else {
      // Guest user only the summary
      console.log("⚠️ Guest mode: Report not saved to database");
      return res.json({
        success: true,
        summary: aiSummary,
        message: "Report analyzed successfully (not saved - please login to save reports)",
        isGuestMode: true,
      });
    }
  } catch (error) {
    console.error("❌ Unexpected error:", error);
    res.status(500).json({
      error: "An unexpected error occurred",
      details: process.env.NODE_ENV === "production"
        ? "Please try again later"
        : error.message,
    });
  }
};

module.exports = summarizeFile;