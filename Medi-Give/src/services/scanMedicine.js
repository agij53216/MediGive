// Helper to convert file to Base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove "data:image/jpeg;base64," prefix
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
};

export async function scanMedicine(imageFile) {
  try {
    const base64Data = await fileToBase64(imageFile);

    // Use environment variable if available (Production), otherwise fallback to relative path (Local via Proxy)
    const apiUrl = import.meta.env.VITE_API_URL 
      ? `${import.meta.env.VITE_API_URL}/api/scan` 
      : "/api/scan";

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageBase64: base64Data,
        mimeType: imageFile.type
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
    throw error;
  }
}
