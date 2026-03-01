import React, { useState, useMemo } from 'react';
import { useLabStore } from '../../store/useLabStore';
import { motion } from 'framer-motion';

export const LogicGatesSim: React.FC = () => {
    const { inputs, running } = useLabStore();
    const gateType = Math.floor(inputs.gateType || 1);

    const [inA, setInA] = useState(false);
    const [inB, setInB] = useState(false);

    const gateNames = ['AND', 'OR', 'NOT', 'NAND', 'NOR'];
    const currentGate = gateNames[gateType - 1] || 'AND';

    const output = useMemo(() => {
        if (!running) return false;
        switch (currentGate) {
            case 'AND': return inA && inB;
            case 'OR': return inA || inB;
            case 'NOT': return !inA;
            case 'NAND': return !(inA && inB);
            case 'NOR': return !(inA || inB);
            default: return false;
        }
    }, [currentGate, inA, inB, running]);

    return (
        <div className="w-full h-full flex flex-col p-8 bg-black/40 backdrop-blur-sm rounded-3xl border border-white/5 relative overflow-hidden">
            <h2 className="text-2xl font-black text-blue-400 uppercase tracking-tighter mb-8 z-10 flex items-center gap-3">
                <img src="/icon_logic_gates.png" alt="Logic Gates" className="w-8 h-8 object-contain inline-block mr-2" /> Digital Logic Sandbox
            </h2>

            <div className="flex-1 grid md:grid-cols-2 gap-12 items-center">
                <div className="relative glass-panel rounded-[3rem] border border-blue-500/10 h-full p-12 flex flex-col items-center justify-center bg-[#050a15]/40 overflow-hidden">
                    <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />

                    <div className="absolute left-1/4 top-1/2 -translate-y-12 w-1/4 h-0.5 bg-blue-500/20" />
                    <div className="absolute left-1/4 top-1/2 translate-y-12 w-1/4 h-0.5 bg-blue-500/20" />
                    <div className="absolute right-1/4 top-1/2 w-1/4 h-0.5 bg-blue-500/20" />

                    <div className="relative z-10 flex w-full items-center justify-between gap-12 h-64">
                        <div className="flex flex-col gap-20">
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">Input A</span>
                                <button
                                    onClick={() => setInA(!inA)}
                                    className={`w-14 h-14 rounded-2xl border-2 transition-all flex items-center justify-center font-black text-xl shadow-lg active:scale-95 ${inA ? 'bg-blue-500 border-blue-400 text-white shadow-blue-500/40' : 'bg-white/5 border-white/10 text-white/20 hover:border-white/20'}`}
                                >
                                    {inA ? '1' : '0'}
                                </button>
                            </div>
                            {currentGate !== 'NOT' && (
                                <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">Input B</span>
                                    <button
                                        onClick={() => setInB(!inB)}
                                        className={`w-14 h-14 rounded-2xl border-2 transition-all flex items-center justify-center font-black text-xl shadow-lg active:scale-95 ${inB ? 'bg-blue-500 border-blue-400 text-white shadow-blue-500/40' : 'bg-white/5 border-white/10 text-white/20 hover:border-white/20'}`}
                                    >
                                        {inB ? '1' : '0'}
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex-1 flex flex-col items-center">
                            <div className="w-32 h-24 glass-panel border-2 border-white/10 rounded-2xl flex items-center justify-center relative group bg-white/[0.02]">
                                <div className="absolute -inset-2 bg-blue-500/5 blur-xl group-hover:bg-blue-500/10 transition-colors" />
                                <span className="text-4xl font-black text-white relative z-10">{currentGate}</span>
                            </div>
                            <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.3em] mt-4">Active Logic</span>
                        </div>

                        <div className="flex flex-col items-center">
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-2">Output (Y)</span>
                            <motion.div
                                animate={{
                                    scale: output ? 1.05 : 1,
                                    backgroundColor: output ? 'rgba(59, 130, 246, 0.4)' : 'transparent',
                                    boxShadow: output ? '0 0 50px rgba(59, 130, 246, 0.3)' : 'inset 0 0 10px rgba(255,255,255,0.05)'
                                }}
                                className={`w-24 h-24 rounded-full border-2 flex items-center justify-center text-4xl shadow-xl transition-colors duration-500 border-white/10`}
                            >
                                {output ? <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]" /> : <div className="w-4 h-4 rounded-full bg-white/10" />}
                            </motion.div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6 w-full">
                    <div className="glass-panel p-8 border-white/5 rounded-[2rem] bg-white/[0.01]">
                        <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em] mb-6">Truth Table Validation</h3>
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 text-[10px] font-black text-blue-500/60 uppercase tracking-widest px-4 mb-2">
                                <span>Input A</span> <span>Input B</span> <span>Output</span>
                            </div>

                            {[[0, 0], [0, 1], [1, 0], [1, 1]].map(([a, b], i) => {
                                if (currentGate === 'NOT' && b === 1) return null;

                                const res = currentGate === 'AND' ? a && b : currentGate === 'OR' ? a || b : currentGate === 'NOT' ? !a : currentGate === 'NAND' ? !(a && b) : !(a || b);
                                const isActive = (a === (inA ? 1 : 0)) && (currentGate === 'NOT' || (b === (inB ? 1 : 0)));

                                return (
                                    <div key={i} className={`grid grid-cols-3 p-3 rounded-xl border transition-all ${isActive ? 'bg-blue-500/10 border-blue-500/30 text-white scale-[1.02] shadow-lg shadow-blue-500/5' : 'bg-white/[0.02] border-white/5 text-white/30'}`}>
                                        <span className="font-mono font-bold text-center">{a}</span>
                                        <span className="font-mono font-bold text-center">{currentGate === 'NOT' ? '-' : b}</span>
                                        <span className="font-mono font-bold text-center text-blue-400">{res ? 1 : 0}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="glass-panel p-6 border-white/5 rounded-2xl bg-white/[0.01] relative overflow-hidden group">
                        <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-500/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                        <h4 className="text-xs font-bold text-white mb-2 uppercase tracking-wide">Boolean Expression</h4>
                        <div className="text-2xl font-black text-white/60 font-mono tracking-tighter">
                            Y = {currentGate === 'AND' ? 'A · B' : currentGate === 'OR' ? 'A + B' : currentGate === 'NOT' ? "A'" : currentGate === 'NAND' ? "(A · B)'" : "(A + B)'"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
