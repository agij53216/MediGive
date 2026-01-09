
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

async function listModels() {
    console.log(`Checking API Key ending in ...${API_KEY.slice(-4)}`);
    try {
        const response = await fetch(URL);
        const data = await response.json();

        if (data.models) {
            console.log("✅ Models Available:");
            data.models.forEach(m => console.log(` - ${m.name}`));
        } else {
            console.log("❌ No models found or Error:");
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (e) {
        console.error("Error:", e.message);
    }
}

listModels();
