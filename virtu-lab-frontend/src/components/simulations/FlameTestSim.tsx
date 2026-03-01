import React from 'react';
import { useLabStore } from '../../store/useLabStore';
import { motion } from 'framer-motion';

export const FlameTestSim: React.FC = () => {
    const { inputs, running } = useLabStore();
    const elementIdx = Math.floor(inputs.elementIdx || 0);

    const metalSamples = [
        { name: 'Lithium (Li)', ion: 'Li+', color: 'rgb(255, 0, 50)', hex: '#FF0032', intensity: 0.8 },
        { name: 'Sodium (Na)', ion: 'Na+', color: 'rgb(255, 180, 0)', hex: '#FFB400', intensity: 1.0 },
        { name: 'Potassium (K)', ion: 'K+', color: 'rgb(200, 100, 255)', hex: '#C864FF', intensity: 0.5 },
        { name: 'Calcium (Ca)', ion: 'Ca2+', color: 'rgb(255, 100, 0)', hex: '#FF6400', intensity: 0.7 },
        { name: 'Strontium (Sr)', ion: 'Sr2+', color: 'rgb(255, 0, 0)', hex: '#FF0000', intensity: 0.9 },
        { name: 'Barium (Ba)', ion: 'Ba2+', color: 'rgb(150, 255, 50)', hex: '#96FF32', intensity: 0.6 },
        { name: 'Copper (Cu)', ion: 'Cu2+', color: 'rgb(0, 255, 180)', hex: '#00FFB4', intensity: 0.7 },
    ];

    const activeSample = metalSamples[elementIdx] || metalSamples[0];
    const flameColor = running ? activeSample.color : 'rgb(100, 200, 255, 0.4)'; // Blue Bunsen Flame

    return (
        <div className="w-full h-full flex flex-col p-8 bg-[#050510] rounded-3xl border border-white/5 relative overflow-hidden">
            <h2 className="text-2xl font-black text-rose-400 uppercase tracking-tighter mb-8 z-10 flex items-center gap-3">
                <img src="/icon_flame_test.png" alt="Flame Test" className="w-8 h-8 object-contain inline-block mr-2" /> Emission Spectroscopy & Flame Test
            </h2>

            <div className="flex-1 flex flex-col md:flex-row gap-12 items-center justify-center relative z-10">
                <div className="relative w-full md:w-[500px] h-[500px] flex flex-col items-center justify-end overflow-hidden p-12 glass-panel border border-white/5 rounded-[3rem] bg-[#000010]/60">
                    <div className="absolute inset-x-0 bottom-0 top-[60%] bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none" />

                    <div className="relative w-12 h-40 bg-gradient-to-r from-zinc-700 to-zinc-800 border-x border-zinc-500/20 rounded-t-sm z-20">
                        <div className="absolute inset-x-0 bottom-4 h-1 bg-zinc-600/50" />
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-24 h-8 bg-zinc-800 border-2 border-zinc-700/50 rounded-lg shadow-xl" />
                    </div>

                    <div className="relative w-32 h-[350px] mb-[-40px] z-10 flex items-end justify-center pointer-events-none">
                        <motion.div
                            animate={{
                                backgroundColor: flameColor,
                                boxShadow: `0 -50px 100px ${activeSample.hex}${running ? 'bb' : '33'}`,
                                height: running ? [280, 300, 290] : [200, 210, 205],
                                scaleX: [1, 1.05, 0.98],
                            }}
                            transition={{ duration: 0.1, repeat: Infinity, ease: 'linear' }}
                            className="absolute w-20 h-72 rounded-full blur-[30px] opacity-40 mix-blend-screen"
                        />

                        <motion.div
                            animate={{ height: [120, 130, 125], scaleX: [1, 1.1, 0.9] }}
                            transition={{ duration: 0.1, repeat: Infinity }}
                            className="absolute w-12 h-32 bg-blue-300/40 rounded-full blur-xl z-10"
                        />

                        {running && Array.from({ length: 12 }).map((_, i) => (
                            <motion.div
                                key={i}
                                initial={{ y: 0, opacity: 1, x: 0 }}
                                animate={{ y: -300, opacity: 0, x: (Math.random() - 0.5) * 80 }}
                                transition={{ duration: 1.5 + Math.random(), repeat: Infinity, ease: 'easeOut', delay: Math.random() }}
                                style={{ backgroundColor: activeSample.hex }}
                                className="absolute w-1.5 h-1.5 rounded-full blur-[1px]"
                            />
                        ))}
                    </div>

                    {running && (
                        <motion.div
                            initial={{ x: -300, y: -200 }}
                            animate={{ x: 0, y: -250 }}
                            className="absolute z-30"
                        >
                            <div className="w-1.5 h-64 bg-zinc-400 border border-zinc-500/20 rounded-full relative shadow-lg">
                                <motion.div
                                    animate={{ boxShadow: `0 0 20px ${activeSample.hex}` }}
                                    className="absolute bottom-0 left-[-6px] w-5 h-5 rounded-full border-4 border-zinc-400 flex items-center justify-center p-1 bg-zinc-800"
                                >
                                    <div className="w-full h-full rounded-full" style={{ backgroundColor: activeSample.hex }} />
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="flex flex-col gap-6 w-full max-w-sm">
                    <div className="glass-panel p-8 border-rose-500/20 bg-rose-500/5 rounded-[2rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
                        <div className="relative z-10">
                            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest block mb-4">Identification Results</span>
                            <h4 className="text-2xl font-black text-white mb-2">{activeSample.name}</h4>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-rose-500 font-mono text-sm">{activeSample.ion}</span>
                                <span className="text-white/20 text-xs">| Characteristic Flame: {metalSamples[elementIdx].hex}</span>
                            </div>

                            <div className="p-4 bg-white/[0.03] border border-white/5 rounded-2xl flex flex-col items-center">
                                <div className="text-[9px] text-white/30 uppercase font-black tracking-widest mb-1">Metal Characteristic</div>
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full shadow-inner" style={{ backgroundColor: activeSample.hex }} />
                                    <span className="text-white/80 text-sm font-bold uppercase tracking-tight">{activeSample.name.split(' (')[0]} Color</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 border-white/5 rounded-2xl bg-white/[0.01]">
                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-3">Analysis Tip</h4>
                        <p className="text-xs text-white/30 leading-relaxed italic">
                            Metal ions emit specific wavelengths of light when electrons are excited by heat energy and jump between shell levels.
                            <br /><br />
                            <span className="text-rose-400/60 font-medium">E = hν = hc/λ</span>
                        </p>
                    </div>

                    <div className="glass-panel p-4 border-white/5 rounded-2xl flex flex-col">
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-widest block mb-3">Next Metal Sample</span>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                            {metalSamples.map((sample, i) => (
                                <div key={i} className={`w-8 h-8 rounded-full flex-shrink-0 border-2 transition-all p-0.5 ${elementIdx === i ? 'border-orange-500 scale-110 shadow-lg shadow-orange-500/20' : 'border-white/10 opacity-40 hover:opacity-80'}`}>
                                    <div className="w-full h-full rounded-full" style={{ backgroundColor: sample.hex }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
