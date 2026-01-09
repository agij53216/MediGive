
// Native Node.js 18+ fetch and FormData
import { Blob } from 'buffer';

async function testBackend() {
    try {
        const form = new FormData();
        const blob = new Blob(['fakeimagecontent'], { type: 'image/jpeg' });
        form.append("image", blob, "test.jpg");

        console.log("Sending request to http://localhost:3000/scan...");
        const response = await fetch("http://localhost:3000/scan", {
            method: "POST",
            body: form
        });

        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Body:", text);

    } catch (err) {
        console.error("Request Failed:", err.message);
    }
}

testBackend();
