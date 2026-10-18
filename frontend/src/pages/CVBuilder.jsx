// src/pages/CVBuilder.jsx
import { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { Download, ArrowLeft, Sparkles, Loader2, Save, Wand2 } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { generateBullets } from "../api/client";

export default function CVBuilder() {
    const [template, setTemplate] = useState("ats");
    const [fontSize, setFontSize] = useState("11pt");
    const [isDownloading, setIsDownloading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [bulletsModal, setBulletsModal] = useState(null); // Holds generated bullets

    const [cvData, setCvData] = useState(() => {
        const saved = localStorage.getItem("resumeBuilderData");
        if (saved) return JSON.parse(saved);
        return {
            name: "John Doe", title: "Data Analyst", email: "john@example.com", phone: "+1 234 567 8900", location: "New York, USA", linkedin: "linkedin.com/in/johndoe",
            summary: "Highly motivated Data Analyst with experience in SQL, Python, and dashboarding.",
            experience: "Data Analyst at Tech Corp (2021 - Present)\n- Developed Power BI dashboards that reduced reporting time by 40%.",
            education: "B.Sc. in Computer Science\nUniversity of Technology (2017 - 2021)",
            skills: "SQL, Python, Power BI, Excel, Tableau, Data Governance, Agile"
        };
    });

    const componentRef = useRef();

    useEffect(() => {
        localStorage.setItem("resumeBuilderData", JSON.stringify(cvData));
    }, [cvData]);

    const reactToPrintFn = useReactToPrint({
        contentRef: componentRef,
        documentTitle: `${cvData.name.replace(/\s+/g, '_')}_CV`,
    });

    const handleDownload = () => {
        setIsDownloading(true);
        setTimeout(() => {
            reactToPrintFn();
            setIsDownloading(false);
        }, 1500);
    };

    const handleGenerateAI = async () => {
        if (!cvData.title) return alert("Please enter a Job Title first!");
        setIsGenerating(true);
        try {
            const data = await generateBullets(cvData.title);
            setBulletsModal(data.bullets);
        } catch (err) {
            alert("Failed to generate. Check backend.");
        } finally {
            setIsGenerating(false);
        }
    };

    const insertBullets = () => {
        if (!bulletsModal) return;
        const bulletText = bulletsModal.map(b => `- ${b}`).join("\n");
        setCvData(prev => ({
            ...prev,
            experience: prev.experience + "\n" + bulletText
        }));
        setBulletsModal(null);
    };

    const handleChange = (e) => {
        setCvData({ ...cvData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 max-w-7xl mx-auto flex flex-col lg:flex-row gap-6">

            {/* AI Modal */}
            <AnimatePresence>
                {bulletsModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
                        <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-[#1a1a2e] border border-brand-pink/30 p-6 rounded-2xl max-w-lg w-full shadow-2xl">
                            <h3 className="text-xl font-bold text-brand-pink flex items-center gap-2 mb-4"><Wand2 size={20} /> AI Generated Bullets</h3>
                            <ul className="space-y-3 mb-6 text-sm text-white/80">
                                {bulletsModal.map((b, i) => <li key={i} className="bg-black/30 p-3 rounded-lg border border-white/10">• {b}</li>)}
                            </ul>
                            <div className="flex gap-3">
                                <button onClick={() => setBulletsModal(null)} className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition font-medium">Cancel</button>
                                <button onClick={insertBullets} className="flex-1 py-2 rounded-xl bg-brand-pink hover:bg-brand-purple transition font-bold text-white">Insert to CV</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* LEFT SIDE: Controls */}
            <div className="w-full lg:w-[40%] space-y-4 bg-white/5 border border-white/10 p-6 rounded-2xl h-[85vh] overflow-y-auto no-print">
                <div className="flex items-center justify-between mb-2">
                    <Link to="/" className="text-white/50 hover:text-white flex items-center gap-1 text-sm"><ArrowLeft size={16} /> Back</Link>
                    <h1 className="text-xl font-bold text-brand-pink flex items-center gap-2"><Sparkles size={18} /> CV Editor</h1>
                </div>

                <div className="flex gap-2">
                    <div className="flex-1 bg-black/30 p-3 rounded-xl border border-white/10">
                        <label className="block text-xs font-medium text-white/70 mb-2">Template</label>
                        <div className="flex flex-col gap-1">
                            {["ats", "europass", "modern"].map((t) => (
                                <button key={t} onClick={() => setTemplate(t)} className={`py-1.5 px-2 text-left text-xs rounded transition ${template === t ? "bg-brand-pink text-white font-bold" : "bg-white/5 text-white/70"}`}>
                                    {t === "ats" ? "ATS Standard" : t === "europass" ? "Europass" : "Modern"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-2">
                        <div className="bg-black/30 p-3 rounded-xl border border-white/10">
                            <label className="block text-xs font-medium text-white/70 mb-2">Font Size</label>
                            <select value={fontSize} onChange={(e) => setFontSize(e.target.value)} className="w-full bg-transparent text-sm text-white outline-none">
                                <option value="10pt">10pt (Compact)</option>
                                <option value="11pt">11pt (Standard)</option>
                                <option value="12pt">12pt (Large)</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    {Object.keys(cvData).map((key) => (
                        <div key={key}>
                            <div className="flex justify-between items-center mb-1">
                                <label className="block text-xs font-medium text-white/70 capitalize">{key}</label>
                                {key === "experience" && (
                                    <button onClick={handleGenerateAI} disabled={isGenerating} className="text-xs flex items-center gap-1 text-brand-orange hover:text-brand-pink transition">
                                        {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                                        {isGenerating ? "Generating..." : "AI Suggest"}
                                    </button>
                                )}
                            </div>
                            {["summary", "experience", "education"].includes(key) ? (
                                <textarea name={key} value={cvData[key]} onChange={handleChange} rows={4} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-brand-pink outline-none resize-none" />
                            ) : (
                                <input type="text" name={key} value={cvData[key]} onChange={handleChange} className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-brand-pink outline-none" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* RIGHT SIDE: Preview */}
            <div className="w-full lg:w-[60%] flex flex-col gap-4">
                <motion.button
                    whileHover={!isDownloading ? { scale: 1.02, boxShadow: "0px 0px 20px rgba(222, 26, 88, 0.4)" } : {}}
                    whileTap={!isDownloading ? { scale: 0.98 } : {}}
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className={`w-full py-4 rounded-xl font-bold flex justify-center items-center gap-2 transition-all relative overflow-hidden no-print ${isDownloading ? "bg-brand-purple/50 cursor-wait" : "bg-gradient-to-r from-brand-pink to-brand-orange"
                        }`}
                >
                    {isDownloading ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                            <Loader2 className="animate-spin" size={20} /> Generating ATS-Friendly PDF...
                        </motion.div>
                    ) : (
                        <motion.div className="flex items-center gap-2">
                            <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
                                <Download size={20} />
                            </motion.div>
                            Download CV as PDF
                        </motion.div>
                    )}
                </motion.button>

                <div className="bg-gray-300 rounded-xl p-6 flex justify-center overflow-auto h-[80vh] no-print">
                    <div
                        ref={componentRef}
                        className="bg-white text-black shadow-2xl print-area"
                        style={{
                            width: "210mm", minHeight: "296mm", padding: template === "ats" ? "15mm" : "12mm",
                            fontFamily: template === "ats" ? "'Times New Roman', serif" : template === "europass" ? "Arial, sans-serif" : "Calibri, sans-serif",
                            fontSize: fontSize, lineHeight: "1.4", boxSizing: "border-box"
                        }}
                    >
                        {/* Templates remain the same */}
                        {template === "ats" && (
                            <div>
                                <div className="text-center mb-6">
                                    <h1 className="text-3xl font-bold uppercase tracking-wide">{cvData.name}</h1>
                                    <p className="text-lg font-medium">{cvData.title}</p>
                                    <p className="text-sm mt-1">{cvData.location} | {cvData.phone} | {cvData.email} | {cvData.linkedin}</p>
                                </div>
                                <div className="border-t-2 border-black mb-4" />
                                <h2 className="font-bold uppercase text-lg mb-1">Professional Summary</h2>
                                <p className="mb-4 whitespace-pre-wrap">{cvData.summary}</p>
                                <h2 className="font-bold uppercase text-lg mb-1">Experience</h2>
                                <p className="mb-4 whitespace-pre-wrap">{cvData.experience}</p>
                                <h2 className="font-bold uppercase text-lg mb-1">Education</h2>
                                <p className="mb-4 whitespace-pre-wrap">{cvData.education}</p>
                                <h2 className="font-bold uppercase text-lg mb-1">Skills</h2>
                                <p className="whitespace-pre-wrap">{cvData.skills}</p>
                            </div>
                        )}

                        {template === "europass" && (
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h1 className="text-2xl font-bold text-blue-900 uppercase">{cvData.name}</h1>
                                        <p className="text-md font-medium">{cvData.title}</p>
                                    </div>
                                    <div className="text-right text-sm">
                                        <p>{cvData.location}</p><p>{cvData.phone}</p><p>{cvData.email}</p><p>{cvData.linkedin}</p>
                                    </div>
                                </div>
                                <div className="bg-blue-100 p-2 font-bold text-blue-900 mb-2 uppercase">Personal Statement</div>
                                <p className="mb-4 whitespace-pre-wrap">{cvData.summary}</p>
                                <div className="bg-blue-100 p-2 font-bold text-blue-900 mb-2 uppercase">Work Experience</div>
                                <p className="mb-4 whitespace-pre-wrap">{cvData.experience}</p>
                                <div className="bg-blue-100 p-2 font-bold text-blue-900 mb-2 uppercase">Education and Training</div>
                                <p className="mb-4 whitespace-pre-wrap">{cvData.education}</p>
                                <div className="bg-blue-100 p-2 font-bold text-blue-900 mb-2 uppercase">Skills</div>
                                <p className="whitespace-pre-wrap">{cvData.skills}</p>
                            </div>
                        )}

                        {template === "modern" && (
                            <div>
                                <div className="mb-6">
                                    <h1 className="text-4xl font-extrabold text-gray-800">{cvData.name}</h1>
                                    <p className="text-xl text-gray-500 mt-1">{cvData.title}</p>
                                    <div className="flex gap-4 mt-2 text-sm text-gray-600">
                                        <span>{cvData.email}</span><span>•</span><span>{cvData.phone}</span><span>•</span><span>{cvData.location}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="col-span-1 text-sm text-gray-700">
                                        <h2 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-2">Details</h2>
                                        <p className="mb-4">{cvData.linkedin}</p>
                                        <h2 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-2">Skills</h2>
                                        <p className="whitespace-pre-wrap">{cvData.skills}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <h2 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-2">Profile</h2>
                                        <p className="mb-6 whitespace-pre-wrap">{cvData.summary}</p>
                                        <h2 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-2">Experience</h2>
                                        <p className="mb-6 whitespace-pre-wrap">{cvData.experience}</p>
                                        <h2 className="font-bold text-gray-900 uppercase tracking-widest text-xs mb-2">Education</h2>
                                        <p className="whitespace-pre-wrap">{cvData.education}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}