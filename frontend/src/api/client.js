// src/api/client.js
const API_BASE = "http://localhost:8000";

export async function analyzeResume(file) {
    const fd = new FormData();
    fd.append("file", file);

    try {
        const res = await fetch(`${API_BASE}/analyze`, {
            method: "POST",
            body: fd
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.detail || "Server crashed. Check backend terminal.");
        }
        return res.json();
    } catch (err) {
        console.error("Fetch Error:", err);
        throw err; // This will show the real error in the UI
    }
}

export async function matchJob(file, jd) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("job_description", jd);
    fd.append("include_feedback", "false");

    try {
        const res = await fetch(`${API_BASE}/match`, {
            method: "POST",
            body: fd
        });

        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            throw new Error(errorData.detail || "Server crashed. Check backend terminal.");
        }
        return res.json();
    } catch (err) {
        console.error("Fetch Error:", err);
        throw err;
    }
}


export async function generateBullets(jobTitle) {
    const fd = new FormData();
    fd.append("job_title", jobTitle);
    const res = await fetch(`${API_BASE}/generate-bullets`, { method: "POST", body: fd });
    if (!res.ok) throw new Error("Failed to generate bullets");
    return res.json();
}