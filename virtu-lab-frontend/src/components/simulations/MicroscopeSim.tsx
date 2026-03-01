import React, { useState } from 'react';
import { useLabStore } from '../../store/useLabStore';
import { motion } from 'framer-motion';

export const MicroscopeSim: React.FC = () => {
    const { inputs, running } = useLabStore();
    const magnification = inputs.magnification || 10;

    const [focus, setFocus] = useState(50); // 0 (Worst) to 100 (Best)

    const blurAmount = Math.abs(50 - focus) / 8; // Sharpest at 50
    const zoomScale = magnification / 10; // Normalized Zoom

    return (
        <div className="w-full h-full flex flex-col p-8 bg-[#020202] rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #10b981 0.5px, transparent 0.5px)', backgroundSize: '60px 60px' }} />

            <h2 className="text-2xl font-black text-emerald-400 uppercase tracking-tighter mb-8 z-10 flex items-center gap-3">
                <span className="text-3xl">🔬</span> Virtual Cellular Observatory
            </h2>

            <div className="flex-1 flex flex-col md:flex-row gap-12 items-center justify-center relative z-10">

                <div className="relative w-full aspect-square md:w-[500px] rounded-full border-[1.5rem] border-[#171717] bg-[#050505] shadow-[inset_0_0_80px_rgba(0,0,0,1),0_0_40px_rgba(16,185,129,0.1)] overflow-hidden flex items-center justify-center group cursor-crosshair">

                    <motion.div
                        style={{ scale: zoomScale, filter: `blur(${blurAmount}px)` }}
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                        <svg width="400" height="400" viewBox="0 0 400 400">
                            <defs>
                                <pattern id="cellPattern" x="0" y="0" width="100" height="80" patternUnits="userSpaceOnUse">
                                    <path d="M5,10 L95,5 L100,75 L10,80 Z" fill="rgba(16, 185, 129, 0.05)" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="1" />
                                    <circle cx="50" cy="40" r="3" fill="rgba(16, 185, 129, 0.6)" />
                                    <circle cx="48" cy="38" r="1.5" fill="rgba(255, 255, 255, 0.2)" />
                                </pattern>
                            </defs>
                            <rect width="800" height="800" fill="url(#cellPattern)" transform="translate(-200,-200)" />
                            {Array.from({ length: 8 }).map((_, i) => (
                                <circle key={i} cx={Math.random() * 400} cy={Math.random() * 400} r={Math.random() * 1.5} fill="rgba(255,255,255,0.05)" />
                            ))}
                        </svg>
                    </motion.div>

                    <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] pointer-events-none" />

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 opacity-20 group-hover:opacity-40 transition-opacity flex items-center justify-center pointer-events-none">
                        <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-white/40" />
                        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-white/40" />
                        <div className="w-16 h-16 border border-white/40 rounded-full" />
                    </div>

                    {!running && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center flex-col p-8 text-center">
                            <div className="text-4xl mb-4">🫙</div>
                            <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide">Slide Not Loaded</h3>
                            <p className="text-white/40 text-[10px] uppercase tracking-widest leading-loose">Choose a specimen and press "START" to begin observation.</p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col gap-6 w-full max-w-xs">
                    <div className="glass-panel p-6 border-emerald-500/20 bg-emerald-500/5 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl transition-transform" />
                        <div className="relative z-10">
                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-4">Specimen Details</span>
                            <h4 className="text-lg font-bold text-white mb-1">Onion Peel Cells</h4>
                            <p className="text-xs text-white/40 mb-6 leading-relaxed">Epidermal cells of Allium cepa. Notice the prominent cell walls and eccentric nuclei.</p>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl text-center">
                                    <div className="text-[9px] text-white/30 uppercase font-black tracking-widest mb-1">Magnification</div>
                                    <div className="text-2xl font-black text-emerald-400">{magnification}x</div>
                                </div>
                                <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl text-center">
                                    <div className="text-[9px] text-white/30 uppercase font-black tracking-widest mb-1">Resolution</div>
                                    <div className="text-2xl font-black text-emerald-400">High</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 border-white/5 rounded-2xl flex flex-col items-center">
                        <span className="text-[10px] font-black text-white/20 uppercase tracking-widest block mb-4">Adjust Fine Focus</span>
                        <div className="relative group transition-all">
                            <motion.div
                                animate={{ rotate: focus * 3.6 }}
                                className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#171717] border border-white/10 shadow-xl flex items-center justify-center cursor-pointer active:scale-95"
                                onMouseMove={(e) => {
                                    if (e.buttons === 1) {
                                        setFocus(prev => Math.max(0, Math.min(100, prev + (e.movementX > 0 ? 2 : -2))));
                                    }
                                }}
                            >
                                <div className="w-1 h-3 bg-emerald-500/80 rounded-full absolute top-1" />
                            </motion.div>
                            <div className="absolute -inset-4 bg-emerald-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <p className="text-[9px] text-white/30 uppercase font-bold mt-4 tracking-widest italic">Click & Drag Knob</p>
                    </div>

                    <div className="mt-auto glass-panel p-6 border-white/5 rounded-2xl bg-white/[0.02]">
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block mb-2">Internal Structures Visible</span>
                        <div className="flex flex-wrap gap-2">
                            {['Cell Wall', 'Nucleus', 'Cytoplasm', 'Vacuoles'].map(tag => (
                                <span key={tag} className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-[8px] font-black text-emerald-400 uppercase tracking-widest rounded-md">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
