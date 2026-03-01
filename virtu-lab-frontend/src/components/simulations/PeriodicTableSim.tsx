import React from 'react';
import { useLabStore } from '../../store/useLabStore';
import { motion } from 'framer-motion';

export const PeriodicTableSim: React.FC = () => {
    const { inputs } = useLabStore();
    const elementIdx = Math.floor(inputs.elementIdx || 1); // Atomic Number

    const elementsData = [
        { z: 1, sym: 'H', name: 'Hydrogen', type: 'Non-metal', mass: 1.008, conf: '1s1', radius: 37, en: 2.20, color: 'rgb(255,255,255,0.7)' },
        { z: 2, sym: 'He', name: 'Helium', type: 'Noble Gas', mass: 4.002, conf: '1s2', radius: 31, en: 0.0, color: 'rgb(200,200,255,0.7)' },
        { z: 3, sym: 'Li', name: 'Lithium', type: 'Alkali Metal', mass: 6.94, conf: '[He] 2s1', radius: 152, en: 0.98, color: 'rgb(255,100,100,0.7)' },
        { z: 4, sym: 'Be', name: 'Beryllium', type: 'Alkaline Earth', mass: 9.012, conf: '[He] 2s2', radius: 112, en: 1.57, color: 'rgb(255,150,100,0.7)' },
        { z: 5, sym: 'B', name: 'Boron', type: 'Metalloid', mass: 10.81, conf: '[He] 2s2 2p1', radius: 82, en: 2.04, color: 'rgb(100,255,100,0.7)' },
        { z: 6, sym: 'C', name: 'Carbon', type: 'Non-metal', mass: 12.011, conf: '[He] 2s2 2p2', radius: 77, en: 2.55, color: 'rgb(150,150,150,0.7)' },
        { z: 7, sym: 'N', name: 'Nitrogen', type: 'Non-metal', mass: 14.007, conf: '[He] 2s2 2p3', radius: 75, en: 3.04, color: 'rgb(100,100,255,0.7)' },
        { z: 8, sym: 'O', name: 'Oxygen', type: 'Non-metal', mass: 15.999, conf: '[He] 2s2 2p4', radius: 73, en: 3.44, color: 'rgb(255,50,50,0.7)' },
        { z: 9, sym: 'F', name: 'Fluorine', type: 'Halogen', mass: 18.998, conf: '[He] 2s2 2p5', radius: 71, en: 3.98, color: 'rgb(100,255,200,0.7)' },
        { z: 10, sym: 'Ne', name: 'Neon', type: 'Noble Gas', mass: 20.180, conf: '[He] 2s2 2p6', radius: 69, en: 0.0, color: 'rgb(200,200,255,0.7)' },
        { z: 11, sym: 'Na', name: 'Sodium', type: 'Alkali Metal', mass: 22.99, conf: '[Ne] 3s1', radius: 186, en: 0.93, color: 'rgb(255,100,100,0.7)' },
        { z: 12, sym: 'Mg', name: 'Magnesium', type: 'Alkaline Earth', mass: 24.305, conf: '[Ne] 3s2', radius: 160, en: 1.31, color: 'rgb(255,150,100,0.7)' },
        { z: 13, sym: 'Al', name: 'Aluminum', type: 'Post-transition', mass: 26.98, conf: '[Ne] 3s2 3p1', radius: 143, en: 1.61, color: 'rgb(150,150,150,0.7)' },
        { z: 14, sym: 'Si', name: 'Silicon', type: 'Metalloid', mass: 28.085, conf: '[Ne] 3s2 3p2', radius: 111, en: 1.90, color: 'rgb(100,255,100,0.7)' },
        { z: 15, sym: 'P', name: 'Phosphorus', type: 'Non-metal', mass: 30.974, conf: '[Ne] 3s2 3p3', radius: 106, en: 2.19, color: 'rgb(255,150,50,0.7)' },
        { z: 16, sym: 'S', name: 'Sulfur', type: 'Non-metal', mass: 32.06, conf: '[Ne] 3s2 3p4', radius: 102, en: 2.58, color: 'rgb(255,255,100,0.7)' },
        { z: 17, sym: 'Cl', name: 'Chlorine', type: 'Halogen', mass: 35.45, conf: '[Ne] 3s2 3p5', radius: 99, en: 3.16, color: 'rgb(100,255,200,0.7)' },
        { z: 18, sym: 'Ar', name: 'Argon', type: 'Noble Gas', mass: 39.948, conf: '[Ne] 3s2 3p6', radius: 97, en: 0.0, color: 'rgb(200,200,255,0.7)' },
        { z: 19, sym: 'K', name: 'Potassium', type: 'Alkali Metal', mass: 39.098, conf: '[Ar] 4s1', radius: 227, en: 0.82, color: 'rgb(255,100,100,0.7)' },
        { z: 20, sym: 'Ca', name: 'Calcium', type: 'Alkaline Earth', mass: 40.078, conf: '[Ar] 4s2', radius: 197, en: 1.00, color: 'rgb(255,150,100,0.7)' },
    ];

    const normalizedIdx = Math.max(1, Math.min(20, elementIdx));
    const activeEl = elementsData[normalizedIdx - 1];

    return (
        <div className="w-full h-full flex flex-col p-8 bg-black/40 backdrop-blur-sm rounded-3xl border border-white/5 relative overflow-hidden">
            <h2 className="text-2xl font-black text-amber-400 uppercase tracking-tighter mb-8 z-10 flex items-center gap-3">
                <img src="/icon_periodic_table.png" alt="Periodic Table" className="w-8 h-8 object-contain inline-block mr-2" /> Periodicity & Trends Analysis
            </h2>

            <div className="flex-1 flex flex-col md:flex-row gap-12 items-center justify-center relative z-10">
                <div className="relative w-full aspect-square md:w-[450px] glass-panel border border-amber-500/10 rounded-full flex flex-col items-center justify-center bg-[#0d0700]/60 p-12 overflow-hidden overflow-hidden overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #f59e0b 0.5px, transparent 0.5px)', backgroundSize: '30px 30px' }} />

                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: activeEl.radius / 150, opacity: 1 }}
                        key={activeEl.z}
                        className="w-80 h-80 rounded-full flex flex-col items-center justify-center relative group"
                        style={{ border: `1px solid ${activeEl.color}`, boxShadow: `0 0 60px ${activeEl.color.replace('0.7', '0.1')}`, backgroundColor: 'rgba(255,255,255,0.02)' }}
                    >
                        <div className="absolute -inset-4 bg-amber-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-8xl font-black text-white relative z-10 drop-shadow-2xl">{activeEl.sym}</span>
                        <span className="text-xs font-bold text-white/40 uppercase tracking-[0.4em] relative z-10">{activeEl.name}</span>
                        <div className="absolute top-8 left-8 text-xl font-black text-white/20">{activeEl.z}</div>
                    </motion.div>

                    <div className="absolute bottom-12 flex items-center gap-8">
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Conf.</span>
                            <span className="text-sm font-mono text-amber-500/80">{activeEl.conf}</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Mass</span>
                            <span className="text-sm font-mono text-amber-500/80">{activeEl.mass} u</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 w-full max-w-sm">
                    <div className="glass-panel p-8 border-amber-500/20 bg-amber-500/5 rounded-[2rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl transition-transform" />
                        <div className="relative z-10">
                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-4">Chemical Properties</span>

                            <div className="space-y-6">
                                <div className="flex justify-between items-end border-b border-white/5 pb-3">
                                    <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Atomic Radius</span>
                                    <div className="flex flex-col items-end">
                                        <span className="text-2xl font-black text-white">{activeEl.radius} pm</span>
                                        <span className="text-[9px] text-amber-400/50 uppercase font-black uppercase tracking-tighter">Size trend</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/5 pb-3">
                                    <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Electronegativity</span>
                                    <div className="flex flex-col items-end">
                                        <span className="text-2xl font-black text-white">{activeEl.en || 'N/A'}</span>
                                        <span className="text-[9px] text-amber-400/50 uppercase font-black uppercase tracking-tighter">Pauling scale</span>
                                    </div>
                                </div>
                                <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl">
                                    <span className="text-[9px] text-white/30 font-bold uppercase tracking-widest block mb-2">Category</span>
                                    <div className="text-sm font-bold text-white/80">{activeEl.type}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 border-white/5 rounded-2xl bg-white/[0.01]">
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Periodic Fact</h4>
                        <p className="text-xs text-white/30 leading-relaxed italic">
                            {activeEl.type === 'Halogen' ? 'Most reactive non-metals with high electron affinity.' : activeEl.type === 'Alkali Metal' ? 'Highly reactive metals with low ionization energy.' : activeEl.type === 'Noble Gas' ? 'Chemically inert due to full outer electron shell.' : 'Essential building blocks of the material world.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
