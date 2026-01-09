// Helper to resize image before converting to Base64
const resizeImage = (file, maxWidth = 600, quality = 0.5) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Get Base64 string directly (removes the prefix automatically if we split)
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        const base64String = dataUrl.split(',')[1];
        resolve(base64String);
      };
      img.onerror = (error) => reject(error);
    };
    reader.onerror = (error) => reject(error);
  });
};

export async function scanMedicine(imageFile) {
  try {
    // Resize image to max 1024px width/height to ensure fast upload
    const base64Data = await resizeImage(imageFile);

    // Use environment variable, OR fallback to the known Render URL directly
    // This ensures it works on Vercel even if the env var isn't set up perfectly yet.
    const backendUrl = import.meta.env.VITE_API_URL || "https://medigive.onrender.com";
    const apiUrl = `${backendUrl}/api/scan`;

    console.log("🚀 Scanning using API:", apiUrl); // Debug log for user checking console

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: base64Data,
        mimeType: "image/jpeg" // Always sending jpeg from canvas
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Scan failed");
    }

    // Map backend snake_case to frontend camelCase
    const result = {
      medicineName: data.medicine_name || "Unknown Medicine",
      expiryDate: data.expiry_date || "Unknown",
      manufacturer: data.manufacturer,
      usage: data.usage,
      medicineType: data.medicine_type || "General",
      confidence: data.confidence_score || 0,
      urgency: data.urgency || "Low",
      isExpired: false
    };

    // Calculate isExpired
    if (result.expiryDate && result.expiryDate.includes('/')) {
      try {
        const [day, month, year] = result.expiryDate.split('/');
        const expiry = new Date(year, month - 1, day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (expiry < today) {
          result.isExpired = true;
        }
      } catch (e) {
        console.warn("Error parsing date:", e);
      }
    }

    return result;
  } catch (error) {
    console.error("Scan failed:", error);

    // Provide user-friendly error for network/timeout issues (common on free tier)
    if (error.message && error.message.includes("Failed to fetch")) {
      throw new Error("Cannot connect to server. The backend might be waking up (free tier). Please wait 30s and try again.");
    }

    throw error;
  }
}
