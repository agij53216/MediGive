import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
console.log("Checking API Key project association...");

async function run() {
    const genAI = new GoogleGenerativeAI(apiKey);

    // Test the most basic model that should ALWAYS exist
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    try {
        console.log("Sending 'hello' to gemini-pro...");
        const result = await model.generateContent("hello");
        console.log("SUCCESS");
        console.log(result.response.text());
    } catch (e) {
        console.log("FAIL");
        console.log("Message:", e.message);
        console.log("Detailed:", JSON.stringify(e, null, 2));
    }
}

run();
