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
            animate={animate ? { y: [0, -4, 0] } : {}}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
        >
            {/* Document Outline (Brand Pink) */}
            <path
                d="M 20 10 H 80 V 65 L 60 85 H 20 Z"
                stroke="#DE1A58"
                strokeWidth="6"
                fill="none"
                strokeLinejoin="round"
            />

            {/* Folded Corner Triangle (Brand Orange) */}
            <path d="M 80 65 L 60 65 L 60 85 Z" fill="#F67D31" />
            {/* Fold Shadow (Brand Deep Blue for depth) */}
            <path d="M 80 65 L 60 85 L 60 65 Z" fill="#1A05A2" opacity="0.8" />

            {/* Solid Square Top-Left (Brand Orange) */}
            <rect x="30" y="20" width="15" height="15" fill="#F67D31" />

            {/* Top Right Lines (Brand Purple) */}
            <rect x="55" y="20" width="20" height="4" fill="#8F0177" />
            <rect x="55" y="28" width="15" height="4" fill="#8F0177" />

            {/* Body Lines (Brand Pink/Orange gradient feel) */}
            <rect x="30" y="45" width="40" height="4" fill="#DE1A58" />
            <rect x="30" y="55" width="40" height="4" fill="#DE1A58" />
            <rect x="30" y="65" width="25" height="4" fill="#F67D31" />
            <rect x="30" y="75" width="15" height="4" fill="#F67D31" />
        </motion.svg>
    );
}