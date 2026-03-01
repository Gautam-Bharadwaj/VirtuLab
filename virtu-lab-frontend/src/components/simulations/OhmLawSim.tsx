import React, { useEffect } from 'react';
import { useLabStore } from '../../store/useLabStore';
import { motion } from 'framer-motion';

export const OhmLawSim: React.FC = () => {
    const { inputs, running, setFailureState } = useLabStore();
    const voltage = inputs.voltage || 5;
    const resistance = inputs.resistance || 100;

    useEffect(() => {
        if (!running) return;
        const current = (voltage / resistance) * 1000;
        if (resistance < 5) {
            setFailureState({ name: 'SHORT_CIRCUIT', description: `Resistance is only ${resistance}\u03A9 — current approaches infinity. Real circuits would blow a fuse.` });
        } else if (current > 240) {
            setFailureState({ name: 'OVERLOAD', description: `Current is ${current.toFixed(0)}mA — exceeding safe component ratings. Risk of thermal damage.` });
        }
    }, [voltage, resistance, running, setFailureState]);

    const current = (voltage / resistance) * 1000;

    const power = (voltage * current) / 1000;

    const electronCount = Math.min(Math.floor(current / 10) + 2, 20);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-black/40 backdrop-blur-sm rounded-3xl border border-white/5 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, #3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <div className="relative z-10 w-full max-w-4xl grid md:grid-cols-2 gap-12 items-center">
                <div className="relative aspect-square glass-panel rounded-3xl border border-blue-500/20 flex items-center justify-center overflow-hidden p-8">
                    <div className="absolute inset-16 border-4 border-dashed border-white/20 rounded-[2rem]" />

                    {running && Array.from({ length: electronCount }).map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{ offsetDistance: `${(i / electronCount) * 100}%` }}
                            animate={{ offsetDistance: [`${(i / electronCount) * 100}%`, `${(i / electronCount) * 100 + 100}%`] }}
                            transition={{ duration: Math.max(0.5, 5 / (current / 10)), repeat: Infinity, ease: "linear" }}
                            className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_8px_#60a5fa]"
                            style={{ offsetPath: "rect(0% 100% 100% 0% round 2rem)" }}
                        />
                    ))}

                    <div className="relative z-10 flex flex-col items-center gap-12">
                        <div className="relative">
                            <div className="w-32 h-12 bg-amber-900/40 border-2 border-amber-500/50 rounded-lg flex items-center justify-around px-2 shadow-lg">
                                <div className="w-2 h-full bg-red-500/80 rounded-sm" />
                                <div className="w-2 h-full bg-orange-500/80 rounded-sm" />
                                <div className="w-2 h-full bg-violet-500/80 rounded-sm" />
                            </div>
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase text-amber-400 tracking-widest whitespace-nowrap">
                                Resistor ({resistance}Ω)
                            </div>
                        </div>

                        <div className="relative flex flex-col items-center">
                            <motion.div
                                animate={{
                                    backgroundColor: running ? `rgba(255, 243, 150, ${Math.min(power / 2, 1)})` : 'rgba(255,255,255,0.05)',
                                    boxShadow: running ? `0 0 ${power * 10}px rgba(255, 191, 0, ${Math.min(power / 4, 0.5)})` : 'none'
                                }}
                                className="w-20 h-20 rounded-full border-2 border-white/20 flex items-center justify-center text-4xl"
                            >
                                <img src="/icon_ohm_law.png" alt="Lightbulb" className="w-8 h-8 mx-auto" />
                            </motion.div>
                            <div className="absolute -bottom-6 text-[10px] font-black uppercase text-white/40 tracking-widest">
                                Load Indicator
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="glass-panel p-6 border-blue-500/10 rounded-2xl">
                            <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block mb-1">Voltage (V)</span>
                            <span className="text-4xl font-black text-white">{voltage.toFixed(1)}<span className="text-xl text-white/30 ml-1">V</span></span>
                        </div>
                        <div className="glass-panel p-6 border-amber-500/10 rounded-2xl">
                            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest block mb-1">Resistance (R)</span>
                            <span className="text-4xl font-black text-white">{resistance}<span className="text-xl text-white/30 ml-1">Ω</span></span>
                        </div>
                    </div>

                    <div className="glass-panel p-8 border-emerald-500/20 bg-emerald-500/5 rounded-[2rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-110 transition-transform" />
                        <div className="relative z-10">
                            <span className="text-[12px] font-black text-emerald-400 uppercase tracking-[0.2em] block mb-2">Calculated Current (I)</span>
                            <div className="flex items-baseline gap-2">
                                <motion.span
                                    key={current}
                                    initial={{ opacity: 0.5, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-6xl font-black text-white tabular-nums"
                                >
                                    {current.toFixed(2)}
                                </motion.span>
                                <span className="text-2xl font-bold text-emerald-500/60 uppercase">mA</span>
                            </div>
                            <p className="text-xs text-white/40 mt-4 leading-relaxed">
                                Using Ohm's Law formula <span className="text-white/60 font-mono">I = V / R</span>. Current flows from positive to negative terminal.
                            </p>
                        </div>
                    </div>

                    <div className="h-32 glass-panel border-white/5 rounded-2xl p-4 flex flex-col justify-end gap-2 overflow-hidden relative">
                        <div className="absolute top-2 left-3 text-[8px] font-bold text-white/20 uppercase tracking-widest">V-I Linearity Graph</div>
                        <div className="flex-1 border-l border-b border-white/10 relative">
                            <motion.div
                                className="absolute bottom-0 left-0 bg-blue-500 h-0.5 origin-left"
                                animate={{ rotate: - (Math.atan(voltage / resistance / 0.05) * 180) / Math.PI }}
                                style={{ width: '150%' }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
