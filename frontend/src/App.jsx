// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingScreen from "./components/LoadingScreen";
import Home from "./pages/Home";
import Analyze from "./pages/Analyze";
import CVBuilder from "./pages/CVBuilder";

export default function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Router>
            <AnimatePresence>
                {loading && <LoadingScreen key="loader" />}
            </AnimatePresence>

            {!loading && (
                <div className="bg-[#0a0a1a] min-h-screen flex flex-col text-white selection:bg-brand-pink selection:text-white">
                    <Navbar />

                    {/* Main content expands to push footer down */}
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/analyze" element={<Analyze />} />
                            <Route path="/builder" element={<CVBuilder />} />
                        </Routes>
                    </main>

                    <Footer />
                </div>
            )}
        </Router>
    );
}