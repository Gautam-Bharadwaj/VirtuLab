import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, FlaskConical, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LandingNavbar: React.FC = () => {
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen((prev) => !prev);
            }
            if (e.key === 'Escape') {
                setIsSearchOpen(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <>
            <nav className="fixed w-full z-[100] px-6 md:px-12 py-4 flex items-center justify-between glass-navbar">
                <a
                    href="/"
                    className="flex items-center gap-1 cursor-pointer transition-transform hover:scale-105"
                >
                    <span className="text-2xl font-black tracking-tighter text-white">
                        VirtuLab<span className="text-orange-500">.ai</span>
                    </span>
                </a>

                <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-white/70 absolute left-1/2 -translate-x-1/2">
                    <a href="/" className="hover:text-orange-500 transition-colors">Home</a>
                    <a href="#explore-labs" className="hover:text-orange-500 transition-colors">Explore Labs</a>
                    <a href="#simulations" className="hover:text-orange-500 transition-colors">Simulations</a>
                    <a href="#resources" className="hover:text-orange-500 transition-colors">Resources</a>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/50 text-sm group"
                        title="Search Experiments"
                    >
                        <Search size={16} className="group-hover:text-white transition-colors" />
                        <span className="group-hover:text-white transition-colors">Search...</span>
                        <kbd className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-white/70 ml-2">
                            <span>⌘</span>K
                        </kbd>
                    </button>

                    <div className="flex items-center gap-3 border-l border-white/10 pl-5 ml-2">
                        <button
                            onClick={() => navigate('/')}
                            className="px-6 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-all text-sm font-medium text-white hidden sm:block"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => navigate('/lab')}
                            className="px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 transition-all text-sm font-black text-black shadow-lg shadow-orange-500/20"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4 sm:px-0"
                    >
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                            onClick={() => setIsSearchOpen(false)}
                        ></div>

                        <motion.div
                            initial={{ scale: 0.95, y: -20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, y: -20, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-2xl bg-[#131313] border border-white/10 shadow-2xl rounded-2xl overflow-hidden glass-panel"
                        >
                            <div className="flex items-center px-4 py-4 border-b border-white/10">
                                <Search className="text-orange-500" size={24} />
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Search for experiments, labs, or topics..."
                                    className="flex-1 bg-transparent border-none outline-none text-white px-4 text-lg placeholder-white/40 font-medium"
                                />
                                <button
                                    onClick={() => setIsSearchOpen(false)}
                                    className="p-1.5 rounded-lg bg-white/5 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-4 max-h-[60vh] overflow-y-auto">
                                <div className="mb-6">
                                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3 px-2">Popular Simulations</h3>
                                    <div className="flex flex-col gap-1">
                                        {[
                                            { icon: <Zap size={16} className="text-amber-400" />, title: "Circuit Builder", desc: "Physics Lab • Build complete electrical circuits" },
                                            { icon: <FlaskConical size={16} className="text-orange-500" />, title: "Acid-Base Titration", desc: "Chemistry Lab • Experiment with indicators" },
                                            { icon: <BookOpen size={16} className="text-blue-500" />, title: "Pendulum Motion", desc: "Physics Theory • Understand harmonic motion" },
                                        ].map((item, i) => (
                                            <button key={i} className="flex items-center gap-4 w-full text-left p-3 rounded-xl hover:bg-white/5 transition-colors group">
                                                <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-white/10 transition-colors">
                                                    {item.icon}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">{item.title}</h4>
                                                    <p className="text-xs text-white/50">{item.desc}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-black/40 border-t border-white/10 p-3 px-6 flex items-center justify-between">
                                <span className="text-xs text-white/40 font-medium flex items-center gap-2">
                                    <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/10 text-white/70">↑</kbd>
                                    <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/10 text-white/70">↓</kbd>
                                    to navigate
                                </span>
                                <span className="text-xs text-white/40 font-medium flex items-center gap-2">
                                    <kbd className="px-2 py-0.5 rounded bg-white/10 border border-white/10 text-white/70">ESC</kbd>
                                    to close
                                </span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
