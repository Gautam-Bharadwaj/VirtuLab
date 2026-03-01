import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { Hero } from '../components/landing/Hero';
import { TrainBanner } from '../components/landing/TrainBanner';
import { simulations } from '../data/simulations';

export default function Home() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const { scrollY } = useScroll();
    const trainY = useTransform(scrollY, [0, 2000], [100, 800]);

    const filteredSimulations = selectedCategory
        ? simulations.filter(sim => sim.subject.toLowerCase() === selectedCategory.toLowerCase())
        : simulations;

    const scrollToSimulations = () => {
        document.getElementById('simulations')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="bg-[#0a0a1a] min-h-screen">
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/[0.02] rounded-full blur-[80px]" style={{ willChange: 'transform' }} />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/[0.02] rounded-full blur-[80px]" style={{ willChange: 'transform' }} />
            </div>

            <div className="fixed right-6 md:right-12 top-0 bottom-0 w-2 flex flex-col items-center justify-start z-50 pointer-events-none mt-20 mb-10 hidden sm:flex">
                <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-orange-500/10 via-orange-500/5 to-transparent" />
                <motion.div
                    className="absolute w-40 h-40 drop-shadow-[0_0_15px_rgba(249,115,22,0.4)] cursor-pointer pointer-events-auto group"
                    style={{ y: trainY, willChange: 'transform' }}
                    onClick={() => setIsChatOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <img src="/train-nobg.png" alt="Scrolling character indicator" className="w-full h-full object-contain relative z-20" />
                </motion.div>
            </div>

            <LandingNavbar />
            <TrainBanner />

            <AnimatePresence>
                {isChatOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-6 right-6 md:right-12 z-[120] w-[340px] rounded-2xl glass-panel bg-[#171717] border border-white/10 shadow-2xl overflow-hidden flex flex-col"
                    >
                        <div className="p-4 bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-transparent border-b border-white/5 flex items-center justify-between relative overflow-hidden">
                            <div className="absolute top-0 right-1/4 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl opacity-50 pointer-events-none" />
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="relative">
                                    <img src="/train-nobg.png" alt="Project Info" className="w-16 h-16 object-contain drop-shadow-[0_4px_8px_rgba(249,115,22,0.3)]" />
                                </div>
                                <div>
                                    <h3 className="font-black bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent text-sm tracking-wide uppercase">VirtuLab.ai</h3>
                                    <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest mt-1">Version 4.0 Stable</p>
                                </div>
                            </div>
                            <button onClick={() => setIsChatOpen(false)} className="text-white/50 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-5 overflow-y-auto relative bg-[#121212]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

                            <div className="space-y-6 relative z-10">
                                <div>
                                    <p className="text-sm text-white/80 leading-relaxed font-medium">
                                        VirtuLab is a next-generation interactive platform designed for B.Tech and Class 11-12 science students to perform physically accurate experiments in a risk-free virtual environment.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black text-orange-400 uppercase tracking-[0.2em] border-b border-orange-500/20 pb-2">Core Features</h4>
                                    <ul className="space-y-3">
                                        {[
                                            { title: "Physical Simulations", desc: "Curriculum-aligned modules for Physics, Chemistry, and Biology." },
                                            { title: "Precision Control", desc: "Real-time parameter tuning via sliders and manual digital input." },
                                            { title: "Quantum Telemetry", desc: "Advanced 3D & orbital visualizers for atomic and cellular concepts." },
                                            { title: "Lab Reports", desc: "Automatic generation of observations and procedural diagnostics." }
                                        ].map((f, i) => (
                                            <li key={i} className="flex gap-3">
                                                <div className="mt-1.5 w-1 h-1 rounded-full bg-orange-500 flex-shrink-0 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                                                <div>
                                                    <span className="text-xs font-bold text-white block mb-0.5">{f.title}</span>
                                                    <span className="text-[11px] text-white/40 leading-snug block">{f.desc}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main>
                <Hero />

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
                            Experience science like never before. Dive into our interactive, physically accurate laboratories designed for B.Tech & Class 11-12.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { title: 'Physics Engine', subject: 'Physics', desc: 'Experiment with Ohm\'s law, projectiles, and optics bench in real-time.', color: 'from-blue-500/20 to-cyan-500/5', image: '/physics_icon.png', hover: 'hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(56,189,248,0.2)]' },
                            { title: 'Chemistry Lab', subject: 'Chemistry', desc: 'Perform titrations, flame tests, and explore periodic trends safely.', color: 'from-orange-500/20 to-rose-500/5', image: '/chemistry_icon.png', hover: 'hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.2)]' },
                            { title: 'Biology Cell', subject: 'Biology', desc: 'Identify cell structures and mitosis stages under the microscope.', color: 'from-emerald-500/20 to-teal-500/5', image: '/biology_icon.png', hover: 'hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]' },
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
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
                                <div className="w-20 h-20 mb-6 relative z-10 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500">
                                    <img src={feat.image} alt={feat.title} className="w-full h-full object-contain filter drop-shadow-lg" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-white relative z-10">{feat.title}</h3>
                                <p className="text-white/50 text-base leading-relaxed relative z-10">{feat.desc}</p>
                                <div className="mt-8 flex items-center gap-2 text-sm font-bold text-white/30 group-hover:text-white transition-colors">
                                    ENTER LAB
                                    <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section id="simulations" className="relative z-10 py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-white">
                            {selectedCategory ? `${selectedCategory} Simulations` : "Curriculum-Aligned Experiments"}
                        </h2>
                        <p className="text-white/40 mb-6">
                            {selectedCategory ? `Showing experiments for ${selectedCategory}` : "Covering B.Tech First Year and Class 11-12 Syllabus."}
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

                    <motion.div layout="position" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <AnimatePresence mode="popLayout" initial={false}>
                            {filteredSimulations.map((sim, idx) => (
                                <Link to={`/lab/${sim.labKey}`} key={sim.name} className="block">
                                    <motion.div
                                        layout="position"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        whileHover={{ y: -8 }}
                                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                                        className="group relative h-72 rounded-[2rem] overflow-hidden cursor-pointer"
                                        style={{ willChange: 'transform, opacity' }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#171717] to-black border border-white/10 group-hover:border-white/20 transition-colors z-0"></div>
                                        <div className={`absolute top-0 right-0 w-48 h-48 ${sim.color} rounded-full blur-[80px] opacity-10 group-hover:opacity-30 transition-opacity z-0`}></div>

                                        {/* Background Icon */}
                                        <div className="absolute right-[-20px] top-[-20px] w-48 h-48 opacity-20 group-hover:opacity-40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 blur-sm group-hover:blur-none">
                                            <img src={sim.icon} alt="" className="w-full h-full object-contain" />
                                        </div>

                                        <div className="absolute inset-0 p-6 flex flex-col justify-between z-10">
                                            <div className="flex justify-between items-start">
                                                <div className={`w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center backdrop-blur-md shadow-2xl group-hover:scale-110 transition-transform`}>
                                                    <img src={sim.icon} alt="" className="w-8 h-8 object-contain" />
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${sim.color.replace('bg-', 'text-')} bg-white/5 px-3 py-1 rounded-full border border-white/5`}>
                                                    {sim.subject}
                                                </span>
                                            </div>

                                            <div>
                                                <h3 className="text-xl font-black text-white mb-4 leading-tight group-hover:text-orange-400 transition-colors">{sim.name}</h3>
                                                <div className="flex items-center gap-2 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                                                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-black shadow-lg shadow-orange-500/20">
                                                        <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-white">Start Experiment</span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </section>
            </main>
        </div>
    );
}
