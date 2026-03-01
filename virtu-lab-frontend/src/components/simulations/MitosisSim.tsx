import React from 'react';
import { useLabStore } from '../../store/useLabStore';
import { motion } from 'framer-motion';

export const MitosisSim: React.FC = () => {
    const { inputs } = useLabStore();
    const stage = inputs.stage || 0; // 0-100%

    const stageMeta = [
        { name: 'Interphase', start: 0, end: 15, color: '#4ade80' },
        { name: 'Prophase', start: 15, end: 35, color: '#2dd4bf' },
        { name: 'Metaphase', start: 35, end: 55, color: '#3b82f6' },
        { name: 'Anaphase', start: 55, end: 75, color: '#8b5cf6' },
        { name: 'Telophase', start: 75, end: 95, color: '#d946ef' },
        { name: 'Cytokinesis', start: 95, end: 100, color: '#f43f5e' },
    ];

    const currentStageName = stageMeta.find(s => stage >= s.start && stage <= s.end)?.name || 'Interphase';

    return (
        <div className="w-full h-full flex flex-col p-8 bg-black/40 backdrop-blur-sm rounded-3xl border border-white/5 relative overflow-hidden">
            <h2 className="text-2xl font-black text-green-400 uppercase tracking-tighter mb-8 z-10 flex items-center gap-3">
                <span className="text-3xl">✂️</span> Cellular Division & Mitosis
            </h2>

            <div className="flex-1 flex flex-col md:flex-row gap-8 items-center justify-center relative z-10">
                <div className="relative w-full aspect-square md:w-[500px] glass-panel border border-green-500/10 rounded-full flex flex-col items-center justify-center bg-[#051005]/60 p-12 overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #22c55e 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />

                    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">

                        <motion.div
                            animate={{
                                x: stage > 55 ? -100 : 0,
                                opacity: stage > 95 ? 0.3 : 1,
                                scale: stage > 95 ? 0.8 : 1
                            }}
                            className="absolute flex flex-col gap-4"
                        >
                            {[0, 1].map((n) => (
                                <motion.div
                                    key={n}
                                    animate={{
                                        rotate: stage < 35 ? (n * 180 + stage * 2) : 0,
                                        scale: stage > 35 && stage < 55 ? 1.5 : 1
                                    }}
                                    className="w-4 h-20 bg-gradient-to-t from-blue-500 to-indigo-400 rounded-full border border-white/20 shadow-lg"
                                />
                            ))}
                        </motion.div>

                        <motion.div
                            animate={{
                                x: stage > 55 ? 100 : 0,
                                opacity: stage > 95 ? 0.3 : 1,
                                scale: stage > 95 ? 0.8 : 1
                            }}
                            className="absolute flex flex-col gap-4"
                        >
                            {[0, 1].map((n) => (
                                <motion.div
                                    key={n}
                                    animate={{
                                        rotate: stage < 35 ? (n * 180 + -stage * 2) : 0,
                                        scale: stage > 35 && stage < 55 ? 1.5 : 1
                                    }}
                                    className="w-4 h-20 bg-gradient-to-t from-emerald-500 to-teal-400 rounded-full border border-white/20 shadow-lg shadow-teal-500/20"
                                />
                            ))}
                        </motion.div>

                        {stage > 75 && (
                            <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: 400 }}
                                className="absolute w-1 bg-white/20 shadow-2xl z-20"
                            />
                        )}
                    </div>

                    <div className="absolute top-12 left-1/2 -translate-x-1/2 glass-panel px-6 py-2 rounded-full border border-white/5 bg-white/[0.02]">
                        <span className="text-[12px] font-black text-white/40 uppercase tracking-[0.4em] mr-4 whitespace-nowrap">PHASE:</span>
                        <span className="text-sm font-black text-emerald-400 uppercase tracking-widest whitespace-nowrap">{currentStageName}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-6 w-full max-w-sm">
                    <div className="glass-panel p-8 border-green-500/20 bg-green-500/5 rounded-[2rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
                        <div className="relative z-10 flex flex-col">
                            <span className="text-[10px] font-black text-green-400 uppercase tracking-widest block mb-4 uppercase whitespace-nowrap">Genetic Blueprint Replication</span>
                            <div className="space-y-3">
                                {stageMeta.map((s, i) => (
                                    <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${currentStageName === s.name ? 'bg-green-500/10 border-green-500/30' : 'bg-transparent border-transparent opacity-30'}`}>
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                                        <span className="text-xs font-black text-white/70 uppercase tracking-tighter">{s.name}</span>
                                        {currentStageName === s.name && <span className="text-[9px] font-black text-green-400 ml-auto uppercase tracking-tighter">Active</span>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 border-white/5 rounded-2xl bg-white/[0.01]">
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 uppercase">Cytological Insight</h4>
                        <p className="text-xs text-white/30 leading-relaxed italic">
                            Mitosis ensures that when a parent cell divides, each child cell receives an exact replica of the DNA.
                            <br /><br />
                            <span className="text-emerald-400/60 font-medium">Errors in this process can lead to genomic instability.</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
