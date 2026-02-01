# AI Project Generation Prompt: MediGive

**Role**: Expert Full-Stack Web Developer & UX Designer
**Objective**: Build "MediGive," a modern medicine donation platform connecting donors with NGOs to reduce medical waste.

## Tech Stack
*   **Frontend**: React (Vite), TailwindCSS, Framer Motion (animations), React Router DOM v6+, Lucide React (icons).
*   **3D/Visuals**: Three.js combined with `@react-three/fiber` and `@react-three/drei` for interactive 3D elements.
*   **Backend**: Node.js (Express) server.
*   **Database & Auth**: Firebase (Firestore & Authentication).
*   **AI Integration**: Google Gemini API (model: `gemini-1.5-flash`) for image recognition.

## Core Features & Requirements

### 1. Landing Page (High Priority)
*   **Visual Style**: Clean, medical-tech aesthetic using Teal (`#14b8a6`) and Blue (`#2563eb`) gradients against a Slate-50 background.
*   **Hero Section**:
    *   **3D Element**: A floating, rotating 3D capsule/pill rendered with React Three Fiber in the background.
    *   **Content**: High-impact animation (fade-ins) for title ("Reliable on-time medicine aid") and a "Donate Now" CTA.
    *   **Social Proof**: Display "12k+ Donors" with stacked real user photos (from Unsplash).
*   **Sections**:
    *   **Urgent Requirements**: Grid of cards showing real-time medicine needs fetched from Firebase. Use staggered animations for entry.
    *   **Testimonials**: Slide-in cards with professional imagery.
    *   **Footer**: Standard links and branding.

### 2. AI Medicine Scanner (Unique Feature)
*   **Functionality**: Users upload an image of a medicine strip.
*   **Backend Process**:
    *   Send base64 image to Node.js backend (`/api/scan`).
    *   Backend sends prompt to Gemini API: "Analyze this image and return JSON: {name, expiry, type, usage, urgency}".
*   **Frontend**: Auto-fill donation form fields based on the JSON response.

### 3. User Roles & Dashboards
*   **Donor Dashboard**: View past donations, upload new medicines via form + scanner.
*   **NGO Dashboard**:
    *   **Wishlist**: Add requested medicines to the "Urgent Requirements" public list.
    *   **Tracking**: Track incoming shipments.
*   **Authentication**: Secure login/signup via Firebase Auth.

### 4. Technical Constraints
*   **Responsiveness**: Fully mobile-responsive design.
*   **Performance**: Optimize 3D assets to not block the main thread.
*   **Code Structure**: Modular components (`/components`, `/pages`, `/services`, `/hooks`).

## Prompt Instructions
"Create a comprehensive implementation plan and code for 'MediGive' based on the specs above. Start by setting up the React-Vite structure with Tailwind. Then, implement the 3D Hero section first to establish the visual identity. Follow with the Node.js backend setup for the Gemini Scanner."
