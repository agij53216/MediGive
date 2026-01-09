/* filename: server/geminiService.js */
import { GoogleGenerativeAI } from "@google/generative-ai";

// ❌ REMOVED: Top-level initialization that causes the crash
// const genAI = ... (Don't do this here)

export async function scanMedicineFromBuffer(buffer, mimeType) {
  // ✅ FIX: Initialize INSIDE the function. 
  // This runs ONLY when the frontend actually requests a scan,
  // guaranteeing that .env is loaded.
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("❌ Server Error: GEMINI_API_KEY is missing in .env file");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  // Use gemini-flash-latest (stable alias) to avoid quota issues with specific versions
  const model = genAI.getGenerativeModel({
    model: "gemini-flash-latest"
  });

  try {
    const imagePart = {
      inlineData: {
        data: buffer.toString("base64"),
        mimeType: mimeType,
      },
    };

    const prompt = `
      Analyze this medicine image. Return ONLY valid JSON (no markdown):
      {
        "medicine_name": "Name",
        "expiry_date": "DD/MM/YYYY",
        "manufacturer": "Company",
        "medicine_type": "Antibiotic | Painkiller | Supplement | Chronic | Other",
        "usage": "Brief usage (2-3 words)",
        "confidence_score": 0-100 (integer),
        "urgency": "High (expiring < 3 months) | Medium | Low"
      }
    `;

    console.time("Gemini Response Time"); // Start timer
    const result = await model.generateContent([prompt, imagePart]);
    console.timeEnd("Gemini Response Time"); // End timer

    const responseText = result.response.text();

    // Clean up potential markdown formatting (```json ... ```)
    const cleanText = responseText.replace(/```json|```/g, '').trim();

    return JSON.parse(cleanText);

  } catch (error) {
    console.error("Gemini Service Error:", error);

    if (error.message.includes("404")) {
      throw new Error("Gemini API Error: Model not found (404). Please ensure 'Generative Language API' is ENABLED in Google Cloud and you are using a supported model.");
    } else if (error.message.includes("403")) {
      throw new Error("Gemini API Error: Forbidden (403). Check your API Key permissions/quota.");
    } else if (error.message.includes("503") || error.message.includes("Overloaded")) {
      throw new Error("Gemini API is currently overloaded (503). Please wait a few seconds and try again.");
    } else if (error.message.includes("429")) {
      throw new Error("Gemini API Error: Rate Limit Exceeded (429). You are sending too many requests or have no quota.");
    }

    throw new Error(`Gemini Scan Failed: ${error.message}`);
  }
}