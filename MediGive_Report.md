# MediGive Project Report

## Project Overview
**MediGive** is a web-based platform designed to facilitate the donation of unused medicines to NGOs and people in need. It leverages AI to simplify the donation process by automatically identifying medicines from images.

## Technology Stack
### Frontend
- **Framework**: React (Vite)
- **Styling**: TailwindCSS, Framer Motion (for animations)
- **Routing**: React Router DOM v7
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore (via `db.js`)
- **Icons**: Lucide React

### Backend (Local Node.js Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **AI Integration**: Google Gemini API (`@google/generative-ai`)
- **File Handling**: Multer (in-memory buffer processing)
- **CORS**: Enabled for local cross-origin requests

## Architecture
The application follows a **Client-Server** architecture:

1.  **Client (Frontend)**:
    - Runs on port `5173`.
    - Handles user interactions (Landing Page, Login, Donation Forms, Dashboards).
    - directly communicates with **Firebase** for Authentication and Database (Read/Write Wishlists, User Profiles).
    - Sends image data to the **Node.js Backend** for AI processing (Scanning).

2.  **Server (Backend)**:
    - Runs on port `3000`.
    - Exposes a `/api/scan` endpoint.
    - Receives base64-encoded images from the frontend.
    - Uses **Google Gemini 1.5 Flash** to extract metadata (Name, Expiry, Usage, etc.) from medicine images.
    - Returns structured JSON data to the frontend.

## Key Features

### 1. AI Medicine Scanner
- **Component**: `Scanner.jsx`
- **Backend Service**: `geminiService.js`
- **Functionality**: Users upload an image of a medicine strip. The system identifies:
    - Medicine Name
    - Expiry Date
    - Manufacturer
    - Type (Antibiotic, Painkiller, etc.)
    - Usage Instructions
    - Urgency Level
- **AI Logic**: Uses a custom prompt with `gemini-flash-latest` to return strict JSON.

### 2. NGO Dashboard
- **Component**: `NGODashboard.jsx`
- **Functionality**:
    - **Wishlist Management**: NGOs can add medicines they urgently need.
    - **Live Updates**: Connects to the `wishlist` collection in Firestore.
    - **Claiming**: Likely allows claiming of donated shipments (based on previous task history).

### 3. Donor Features
- **Donation Form**: `DonationForm.jsx` allows users to list medicines.
- **Scanning Integration**: The form likely integrates the scanner to auto-fill details.

### 4. Real-time Landing Page
- **Component**: `LandingPage.jsx`
- **Functionality**: Displays "Urgent Requirements" fetched directly from the database to encourage targeted donations.

## Current Status
- **Local Development**: Fully functional.
    - Frontend: `http://localhost:5173` looks for backend at `http://localhost:3000`.
    - Backend: Running on `http://localhost:3000` with Gemini API key loaded.
- **Deployment**:
    - Previously deployed to Vercel (Frontend) and Render (Backend).
    - Environment variables are configured for local development (`.env`).
