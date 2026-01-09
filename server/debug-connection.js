import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

console.log("----------------------------------------");
console.log("Diagnosis Script Started");
console.log("----------------------------------------");

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("❌ NO API KEY FOUND in .env");
    process.exit(1);
}
console.log(`API Key: ${apiKey.substring(0, 8)}... (Length: ${apiKey.length})`);

async function run() {
    const genAI = new GoogleGenerativeAI(apiKey);

    // Test 1: List Models (This checks basic connectivity and permissions)
    console.log("\nAttempting to list available models...");
    try {
        // Unfortunately, the Node SDK doesn't expose listModels directly easily in all versions, 
        // so we'll try to just infer it by the error of a request.
        // Actually, let's try a text-only request first.
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Test");
        console.log("✅ simple text generation worked!");
    } catch (e) {
        console.log("❌ FAILED");
        console.log("MSG:", e.message.substring(0, 100)); // First 100 chars
        if (e.message.includes("location")) console.log("--> LOCATION_ISSUE");
        if (e.message.includes("404")) console.log("--> NOT_FOUND");
    }
}

run();
