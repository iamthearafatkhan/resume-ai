// src/pages/Home.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Logo from "../components/Logo";
import { ArrowRight, CheckCircle, Target, Zap } from "lucide-react";

export default function Home() {
    return (
        <div className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-10 w-96 h-96 bg-brand-purple/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-brand-orange/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-center z-10">

                {/* Left Side: Text */}
                <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-pink/10 border border-brand-pink/30 text-brand-pink text-sm font-medium mb-6">
                        <Zap size={16} /> Powered by Real NLP & Deterministic AI
                    </div>


                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight">
                        Beat the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-orange">ATS.</span><br />
                        Land the Interview.
                    </h1>
                    <p className="text-lg text-white/60 mb-8 max-w-md leading-relaxed">
                        Welcome to <span className="text-white font-semibold">CVelora</span>. Upload your resume to get a real, explainable ATS score. Paste a job description to uncover exact skill gaps and get actionable AI recommendations.
                    </p>

                    <Link to="/analyze">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: "0px 0px 20px rgba(222, 26, 88, 0.4)" }}
                            whileTap={{ scale: 0.95 }}
                            className="px-8 py-4 bg-gradient-to-r from-brand-purple to-brand-pink rounded-xl text-lg font-bold flex items-center gap-2 transition-all"
                        >
                            Analyze My Resume <ArrowRight size={20} />
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Right Side: Interactive Cards */}
                <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-orange to-brand-pink opacity-20 blur-2xl rounded-3xl transform rotate-3 scale-105" />

                    <div className="relative bg-[#0a0a1a]/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-brand-orange/20 flex items-center justify-center"><CheckCircle className="text-brand-orange" /></div>
                            <div>
                                <h3 className="font-bold">ATS Formatting Score</h3>
                                <p className="text-sm text-white/50">Check sections, length, and contact info.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-brand-pink/20 flex items-center justify-center"><Target className="text-brand-pink" /></div>
                            <div>
                                <h3 className="font-bold">Semantic Job Matching</h3>
                                <p className="text-sm text-white/50">Compare your resume to any JD using embeddings.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-brand-purple/30 flex items-center justify-center"><ArrowRight className="text-brand-purple" /></div>
                            <div>
                                <h3 className="font-bold">AI Skill Gap Analysis</h3>
                                <p className="text-sm text-white/50">See exactly what to learn next to get hired.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}