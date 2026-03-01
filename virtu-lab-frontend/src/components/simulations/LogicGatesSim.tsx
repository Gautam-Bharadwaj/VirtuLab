import React, { useState, useMemo } from 'react';
import { useLabStore } from '../../store/useLabStore';
import { motion } from 'framer-motion';

export const LogicGatesSim: React.FC = () => {
    const { inputs } = useLabStore();
    const gateType = Math.floor(inputs.gateType || 1);

    const [inA, setInA] = useState(false);
    const [inB, setInB] = useState(false);

    const gateNames = ['AND', 'OR', 'NOT', 'NAND', 'NOR'];
    const currentGate = gateNames[gateType - 1] || 'AND';

    const output = useMemo(() => {
        switch (currentGate) {
            case 'AND': return inA && inB;
            case 'OR': return inA || inB;
            case 'NOT': return !inA;
            case 'NAND': return !(inA && inB);
            case 'NOR': return !(inA || inB);
            default: return false;
        }
    }, [currentGate, inA, inB]);

    return (
        <div className="w-full h-full flex flex-col p-6 bg-black/40 backdrop-blur-sm rounded-3xl border border-white/5 relative overflow-hidden">
            <h2 className="text-2xl font-black text-blue-400 uppercase tracking-tighter mb-6 z-10 flex items-center gap-3">
                <img src="/icon_logic_gates.png" alt="Logic Gates" className="w-8 h-8 object-contain inline-block mr-2" /> Digital Logic Sandbox
            </h2>

            <div className="flex-1 grid lg:grid-cols-5 gap-6 items-stretch">
                <div className="lg:col-span-3 relative glass-panel rounded-[2.5rem] border border-blue-500/20 p-8 flex items-center justify-center bg-[#050a15]/60 overflow-hidden shadow-2xl min-h-[400px]">
                    {/* Background Grid */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/5 via-transparent to-indigo-600/5 pointer-events-none" />

                    {/* SVG Wires - Optimized coordinates */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
                        <defs>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="3" result="blur" />
                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                            </filter>
                        </defs>
                        {/* Wire A - From Input Alpha to Top of Gate */}
                        <motion.path
                            d="M 115 110 L 150 110 L 150 140 L 170 140"
                            stroke={inA ? "#60a5fa" : "rgba(59, 130, 246, 0.1)"}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill="none"
                            animate={{ strokeDashoffset: inA ? [20, 0] : 0 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            style={{ filter: inA ? 'url(#glow)' : 'none', strokeDasharray: "8, 8" }}
                        />
                        {/* Connection Glow A */}
                        {inA && <motion.circle cx="170" cy="140" r="3" fill="#60a5fa" filter="url(#glow)" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} />}

                        {/* Wire B - From Input Bravo to Bottom of Gate */}
                        {currentGate !== 'NOT' && (
                            <>
                                <motion.path
                                    d="M 115 190 L 150 190 L 150 160 L 170 160"
                                    stroke={inB ? "#60a5fa" : "rgba(59, 130, 246, 0.1)"}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    fill="none"
                                    animate={{ strokeDashoffset: inB ? [20, 0] : 0 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    style={{ filter: inB ? 'url(#glow)' : 'none', strokeDasharray: "8, 8" }}
                                />
                                {inB && <motion.circle cx="170" cy="160" r="3" fill="#60a5fa" filter="url(#glow)" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} />}
                            </>
                        )}

                        {/* Special case for NOT gate center wire */}
                        {currentGate === 'NOT' && (
                            <motion.path
                                d="M 115 110 L 170 110"
                                stroke={inA ? "#60a5fa" : "rgba(59, 130, 246, 0.1)"}
                                strokeWidth="3"
                                strokeLinecap="round"
                                fill="none"
                                animate={{ strokeDashoffset: inA ? [20, 0] : 0 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                style={{ filter: inA ? 'url(#glow)' : 'none', strokeDasharray: "8, 8" }}
                            />
                        )}

                        {/* Output Wire - From Gate Right to Output Y */}
                        <motion.path
                            d="M 230 150 L 285 150"
                            stroke={output ? "#fbbf24" : "rgba(251, 191, 36, 0.2)"}
                            strokeWidth="3"
                            strokeLinecap="round"
                            fill="none"
                            animate={{ strokeDashoffset: output ? [20, 0] : 0 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            style={{ filter: output ? 'url(#glow)' : 'none', strokeDasharray: "8, 8" }}
                        />
                        {/* Exit Glow */}
                        {output && <motion.circle cx="230" cy="150" r="3" fill="#fbbf24" filter="url(#glow)" animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 2 }} />}
                    </svg>

                    <div className="relative z-10 w-full flex items-center justify-around gap-4">
                        {/* In A/B */}
                        <div className="flex flex-col gap-16">
                            <div className="flex flex-col items-center">
                                <span className={`text-[8px] font-black uppercase tracking-[0.2em] mb-2 ${inA ? 'text-blue-400' : 'text-white/20'}`}>INPUT ALPHA</span>
                                <button
                                    onClick={() => setInA(!inA)}
                                    className={`relative z-20 w-14 h-14 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center font-black text-sm active:scale-90 ${inA ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-black/40 border-white/10 text-white/20 hover:border-white/20'}`}
                                >
                                    {inA ? 'ON' : 'OFF'}
                                </button>
                            </div>
                            {currentGate !== 'NOT' && (
                                <div className="flex flex-col items-center">
                                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] mb-2 ${inB ? 'text-blue-400' : 'text-white/20'}`}>INPUT BRAVO</span>
                                    <button
                                        onClick={() => setInB(!inB)}
                                        className={`relative z-20 w-14 h-14 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center font-black text-sm active:scale-90 ${inB ? 'bg-blue-500/20 border-blue-400 text-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'bg-black/40 border-white/10 text-white/20 hover:border-white/20'}`}
                                    >
                                        {inB ? 'ON' : 'OFF'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Gate */}
                        <div className="flex flex-col items-center z-10">
                            <div className="w-28 h-24 glass-panel border-2 rounded-[2rem] flex items-center justify-center relative bg-black/60 shadow-2xl border-white/10 overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent" />
                                <span className="text-3xl font-black text-white relative z-10 italic tracking-tighter">{currentGate}</span>
                                <div className="absolute bottom-1 w-full text-center text-[6px] font-black text-blue-500/30 tracking-[0.4em]">GATE-MODULE</div>
                            </div>
                        </div>

                        {/* Output */}
                        <div className="flex flex-col items-center">
                            <span className={`text-[8px] font-black uppercase tracking-[0.2em] mb-2 ${output ? 'text-amber-400' : 'text-white/20'}`}>OUTPUT Y</span>
                            <motion.div
                                animate={{
                                    scale: output ? 1.1 : 1,
                                    boxShadow: output ? '0 0 40px rgba(251, 191, 36, 0.3)' : 'none',
                                    borderColor: output ? '#fbbf24' : 'rgba(255,255,255,0.1)'
                                }}
                                className={`relative z-20 w-16 h-16 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${output ? 'bg-amber-400/10' : 'bg-black/40'}`}
                            >
                                <span className={`text-xl font-black transition-colors ${output ? 'text-amber-400' : 'text-white/10'}`}>
                                    {output ? '1' : '0'}
                                </span>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Validation Panels */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <div className="glass-panel p-6 rounded-[2rem] border-white/5 bg-white/[0.01]">
                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-4">Truth Table</h3>
                        <div className="space-y-2">
                            <div className="grid grid-cols-3 text-[8px] font-black text-blue-500/60 uppercase px-2 mb-1">
                                <span>A</span> <span>B</span> <span>Y</span>
                            </div>
                            {[[0, 0], [0, 1], [1, 0], [1, 1]].map(([a, b], i) => {
                                if (currentGate === 'NOT' && b === 1) return null;
                                const res = currentGate === 'AND' ? a && b : currentGate === 'OR' ? a || b : currentGate === 'NOT' ? !a : currentGate === 'NAND' ? !(a && b) : !(a || b);
                                const isActive = (a === (inA ? 1 : 0)) && (currentGate === 'NOT' || (b === (inB ? 1 : 0)));
                                return (
                                    <div key={i} className={`grid grid-cols-3 p-2 rounded-lg border transition-all ${isActive ? 'bg-blue-500/10 border-blue-500/30 text-white' : 'bg-black/20 border-white/5 text-white/20'}`}>
                                        <span className="text-center font-mono text-xs">{a}</span>
                                        <span className="text-center font-mono text-xs">{currentGate === 'NOT' ? '-' : b}</span>
                                        <span className={`text-center font-mono text-xs ${isActive ? 'text-blue-400 font-bold' : ''}`}>{res ? 1 : 0}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="glass-panel p-5 rounded-2xl border-white/5 bg-white/[0.01]">
                        <h4 className="text-[9px] font-black text-white/40 uppercase tracking-[0.3em] mb-2">Boolean Logic</h4>
                        <div className="text-xl font-black text-white/60 font-mono italic">
                            Y = {currentGate === 'AND' ? 'A · B' : currentGate === 'OR' ? 'A + B' : currentGate === 'NOT' ? "A'" : currentGate === 'NAND' ? "(A · B)'" : "(A + B)'"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
