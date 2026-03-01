import React from 'react';
import { useLabStore } from '../../store/useLabStore';
import { motion } from 'framer-motion';

export const CellStructureSim: React.FC = () => {
    const { inputs } = useLabStore();
    const zoom = inputs.zoom || 1; // 1-10x

    const organelles = [
        { name: 'Nucleus', func: 'Genetic Control Center', color: 'rgb(255, 100, 255)', x: 10, y: -10, scale: 3 },
        { name: 'Mitochondria', func: 'ATP Energy Factory', color: 'rgb(255, 100, 100)', x: 100, y: 120, scale: 1 },
        { name: 'Chloroplast', func: 'Photosynthesis Site', color: 'rgb(100, 255, 100)', x: -120, y: 80, scale: 1 },
        { name: 'Golgi Body', func: 'Protein Packaging', color: 'rgb(255, 200, 100)', x: -80, y: -90, scale: 1.5 },
        { name: 'Ribosome', func: 'Protein Synthesis', color: 'rgb(255, 255, 255)', x: 0, y: 0, scale: 0.1 }
    ];

    return (
        <div className="w-full h-full flex flex-col p-8 bg-black/40 backdrop-blur-sm rounded-3xl border border-white/5 relative overflow-hidden">
            <h2 className="text-2xl font-black text-emerald-400 uppercase tracking-tighter mb-8 z-10 flex items-center gap-3">
                <img src="/icon_cell.png" alt="Cell" className="w-8 h-8 object-contain inline-block mr-2" /> Organelle Discovery Center
            </h2>

            <div className="flex-1 flex flex-col md:flex-row gap-12 items-center justify-center relative z-10">
                <div className="relative w-full aspect-square md:w-[500px] glass-panel border border-emerald-500/10 rounded-[4rem] bg-[#001005]/60 p-12 overflow-hidden overflow-hidden overflow-hidden">
                    <div className="absolute inset-x-0 bottom-0 top-[60%] bg-gradient-to-t from-emerald-900/10 to-transparent pointer-events-none" />

                    <div className="absolute inset-8 rounded-full border-4 border-emerald-500/20 shadow-[0_0_100px_rgba(16,185,129,0.1)_inset]" />

                    <motion.div
                        animate={{ scale: zoom * 0.5 + 0.5 }}
                        className="relative w-full h-full flex items-center justify-center"
                    >
                        {organelles.map((org, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, x: org.x, y: org.y }}
                                className="absolute group cursor-pointer"
                            >
                                <div
                                    className="rounded-full shadow-lg border-2 border-white/10 flex items-center justify-center transform group-hover:scale-110 transition-transform"
                                    style={{
                                        width: org.scale * 40,
                                        height: org.scale * 40,
                                        backgroundColor: org.color.replace('rgb', 'rgba').replace(')', ', 0.3)'),
                                        boxShadow: `0 0 30px ${org.color.replace('rgb', 'rgba').replace(')', ', 0.2)')}`
                                    }}
                                >
                                    <span className="text-[10px] items-center text-center px-1 font-black text-white mix-blend-overlay uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {org.name}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="absolute bottom-8 right-8 glass-panel px-4 py-2 rounded-full border border-white/5 text-[10px] font-black text-emerald-400/80 uppercase tracking-widest whitespace-nowrap">
                        Zoom Level: {zoom}x
                    </div>
                </div>

                <div className="flex flex-col gap-4 w-full max-w-sm">
                    <div className="glass-panel p-8 border-emerald-500/20 bg-emerald-500/5 rounded-[2rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
                        <div className="relative z-10 flex flex-col gap-6">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Eukaryotic Profile</span>

                            <div className="space-y-4">
                                {organelles.filter(o => o.scale > 1).map((org, i) => (
                                    <div key={i} className={`p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-4 group hover:bg-emerald-500/10 transition-colors`}>
                                        <div className="w-2.5 h-10 rounded-full" style={{ backgroundColor: org.color }} />
                                        <div>
                                            <h4 className="text-xs font-black text-white/80 uppercase tracking-tight">{org.name}</h4>
                                            <p className="text-[10px] text-white/30 uppercase font-black uppercase tracking-tighter group-hover:text-emerald-400/60 transition-colors">{org.func}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 border-white/5 rounded-2xl bg-white/[0.01]">
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Biology Fact</h4>
                        <p className="text-xs text-white/30 leading-relaxed italic">
                            Organelles are specialized sub-units within a cell that have specific functions.
                            The presence of a membrane-bound nucleus distinguishes Eukaryotes from Prokaryotes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
