// src/components/Navbar.jsx
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import Logo from "./Logo";

export default function Navbar() {
    const location = useLocation();

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 left-0 right-0 z-40 bg-black/30 backdrop-blur-md border-b border-white/10"
        >
            <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <Logo size={35} animate={true} />
                    <span className="text-xl font-bold text-white tracking-widest">RESUME</span>
                </Link>


                <div className="flex gap-6">
                    {["Home", "Analyze", "Builder"].map((item) => {
                        let path = "/";
                        if (item === "Analyze") path = "/analyze";
                        if (item === "Builder") path = "/builder";

                        const isActive = location.pathname === path;
                        return (
                            <Link key={item} to={path} className="relative text-white/80 hover:text-white transition-colors py-2">
                                {item}
                                {isActive && (
                                    <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-orange" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </motion.nav>
    );
}