// src/components/ATSScoreCard.jsx
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

export default function ATSScoreCard({ data }) {
    const score = data?.overall_score ?? 0;
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/20 blur-3xl rounded-full" />

            <h2 className="text-xl font-semibold mb-6 tracking-wide text-white/90">ATS Parseability</h2>

            <div className="flex items-center gap-8">
                {/* Circular Progress */}
                <div className="relative flex items-center justify-center w-32 h-32 shrink-0">
                    <svg className="transform -rotate-90 w-32 h-32">
                        <circle cx="64" cy="64" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                        <motion.circle
                            cx="64" cy="64" r={radius}
                            stroke="url(#gradient)" strokeWidth="8" fill="none"
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#DE1A58" />
                                <stop offset="100%" stopColor="#F67D31" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                        <span className="text-3xl font-bold text-white">{score}</span>
                        <span className="text-xs text-white/50">/100</span>
                    </div>
                </div>

                {/* Missing Sections */}
                <div className="flex-1">
                    {data?.missing_sections?.length > 0 ? (
                        <>
                            <p className="text-sm text-brand-orange font-medium mb-2">Missing Sections:</p>
                            <div className="flex flex-wrap gap-2">
                                {data.missing_sections.map((s, i) => (
                                    <motion.span
                                        key={s}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + i * 0.1 }}
                                        className="px-3 py-1 bg-brand-orange/10 border border-brand-orange/30 text-brand-orange rounded-full text-xs"
                                    >
                                        {s}
                                    </motion.span>
                                ))}
                            </div>
                        </>
                    ) : (
                        <p className="text-green-400 text-sm">All key sections detected!</p>
                    )}
                </div>
            </div>

            {/* Recommended Jobs Section (The Box you were missing) */}
            {data?.recommended_jobs && data.recommended_jobs.length > 0 && (
                <div className="mt-6 pt-6 border-t border-white/10">
                    <h3 className="text-sm font-semibold text-brand-pink mb-3 flex items-center gap-2">
                        <Briefcase size={16} /> Recommended Roles for You
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {data.recommended_jobs.map((job, i) => (
                            <span key={i} className="px-3 py-1.5 bg-brand-purple/20 border border-brand-purple/40 rounded-lg text-sm text-white">
                                {job}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            <p className="text-xs text-white/40 mt-6">{data?.explanation}</p>
        </motion.div>
    );
}