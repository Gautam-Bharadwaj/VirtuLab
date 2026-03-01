import React, { useMemo, useEffect } from 'react';
import { useLabStore } from '../../store/useLabStore';
import { motion } from 'framer-motion';

export const ProjectileSim: React.FC = () => {
    const { inputs, running, setFailureState } = useLabStore();
    const angle = inputs.angle || 45; // Degrees
    const velocity = inputs.velocity || 20; // m/s
    const gravity = 9.81; // m/s^2

    useEffect(() => {
        if (!running) return;
        const angleRad = (angle * Math.PI) / 180;
        const range = (velocity ** 2 * Math.sin(2 * angleRad)) / gravity;
        if (angle <= 1 || angle >= 89) {
            setFailureState({ name: 'ZERO_RANGE', description: `At ${angle}\u00B0, the projectile has near-zero horizontal range.` });
        } else if (angle > 80) {
            setFailureState({ name: 'LARGE_ANGLE', description: `Angle ${angle}\u00B0 sends the projectile nearly straight up — very inefficient for range.` });
        } else if (range > 100) {
            setFailureState({ name: 'OVERSHOOT', description: `Range ${range.toFixed(1)}m exceeds the field. The projectile went out of bounds.` });
        }
    }, [angle, velocity, running, setFailureState]);

    const angleRad = (angle * Math.PI) / 180;
    const timeOfFlight = (2 * velocity * Math.sin(angleRad)) / gravity;
    const range = (velocity ** 2 * Math.sin(2 * angleRad)) / gravity;
    const maxHeight = (velocity ** 2 * Math.sin(angleRad) ** 2) / (2 * gravity);

    const trajectoryPoints = useMemo(() => {
        const points = [];
        const stepCount = 50;
        for (let i = 0; i <= stepCount; i++) {
            const t = (i / stepCount) * timeOfFlight;
            const x = velocity * t * Math.cos(angleRad);
            const y = velocity * t * Math.sin(angleRad) - 0.5 * gravity * Math.pow(t, 2);
            points.push(`${x * 5},${-y * 5}`);
        }
        return `M 0,0 L ${points.join(' L ')}`;
    }, [angle, velocity, timeOfFlight]);

    return (
        <div className="w-full h-full flex flex-col p-8 bg-black/40 backdrop-blur-sm rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'linear-gradient(to right, #6366f1 1px, transparent 1px), linear-gradient(to bottom, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <h2 className="text-2xl font-black text-indigo-400 uppercase tracking-tighter mb-8 z-10">Mechanics Playground</h2>

            <div className="flex-1 grid md:grid-cols-3 gap-8 relative z-10">
                <div className="md:col-span-2 glass-panel border border-indigo-500/20 rounded-[2rem] flex flex-col justify-end p-12 overflow-hidden relative">
                    <div className="absolute top-6 left-8 flex items-center gap-4 text-indigo-300/40 font-bold uppercase tracking-widest text-[10px]">
                        <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" /> Ground Physics ON</div>
                        <div className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500/40" /> Friction OFF</div>
                    </div>

                    <div className="relative h-full w-full flex items-end">
                        <svg className="w-full h-full overflow-visible" viewBox={`0 -250 500 250`}>
                            <path
                                d={trajectoryPoints}
                                fill="none"
                                stroke="rgba(99, 102, 241, 0.15)"
                                strokeWidth="3"
                                strokeDasharray="8 8"
                            />

                            {running && (
                                <motion.path
                                    d={trajectoryPoints}
                                    fill="none"
                                    stroke="#6366f1"
                                    strokeWidth="4"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: Math.max(1, timeOfFlight * 0.5), ease: "linear" }}
                                    className="filter drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                />
                            )}

                            {running && (
                                <circle
                                    r="8"
                                    fill="#fff"
                                    className="filter drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                                >
                                    <animateMotion
                                        dur={`${Math.max(1, timeOfFlight * 0.5)}s`}
                                        repeatCount="1"
                                        path={trajectoryPoints}
                                        rotate="auto"
                                    />
                                </circle>
                            )}

                            <circle cx="0" cy="0" r="12" fill="#1e1b4b" stroke="#6366f1" strokeWidth="4" />
                            <line x1="0" y1="0" x2={Math.cos(angleRad) * 40} y2={-Math.sin(angleRad) * 40} stroke="#6366f1" strokeWidth="6" strokeLinecap="round" />
                        </svg>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="glass-panel p-6 border-indigo-500/20 rounded-2xl bg-indigo-500/5 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                        <div className="relative z-10 flex flex-col">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] block mb-2">Max Height (H)</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-white tabular-nums">{maxHeight.toFixed(2)}</span>
                                <span className="text-sm font-bold text-white/30 uppercase">meters</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 border-blue-500/20 rounded-2xl bg-blue-500/5 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                        <div className="relative z-10 flex flex-col">
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] block mb-2">Horizontal Range (R)</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-white tabular-nums">{range.toFixed(2)}</span>
                                <span className="text-sm font-bold text-white/30 uppercase">meters</span>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 border-cyan-500/20 rounded-2xl bg-cyan-500/5 relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
                        <div className="relative z-10 flex flex-col">
                            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em] block mb-2">Time Of Flight (T)</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-4xl font-black text-white tabular-nums">{timeOfFlight.toFixed(2)}</span>
                                <span className="text-sm font-bold text-white/30 uppercase">seconds</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto glass-panel p-6 border-white/5 rounded-2xl bg-white/[0.02]">
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block mb-1">Fundamental Laws</span>
                        <p className="text-[11px] text-white/40 leading-relaxed italic">
                            Velocity is resolved into components: <br />
                            Vx = v0·cos(θ) <br />
                            Vy = v0·sin(θ) - g·t
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
