
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
const URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
async function checkModel() {
    console.log(`Checking URL: https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY.substring(0, 5)}...`);
    try {
        const response = await fetch(URL);
        const data = await response.json();

        console.log("Status:", response.status);
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error("Error:", e.message);
    }
}

checkModel();
