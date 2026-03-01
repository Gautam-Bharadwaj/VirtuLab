import React, { useMemo, useState, useEffect } from 'react';
import { useLabStore } from '../../store/useLabStore';
import { motion } from 'framer-motion';

export const ReactionRateSim: React.FC = () => {
    const { inputs, running, setFailureState } = useLabStore();
    const temp = inputs.temperature || 25; // 0-100 C
    const concentration = inputs.concentration || 1.0; // 0.1-5.0 M

    useEffect(() => {
        if (!running) return;
        if (temp > 90) {
            setFailureState({ name: 'ENZYME_DENATURATION', description: `Temperature ${temp}\u00B0C is extreme — catalysts and enzymes degrade above 90\u00B0C.` });
        }
    }, [temp, running, setFailureState]);

    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (running) {
            setProgress(0);
            const rateK = Math.pow(1.1, temp / 10) * concentration * 0.5;
            interval = setInterval(() => {
                setProgress(prev => {
                    const next = prev + rateK;
                    return next >= 100 ? 100 : next;
                });
            }, 50);
        } else {
            setProgress(0);
        }
        return () => clearInterval(interval);
    }, [running, temp, concentration]);

    const particles = useMemo(() => Array.from({ length: 15 * concentration }).map((_, i) => ({
        id: i,
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10,
        speed: (temp / 100) * 10 + 2,
        angle: Math.random() * Math.PI * 2
    })), [concentration, temp]);

    return (
        <div className="w-full h-full flex flex-col p-8 bg-black/40 backdrop-blur-sm rounded-3xl border border-white/5 relative overflow-hidden">
            <h2 className="text-2xl font-black text-orange-400 uppercase tracking-tighter mb-8 z-10 flex items-center gap-3">
                <img src="/icon_reaction_rate.png" alt="Kinetics" className="w-8 h-8 object-contain inline-block mr-2" /> Chemical Kinetics Study
            </h2>

            <div className="flex-1 flex flex-col md:flex-row gap-12 items-center justify-center relative z-10">
                <div className="relative w-full aspect-square md:w-[450px] glass-panel border border-orange-500/10 rounded-[3rem] bg-[#100a00]/60 p-12 overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #f97316 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />

                    <div className="relative w-full h-full">
                        {particles.map((p) => (
                            <motion.div
                                key={p.id}
                                animate={{
                                    x: [`${p.x}%`, `${(p.x + Math.cos(p.angle) * 30 + 100) % 100}%`],
                                    y: [`${p.y}%`, `${(p.y + Math.sin(p.angle) * 30 + 100) % 100}%`],
                                }}
                                transition={{
                                    duration: running ? 5 / p.speed : 10,
                                    repeat: Infinity,
                                    ease: 'linear'
                                }}
                                className={`absolute w-3 h-3 rounded-full blur-[2px] ${p.id % 2 === 0 ? 'bg-orange-500 shadow-orange-500/50' : 'bg-red-500 shadow-red-500/50'} shadow-lg`}
                            />
                        ))}

                        <div className="absolute inset-x-8 bottom-8 z-20">
                            <div className="flex justify-between items-end mb-2">
                                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Product Concentration</span>
                                <span className="text-xl font-black text-orange-400">{progress.toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    style={{ width: `${progress}%` }}
                                    className="h-full bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)]"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 w-full max-w-sm">
                    <div className="glass-panel p-8 border-orange-500/20 bg-orange-500/5 rounded-[2rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl transition-transform" />
                        <div className="relative z-10">
                            <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest block mb-4">Collision Theory Factors</span>

                            <div className="space-y-6">
                                <div className="flex justify-between items-end border-b border-white/5 pb-3">
                                    <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Molecular Speed</span>
                                    <div className="flex flex-col items-end">
                                        <span className="text-2xl font-black text-white">{(temp * 1.5).toFixed(0)}<span className="text-xs text-white/20 ml-1">v̂</span></span>
                                        <span className="text-[9px] text-orange-400/50 uppercase font-black tracking-tighter">Kinetic Energy</span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-end border-b border-white/5 pb-3">
                                    <span className="text-xs text-white/40 font-bold uppercase tracking-wider">Collision Freq.</span>
                                    <div className="flex flex-col items-end">
                                        <span className="text-2xl font-black text-white">{(concentration * temp / 10).toFixed(1)}</span>
                                        <span className="text-[9px] text-orange-400/50 uppercase font-black tracking-tighter">Effective/sec</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 border-white/5 rounded-2xl bg-white/[0.01]">
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Reaction Dynamics</h4>
                        <p className="text-xs text-white/30 leading-relaxed italic">
                            Double complexity for chemical transformations: 1. Sufficient kinetic energy (Ea) 2. Proper geometric orientation.
                            <br /><br />
                            <span className="text-orange-400/60 font-medium">Rate = k[A][B]</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
