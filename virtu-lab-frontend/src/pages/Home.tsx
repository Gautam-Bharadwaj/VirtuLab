import { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { Hero } from '../components/landing/Hero';
import { TrainBanner } from '../components/landing/TrainBanner';

export default function Home() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const { scrollY } = useScroll();
    const trainY = useTransform(scrollY, [0, 2000], [100, 800]);

    const simulations = [
        { name: "Ohm’s Law & Resistance", subject: 'Physics', color: 'bg-blue-500', labKey: 'ohm-law' },
        { name: "Projectile Motion", subject: 'Physics', color: 'bg-indigo-500', labKey: 'projectile-motion' },
        { name: "Optics Bench", subject: 'Physics', color: 'bg-cyan-500', labKey: 'optics-bench' },
        { name: "Logic Gates", subject: 'Physics', color: 'bg-blue-600', labKey: 'logic-gates' },

        { name: "Acid-Base Titration", subject: 'Chemistry', color: 'bg-orange-500', labKey: 'titration' },
        { name: "Flame Test", subject: 'Chemistry', color: 'bg-rose-500', labKey: 'flame-test' },
        { name: "Periodic Table Trends", subject: 'Chemistry', color: 'bg-amber-500', labKey: 'periodic-table' },
        { name: "Rate of Reaction", subject: 'Chemistry', color: 'bg-orange-600', labKey: 'reaction-rate' },

        { name: "Virtual Microscope", subject: 'Biology', color: 'bg-emerald-500', labKey: 'microscope' },
        { name: "Cell Structure", subject: 'Biology', color: 'bg-teal-500', labKey: 'cell-structure' },
        { name: "Mitosis", subject: 'Biology', color: 'bg-green-600', labKey: 'mitosis' },
        { name: "Anatomy (Heart/Brain)", subject: 'Biology', color: 'bg-emerald-600', labKey: 'anatomy' },
    ];

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
                    <div className="absolute -top-6 -left-16 z-10 px-5 py-2.5 bg-[#171717]/90 border border-orange-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.1)] backdrop-blur-md transform -rotate-6 group-hover:rotate-0 transition-all duration-300">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-orange-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                            <span className="font-black bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent text-sm tracking-widest uppercase">
                                ASK AI
                            </span>
                        </div>
                    </div>
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
                                    <img src="/train-nobg.png" alt="AI Agent" className="w-16 h-16 object-contain drop-shadow-[0_4px_8px_rgba(249,115,22,0.3)]" />
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
                            { title: 'Biology Cell', subject: 'Biology', desc: 'Identify cell structures, mitosis stages, and human anatomy under the microscope.', color: 'from-emerald-500/20 to-teal-500/5', image: '/biology_icon.png', hover: 'hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]' },
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
                                        transition={{ duration: 0.4, delay: idx * 0.05 }}
                                        className="group relative h-72 rounded-[2rem] overflow-hidden cursor-pointer"
                                        style={{ willChange: 'transform, opacity' }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#171717] to-black border border-white/10 group-hover:border-white/20 transition-colors z-0"></div>
                                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 ${sim.color} rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity z-0`}></div>
                                        <div className="absolute inset-0 p-6 flex flex-col justify-end z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${sim.color.replace('bg-', 'text-')} mb-2`}>{sim.subject}</span>
                                            <h3 className="text-lg font-bold text-white mb-2 leading-tight">{sim.name}</h3>
                                            <div className="flex items-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-black">
                                                    <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                                                </div>
                                                <span className="text-xs font-semibold text-white">Start Simulation</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </section>

                <section id="resources" className="relative z-10 py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
                    <div className="flex flex-col md:flex-row gap-12 items-center">
                        <div className="w-full md:w-1/2">
                            <h2 className="text-4xl font-bold mb-6 text-white leading-tight">Comprehensive<br /><span className="text-orange-500">Resources & Guides</span></h2>
                            <p className="text-white/50 mb-8 max-w-md text-lg">
                                Designed for B.Tech first year labs and school curriculum. Theory, Viva questions, and procedures included for every experiment.
                            </p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="text-orange-500 font-bold mb-1">Theoretical Background</div>
                                    <div className="text-xs text-white/40">In-depth concepts for every lab.</div>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                                    <div className="text-orange-500 font-bold mb-1">Viva Prep</div>
                                    <div className="text-xs text-white/40">Most common viva questions answered.</div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2 relative h-[400px] rounded-[3rem] overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-blue-500/20 blur-2xl group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 glass-panel border border-white/10 flex items-center justify-center">
                                <div className="text-center p-8">
                                    <img src="/icon_books.png" alt="Library" className="w-16 h-16 mx-auto mb-4 object-contain" />
                                    <h3 className="text-2xl font-bold text-white mb-2">Interactive Manuals</h3>
                                    <p className="text-white/40 text-sm">Step-by-step guidance for every simulation.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
