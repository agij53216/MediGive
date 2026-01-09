import dotenv from "dotenv";
dotenv.config();

console.log("📂 Current Working Directory:", process.cwd());
console.log("🔑 API Key Status:", process.env.GEMINI_API_KEY ? "Loaded ✅" : "Missing ❌");

import express from "express";
import multer from "multer";
import cors from "cors";
import { scanMedicineFromBuffer } from "./geminiService.js";

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Allow large base64 images

app.get("/", (req, res) => {
  res.send("Medi-Give Backend is Running! 🚀");
});

// Legacy Route (Multipart)
app.post("/scan", upload.single("image"), async (req, res) => {
  try {
    const data = await scanMedicineFromBuffer(
      req.file.buffer,
      req.file.mimetype
    );
    res.json(data);
  } catch (err) {
    console.error("❌ Scan Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Vercel-Mirrored Route (JSON/Base64) - For Universal Compatibility
app.post("/api/scan", async (req, res) => {
  try {
    const { imageBase64, mimeType } = req.body;
    if (!imageBase64) throw new Error("No image data");

    const buffer = Buffer.from(imageBase64, 'base64');
    const data = await scanMedicineFromBuffer(buffer, mimeType || 'image/jpeg');
    res.json(data);
  } catch (err) {
    console.error("❌ API Scan Error:", err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Backend running at port ${PORT}`);
});
