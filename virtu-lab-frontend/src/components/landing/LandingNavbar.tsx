import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Simulation, simulations as localSimulations } from '../../data/simulations';

export const LandingNavbar: React.FC = () => {
    const navigate = useNavigate();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [serverSimulations, setServerSimulations] = useState<Simulation[]>(localSimulations);

    useEffect(() => {
        const fetchSimulations = async () => {
            try {
                const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
                const response = await fetch(`${backendUrl}/api/simulations`);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.length > 0) {
                        setServerSimulations(data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch simulations from server:", error);
            }
        };
        fetchSimulations();
    }, []);

    const filteredResults = searchQuery.trim() === ''
        ? serverSimulations.slice(0, 4) // Show first 4 as "Popular" when empty
        : serverSimulations.filter(sim =>
            sim.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sim.subject.toLowerCase().includes(searchQuery.toLowerCase())
        );

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

    const handleResultClick = (labKey: string) => {
        setIsSearchOpen(false);
        setSearchQuery('');
        navigate(`/lab/${labKey}`);
    };

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
                </div>

                <div className="flex items-center gap-4">
                    {/* Mobile Search Icon */}
                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="md:hidden p-2 rounded-full bg-white/5 border border-white/10 text-white/50"
                    >
                        <Search size={18} />
                    </button>

                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/50 text-sm group"
                        title="Search Experiments"
                    >
                        <Search size={16} className="group-hover:text-white transition-colors" />
                        <kbd className="hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-[10px] font-bold text-white/70 ml-1">
                            <span>⌘</span>K
                        </kbd>
                    </button>
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
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
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
                                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-wider mb-3 px-2">
                                        {searchQuery ? 'Search Results' : 'Suggested Simulations'}
                                    </h3>
                                    <div className="flex flex-col gap-1">
                                        {filteredResults.length > 0 ? (
                                            filteredResults.map((sim, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handleResultClick(sim.labKey)}
                                                    className="flex items-center gap-4 w-full text-left p-3 rounded-xl hover:bg-white/5 transition-colors group"
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-white/10 transition-colors">
                                                        <img src={sim.icon} className="w-6 h-6 object-contain" alt="" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">{sim.name}</h4>
                                                        <p className="text-xs text-white/50">{sim.subject} Lab • Virtual Simulation</p>
                                                    </div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center">
                                                <p className="text-white/40 text-sm italic">No simulations found for "{searchQuery}"</p>
                                            </div>
                                        )}
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
