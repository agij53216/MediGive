/* Vercel Serverless Function: /api/scan */
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req, res) {
    // Enable CORS for allowed origins
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("Missing GEMINI_API_KEY in environment variables");
        }

        const { imageBase64, mimeType } = req.body;
        if (!imageBase64) {
            throw new Error("No image data provided");
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        const imagePart = {
            inlineData: {
                data: imageBase64,
                mimeType: mimeType || "image/jpeg",
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

        const result = await model.generateContent([prompt, imagePart]);
        const responseText = result.response.text();
        const cleanText = responseText.replace(/```json|```/g, '').trim();
        const jsonResponse = JSON.parse(cleanText);

        res.status(200).json(jsonResponse);

    } catch (error) {
        console.error("Vercel Function Error:", error);
        res.status(500).json({
            error: error.message,
            details: "Check Vercel Logs for more info"
        });
    }
}
