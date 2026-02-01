# MediGive Deployment Guide

> [!IMPORTANT]
> This guide addresses common deployment issues for **Vercel (Frontend)** and **Render (Backend)**.

## 1. Backend Deployment (Render)
When deploying your Node.js backend to [Render.com](https://render.com):

1.  **Root Directory**: Set this to `server`.
2.  **Build Command**: `npm install`
3.  **Start Command**: `node index.js`
4.  **Environment Variables**:
    *   `GEMINI_API_KEY`: Paste your Google Gemini API Key here.
    *   `PORT`: `3000` (Render will override this, but good to have).

> [!WARNING]
> If you see "Module not found", ensure your Root Directory is correct (`server`, not the project root).

## 2. Frontend Deployment (Vercel)
When deploying your React app to [Vercel](https://vercel.com):

1.  **Root Directory**: Set this to `Medi-Give`.
2.  **Framework Preset**: Select **Vite**.
3.  **Environment Variables**:
    *   `VITE_API_URL`: Set this to your **Render Backend URL** (e.g., `https://medigive-backend.onrender.com`).
    *   **Do not** use `http://localhost:3000` here!

## 3. Common Issues & Fixes

### "404 Not Found" on Page Refresh
*   **Cause**: Single Page Apps (SPA) need special routing rules.
*   **Fix**: I have added a `vercel.json` file to your `Medi-Give` folder. This tells Vercel to redirect all traffic to `index.html`.

### "Network Error" or "CORS Error" during Scan
*   **Cause**: The frontend is trying to talk to the backend, but the backend doesn't recognize the frontend domain.
*   **Fix**: In `server/index.js`, ensure `app.use(cors())` is present (it is).
*   **Fix 2**: Ensure `VITE_API_URL` relies on `https`, not `http`.
