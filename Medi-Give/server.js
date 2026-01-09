import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import scanHandler from './api/scan.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Mock Vercel request/response objects for the handler
app.post('/api/scan', async (req, res) => {
    console.log("Received scan request");
    try {
        await scanHandler(req, res);
        console.log("Scan processed successfully");
    } catch (err) {
        console.error("Error processing scan in server.js:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
