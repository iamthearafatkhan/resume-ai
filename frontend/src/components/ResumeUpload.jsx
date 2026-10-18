// src/components/ResumeUpload.jsx
import { useState } from "react";
import { motion } from "framer-motion";

export default function ResumeUpload({ onUpload }) {
    const [dragging, setDragging] = useState(false);
    const [fileName, setFileName] = useState("");

    const handleFile = (file) => {
        if (file) {
            setFileName(file.name);
            onUpload(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
    };

    return (
        <motion.label
            htmlFor="resume-input"
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            animate={dragging ? { scale: 1.02, borderColor: "#F67D31" } : { scale: 1 }}
            className={`block cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-colors duration-300
                  ${dragging ? "border-brand-orange bg-brand-orange/10" : "border-brand-pink/40 bg-white/5"}`}
        >
            <input
                id="resume-input"
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
            />
            <motion.div animate={{ y: dragging ? -4 : 0 }} className="text-5xl mb-4">
                📄
            </motion.div>
            <p className="text-lg font-medium">
                {fileName ? `Selected: ${fileName}` : dragging ? "Drop your resume here" : "Drag & drop your resume, or click to browse"}
            </p>
            <p className="text-sm text-white/50 mt-2">PDF or DOCX · max 20 MB</p>
        </motion.label>
    );
}