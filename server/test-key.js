import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log("Checking API Key: ", apiKey ? "Present (starts with " + apiKey.substring(0, 4) + ")" : "MISSING");

async function test() {
    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.0-pro-latest"];

    console.log("Starting Model Check...");

    for (const modelName of modelsToTry) {
        process.stdout.write(`Testing ${modelName}... `);
        try {
            const m = genAI.getGenerativeModel({ model: modelName });
            const result = await m.generateContent("Hi");
            console.log(`✅ SUCCESS!`);
            // console.log("Response:", result.response.text());
            return; // Exit on first success
        } catch (e) {
            console.log(`❌ FAILED`);
            if (e.message && e.message.includes("404")) {
                console.log("   -> Error 404: Model not found or API not enabled for this project.");
            } else {
                console.log(`   -> Error: ${e.message}`);
            }
        }
    }
    console.log("\n❌ All models failed. Please check your API Key permissions.");
}

test();
