// src/components/Logo.jsx
import { motion } from "framer-motion";

export default function Logo({ size = 60, animate = false }) {
    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={animate ? { rotate: [0, 5, -5, 0] } : {}}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
            <defs>
                <linearGradient id="cveloraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#DE1A58" />
                    <stop offset="100%" stopColor="#F67D31" />
                </linearGradient>
            </defs>

            {/* Outer modern 'C' shape */}
            <path
                d="M 75 25 A 35 35 0 1 0 75 75"
                stroke="url(#cveloraGrad)"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
            />

            {/* Document Lines inside */}
            <rect x="30" y="32" width="28" height="6" rx="3" fill="#1A05A2" />
            <rect x="30" y="47" width="35" height="6" rx="3" fill="#8F0177" />
            <rect x="30" y="62" width="20" height="6" rx="3" fill="#1A05A2" />
        </motion.svg>
    );
}