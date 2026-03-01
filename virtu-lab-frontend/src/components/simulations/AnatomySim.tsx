import React from 'react';
import { useLabStore } from '../../store/useLabStore';
import { motion } from 'framer-motion';

export const AnatomySim: React.FC = () => {
    const { inputs } = useLabStore();
    const rotate = inputs.rotate || 0; // 0-360 deg

    const organsParts = [
        { name: 'Cerebrum', area: 'Top', func: 'Higher Brain Functions', color: 'rgb(255, 100, 255)', x: 0, y: -80, size: 100 },
        { name: 'Cerebellum', area: 'Rear', func: 'Coordination & Balance', color: 'rgb(100, 255, 255)', x: -40, y: 70, size: 50 },
        { name: 'Brain Stem', area: 'Base', func: 'Vital Life Functions', color: 'rgb(100, 255, 100)', x: 0, y: 120, size: 30 },
        { name: 'Aorta', area: 'Superior', func: 'Main Artery', color: 'rgb(255, 50, 50)', x: 80, y: -20, size: 40 },
        { name: 'Ventricle', area: 'Inferior', func: 'Blood Pumping Chamber', color: 'rgb(255, 150, 100)', x: 60, y: 60, size: 70 }
    ];

    return (
        <div className="w-full h-full flex flex-col p-8 bg-black/40 backdrop-blur-sm rounded-3xl border border-white/5 relative overflow-hidden">
            <h2 className="text-2xl font-black text-emerald-400 uppercase tracking-tighter mb-8 z-10 flex items-center gap-3">
                <img src="/icon_anatomy.png" alt="Anatomy" className="w-8 h-8 object-contain inline-block mr-2" /> Human Anatomy Observatory
            </h2>

            <div className="flex-1 flex flex-col md:flex-row gap-8 items-center justify-center relative z-10">
                <div className="relative w-full aspect-square md:w-[500px] glass-panel border border-emerald-500/10 rounded-[4rem] bg-[#001005]/60 p-12 flex items-center justify-center overflow-hidden overflow-hidden overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #10b981 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />

                    <motion.div
                        animate={{ rotateY: rotate }}
                        style={{ perspective: '1000px' }}
                        className="relative w-full h-full flex items-center justify-center"
                    >
                        <svg viewBox="-200 -200 400 400" className="w-full h-full drop-shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                            <motion.path
                                animate={{ scale: [1, 1.02, 0.98, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                d="M -100,0 Q -100,-150 0,-150 Q 100,-150 100,0 Q 100,100 0,150 Q -100,100 -100,0"
                                fill="rgba(16,185,129,0.05)"
                                stroke="rgba(16,185,129,0.3)"
                                strokeWidth="2"
                                strokeDasharray="10 5"
                            />

                            {organsParts.map((org, i) => (
                                <motion.g key={i} transform={`translate(${org.x}, ${org.y})`}>
                                    <motion.circle
                                        animate={{ opacity: [0.1, 0.4, 0.1], r: [org.size / 4, org.size / 4 + 10, org.size / 4] }}
                                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                                        r={org.size / 4} fill={org.color}
                                    />
                                    <circle r="4" fill={org.color} />
                                    <text y="-10" textAnchor="middle" fill="white" fillOpacity="0.4" fontSize="8" fontWeight="bold" className="uppercase tracking-[0.2em]">{org.name}</text>
                                </motion.g>
                            ))}
                        </svg>
                    </motion.div>

                    <div className="absolute top-8 right-8 glass-panel px-4 py-2 rounded-full border border-white/5">
                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block">Orientation: {rotate}°</span>
                    </div>
                </div>

                <div className="flex flex-col gap-6 w-full max-w-sm">
                    <div className="glass-panel p-8 border-emerald-500/20 bg-emerald-500/5 rounded-[2rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
                        <div className="relative z-10 flex flex-col gap-4">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">Physiological Atlas</span>

                            <div className="space-y-4">
                                {organsParts.map((org, i) => (
                                    <div key={i} className={`p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex items-center gap-4 group hover:bg-emerald-500/10 transition-colors`}>
                                        <div className="w-10 h-10 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-xs font-black text-white/40">0{i + 1}</div>
                                        <div>
                                            <h4 className="text-xs font-black text-white/80 uppercase tracking-tight">{org.name}</h4>
                                            <p className="text-[10px] text-white/30 truncate w-48 uppercase tracking-tighter group-hover:text-emerald-400/60 transition-colors uppercase">{org.func}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 border-white/5 rounded-2xl bg-white/[0.01]">
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3 uppercase">Medical Insight</h4>
                        <p className="text-xs text-white/30 leading-relaxed italic">
                            Anatomy is the structural framework of the human body. Understanding the spatial relationship between organs is critical for surgical and diagnostic procedures.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
