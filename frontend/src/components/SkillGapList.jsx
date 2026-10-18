// src/components/SkillGapList.jsx
import { motion } from "framer-motion";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } };

export default function SkillGapList({ matched = [], missing = [] }) {
    return (
        <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-2 gap-4">
            <motion.div variants={item} className="bg-green-500/10 border border-green-400/30 rounded-xl p-4">
                <h3 className="text-green-300 font-semibold mb-2">Matched ({matched.length})</h3>
                <div className="flex flex-wrap gap-2">
                    {matched.map((s) => (
                        <motion.span key={s} variants={item} className="px-2 py-1 bg-green-400/20 rounded-full text-sm">
                            {s}
                        </motion.span>
                    ))}
                </div>
            </motion.div>

            <motion.div variants={item} className="bg-brand-orange/10 border border-brand-orange/30 rounded-xl p-4">
                <h3 className="text-brand-orange font-semibold mb-2">Missing ({missing.length})</h3>
                <div className="flex flex-wrap gap-2">
                    {missing.map((s) => (
                        <motion.span key={s} variants={item} className="px-2 py-1 bg-brand-orange/20 rounded-full text-sm">
                            {s}
                        </motion.span>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}