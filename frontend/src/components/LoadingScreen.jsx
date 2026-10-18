// src/components/LoadingScreen.jsx
import { motion } from "framer-motion";
import Logo from "./Logo";

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
                <Logo size={100} />

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="mt-6 text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-orange"
                >
                    CVELORA
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="mt-4 flex flex-col items-center gap-1 text-sm text-brand-pink font-mono"
                >
                    <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        Initializing AI Engine...
                    </motion.p>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}