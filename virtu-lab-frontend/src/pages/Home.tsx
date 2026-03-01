import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { TrainBanner } from '../components/landing/TrainBanner';
import { Hero } from '../components/landing/Hero';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

export const Home: React.FC = () => {
    const { scrollYProgress } = useScroll();
    const trainY = useTransform(scrollYProgress, [0, 1], ["12vh", "85vh"]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const simulations = [
        { name: 'Pendulum Motion', subject: 'Physics', color: 'bg-blue-500', labKey: 'pendulum' },
        { name: 'Gravity Sandbox', subject: 'Physics', color: 'bg-cyan-500', labKey: 'gravity' },
        { name: 'Organic Synthesis', subject: 'Chemistry', color: 'bg-rose-500', labKey: 'titration' },
    ];

    const filteredSimulations = selectedCategory
        ? simulations.filter(sim => sim.subject.toLowerCase() === selectedCategory.toLowerCase())
        : simulations;

    const scrollToSimulations = () => {
        document.getElementById('simulations')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="bg-[#0a0a1a] min-h-screen">
            {/* Global background effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/[0.04] rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/[0.04] rounded-full blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/[0.02] rounded-full blur-[120px]" />
            </div>

            {/* Scrolling side track indicator */}
            <div className="fixed right-6 md:right-12 top-0 bottom-0 w-2 flex flex-col items-center justify-start z-50 pointer-events-none mt-20 mb-10 hidden sm:flex">
                {/* Track line (Subtle orange line) */}
                <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-orange-500/20 via-orange-500/10 to-transparent" />

                {/* Scrolling Engine (The Face) */}
                <motion.div
                    className="absolute w-40 h-40 drop-shadow-[0_0_20px_rgba(249,115,22,0.6)] cursor-pointer pointer-events-auto group"
                    style={{ y: trainY }}
                    onClick={() => setIsChatOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {/* Thought Bubble (Premium AI Badge) */}
                    <div className="absolute -top-6 -left-16 z-10 px-5 py-2.5 bg-[#171717]/90 border border-orange-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.2)] backdrop-blur-md transform -rotate-6 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-orange-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                            <span className="font-black bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent text-sm tracking-widest uppercase">
                                ASK AI
                            </span>
                        </div>
                        {/* Little circles below pointing to the character */}
                        <div className="absolute -bottom-3 right-6 w-3 h-3 border border-orange-500/30 bg-[#171717] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.2)]" />
                        <div className="absolute -bottom-6 right-3 w-1.5 h-1.5 border border-orange-500/30 bg-[#171717] rounded-full shadow-[0_0_5px_rgba(249,115,22,0.2)]" />
                    </div>
                    <img src="/train-nobg.png" alt="Scrolling character indicator" className="w-full h-full object-contain relative z-20" />
                </motion.div>
            </div>

            <LandingNavbar />
            <TrainBanner />

            {/* AI Chat Modal */}
            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-6 right-6 md:right-12 z-[120] w-[340px] rounded-2xl glass-panel bg-[#171717] border border-white/10 shadow-2xl overflow-hidden flex flex-col"
                    >
                        <div className="p-4 bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-transparent border-b border-white/5 flex items-center justify-between relative overflow-hidden">
                            {/* Animated background glow */}
                            <div className="absolute top-0 right-1/4 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl opacity-50 pointer-events-none" />

                            <div className="flex items-center gap-4 relative z-10">
                                <div className="relative">
                                    {/* Avatar Image only */}
                                    <img src="/train-nobg.png" alt="AI Agent" className="w-16 h-16 object-contain drop-shadow-[0_4px_8px_rgba(249,115,22,0.3)]" />
                                    {/* Online Indicator */}
                                    <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#171717] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5 mb-0.5">
                                        <h3 className="font-black bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent text-sm tracking-wide">VirtuLab AI</h3>
                                        <svg className="w-3.5 h-3.5 text-orange-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
                                    </div>
                                    <p className="text-white/50 text-[11px] font-medium flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-orange-500 animate-pulse"></span>
                                        Ready to help
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="text-white/50 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-4 h-64 overflow-y-auto flex flex-col gap-3 relative">
                            {/* Inner ambient glow */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

                            <div className="bg-white/5 border border-white/5 p-3 rounded-xl rounded-tl-none w-[85%] relative z-10 backdrop-blur-sm shadow-md">
                                <p className="text-sm text-white/90 leading-relaxed">Hello! I'm your interactive AI tutor. <br /><br />Click on simulations to start playing, or ask me any doubts about your experiments right here!</p>
                            </div>
                        </div>
                        <div className="p-3 border-t border-white/5 bg-black/20 relative z-10 backdrop-blur-md">
                            <div className="relative flex items-center">
                                <input type="text" placeholder="Type your doubt here..." className="w-full bg-white/5 border border-white/10 rounded-full pl-4 pr-12 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all shadow-inner" />
                                <button className="absolute right-1 top-1/2 -translate-y-1/2 p-2 text-orange-400 hover:text-white bg-orange-500/20 hover:bg-orange-500 transition-colors rounded-full">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main>
                <Hero />

                {/* Explore Labs Section */}
                <section id="explore-labs" className="relative z-10 py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-5xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-200">
                            Explore Virtual Labs
                        </h2>
                        <p className="text-white/60 max-w-2xl mx-auto text-lg">
                            Experience science like never before. Dive into our interactive, physically accurate laboratories designed for modern education.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Physics Engine', subject: 'Physics', desc: 'Experiment with gravity, optics, and thermodynamics in a real-time sandbox environment.', color: 'from-blue-500/20 to-cyan-500/5', image: '/physics_icon.png', hover: 'hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]' },
                            { title: 'Chemistry Lab', subject: 'Chemistry', desc: 'Mix compounds, observe molecular reactions, and learn stoichiometry safely and interactively.', color: 'from-orange-500/20 to-rose-500/5', image: '/chemistry_icon.png', hover: 'hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]' },
                            { title: 'Biology Cell', subject: 'Biology', desc: 'Zoom into the microscopic world. Inspect cell structures, DNA, and organic ecosystems.', color: 'from-emerald-500/20 to-teal-500/5', image: '/biology_icon.png', hover: 'hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]' },
                        ].map((feat, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.15, duration: 0.5 }}
                                viewport={{ once: true }}
                                onClick={() => {
                                    setSelectedCategory(feat.subject);
                                    scrollToSimulations();
                                }}
                                className={`p-8 rounded-[2rem] border border-white/10 bg-gradient-to-b ${feat.color} relative overflow-hidden group transition-all duration-500 cursor-pointer ${feat.hover}`}
                            >
                                {/* Background glow effect */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />

                                <div className="w-20 h-20 mb-6 relative z-10 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                                    <img
                                        src={feat.image}
                                        alt={feat.title}
                                        className="w-full h-full object-contain filter drop-shadow-lg"
                                    />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-white relative z-10">{feat.title}</h3>
                                <p className="text-white/50 text-base leading-relaxed relative z-10">{feat.desc}</p>

                                {/* Explore button indicator */}
                                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-white/30 group-hover:text-white transition-colors">
                                    ENTER LAB
                                    <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* Simulations Section */}
                <section id="simulations" className="relative z-10 py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-white">
                            {selectedCategory ? `${selectedCategory} Simulations` : "Featured Interactive Simulations"}
                        </h2>
                        <p className="text-white/40 mb-6">
                            {selectedCategory ? `Showing internal topics for ${selectedCategory}` : "Launch straight into our most popular environments."}
                        </p>

                        {selectedCategory && (
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className="px-4 py-2 rounded-full border border-orange-500/30 text-orange-400 text-xs font-bold hover:bg-orange-500/10 transition-colors uppercase tracking-widest"
                            >
                                ← Show All Subjects
                            </button>
                        )}
                    </div>

                    <motion.div
                        layout
                        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                    >
                        <AnimatePresence mode="popLayout">
                            {filteredSimulations.map((sim) => (
                                <Link
                                    to={`/lab/${sim.labKey}`}
                                    key={sim.name}
                                    className="block"
                                >
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="group relative h-72 rounded-[2rem] overflow-hidden cursor-pointer"
                                    >
                                        {/* Placeholder Background Image - we use a clean gradient for now */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#171717] to-black border border-white/10 group-hover:border-white/20 transition-colors z-0"></div>

                                        {/* Image simulation blur */}
                                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 ${sim.color} rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity z-0`}></div>

                                        <div className="absolute inset-0 p-6 flex flex-col justify-end z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${sim.color.replace('bg-', 'text-')} mb-2`}>{sim.subject}</span>
                                            <h3 className="text-xl font-bold text-white mb-2">{sim.name}</h3>

                                            <div className="flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black">
                                                    <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                </div>
                                                <span className="text-xs font-semibold text-white">Start Simulation</span>
