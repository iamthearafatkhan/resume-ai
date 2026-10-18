// src/pages/Analyze.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import ResumeUpload from "../components/ResumeUpload";
import ATSScoreCard from "../components/ATSScoreCard";
import SkillGapList from "../components/SkillGapList";
import { analyzeResume, matchJob } from "../api/client";
import { Loader2, Target, AlertTriangle, Sparkles } from "lucide-react";

export default function Analyze() {
    const [file, setFile] = useState(null);
    const [jd, setJd] = useState("");
    const [loading, setLoading] = useState(false);
    const [atsData, setAtsData] = useState(null);
    const [matchData, setMatchData] = useState(null);
    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        if (!file) return setError("Please upload a resume first.");
        setLoading(true);
        setError("");
        try {
            const ats = await analyzeResume(file);
            setAtsData(ats);

            if (jd.trim().length > 20) {
                const match = await matchJob(file, jd);
                setMatchData(match);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
                <h1 className="text-4xl font-extrabold mb-2">Resume Analyzer</h1>
                <p className="text-white/50">Industry-standard ATS scoring. No fake AI numbers.</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Column: Inputs */}
                <div className="space-y-6">
                    <ResumeUpload onUpload={(f) => { setFile(f); setAtsData(null); setMatchData(null); }} />

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg">
                        <label className="block text-sm font-medium text-white/90 mb-2 flex justify-between">
                            <span>Job Description</span>
                            <span className="text-brand-orange text-xs font-normal flex items-center gap-1">
                                <AlertTriangle size={12} /> Tip: Paste only the "Requirements" for best accuracy
                            </span>
                        </label>
                        <textarea
                            value={jd}
                            onChange={(e) => setJd(e.target.value)}
                            placeholder="Paste the job requirements here..."
                            className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-white text-sm focus:ring-2 focus:ring-brand-pink outline-none resize-none transition-all"
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAnalyze}
                        disabled={loading || !file}
                        className="w-full py-4 bg-gradient-to-r from-brand-pink to-brand-orange rounded-xl font-bold text-lg disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-brand-pink/20"
                    >
                        {loading ? <><Loader2 className="animate-spin" /> Analyzing...</> : "Analyze Resume"}
                    </motion.button>
                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                </div>

                {/* Right Column: Results */}
                <div className="space-y-6">
                    {!atsData && !loading && (
                        <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-8 text-center text-white/40">
                            <Target size={48} className="mb-4 opacity-50" />
                            Upload a resume and click analyze to see your scores.
                        </div>
                    )}

                    {atsData && <ATSScoreCard data={atsData} />}

                    {matchData && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                            <div className="bg-gradient-to-br from-brand-deep/30 to-brand-purple/10 border border-brand-purple/40 rounded-3xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                                <div className="absolute -top-10 -right-10 w-32 h-32 bg-brand-pink/30 blur-3xl rounded-full" />
                                <div className="flex items-center justify-between mb-6 relative z-10">
                                    <h2 className="text-xl font-semibold flex items-center gap-2"><Target className="text-brand-pink" /> Job Match Score</h2>
                                    <div className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-orange">
                                        {matchData.overall_match}%
                                    </div>
                                </div>
                                <div className="space-y-4 relative z-10">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1"><span className="text-white/70">Skill Coverage (50% weight)</span><span className="font-mono text-brand-orange">{matchData.skill_coverage}%</span></div>
                                        <div className="h-2 bg-black/50 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${matchData.skill_coverage}%` }} transition={{ duration: 1 }} className="h-full bg-brand-orange rounded-full" /></div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1"><span className="text-white/70">Semantic Relevance (25% weight)</span><span className="font-mono text-brand-pink">{matchData.semantic_similarity}%</span></div>
                                        <div className="h-2 bg-black/50 rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${matchData.semantic_similarity}%` }} transition={{ duration: 1 }} className="h-full bg-brand-pink rounded-full" /></div>
                                    </div>
                                </div>
                            </div>

                            <SkillGapList matched={matchData.matched_skills} missing={matchData.missing_skills} />

                            {matchData.llm_feedback && matchData.llm_feedback.length > 0 && (
                                <div className="bg-brand-purple/10 border border-brand-purple/30 rounded-2xl p-6">
                                    <h3 className="font-semibold text-brand-orange mb-3 flex items-center gap-2"><Sparkles size={18} /> AI Recommendations</h3>
                                    <ul className="space-y-2">
                                        {matchData.llm_feedback.map((fb, i) => (
                                            <li key={i} className="text-sm text-white/80 flex gap-2">
                                                <span className="text-brand-pink">•</span> {fb}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}