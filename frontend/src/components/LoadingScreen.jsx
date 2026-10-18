// src/components/LoadingScreen.jsx
import { motion } from "framer-motion";

export default function LoadingScreen() {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a1a]"
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative flex flex-col items-center p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md overflow-hidden"
            >
                {/* Custom Animated SVG Logo */}
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="cveloraGradLoad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#DE1A58" />
                            <stop offset="100%" stopColor="#F67D31" />
                        </linearGradient>
                    </defs>

                    {/* The 'C' Ring drawing itself */}
                    <motion.path
                        d="M 75 25 A 35 35 0 1 0 75 75"
                        stroke="url(#cveloraGradLoad)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        fill="none"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1, ease: "easeInOut" }}
                    />

                    {/* Document lines fading in after the circle completes */}
                    <motion.g
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                    >
                        <rect x="30" y="32" width="28" height="6" rx="3" fill="#1A05A2" />
                        <rect x="30" y="47" width="35" height="6" rx="3" fill="#8F0177" />
                        <rect x="30" y="62" width="20" height="6" rx="3" fill="#1A05A2" />
                    </motion.g>
                </svg>

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="mt-6 text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-orange"
                >
                    CVELORA
                </motion.h1>
            </motion.div>
        </motion.div>
    );
}