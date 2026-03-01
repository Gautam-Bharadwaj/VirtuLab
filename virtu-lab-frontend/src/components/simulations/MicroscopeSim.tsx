import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLabStore } from '../../store/useLabStore';

export const MicroscopeSim: React.FC = () => {
    const { inputs, running } = useLabStore();
    const [focus, setFocus] = useState(0.5);

    // Simulation of viewing cells
    const zoom = (inputs.temperature || 37) / 10; // Stealing temp for zoom scale

    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-black">
            <div className="absolute top-10 flex gap-4 z-20">
                <label className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-2">Fine Adjust</label>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={focus}
                    onChange={(e) => setFocus(parseFloat(e.target.value))}
                    className="w-48 accent-emerald-500"
                />
            </div>

            {/* Microscope Viewport */}
            <div className="relative w-[500px] h-[500px] rounded-full border-[20px] border-zinc-900 shadow-[inset_0_0_100px_black,0_0_50px_rgba(0,0,0,0.5)] overflow-hidden bg-[#051505]">
                {/* Cell structures */}
                <motion.div
                    animate={{
                        filter: `blur(${(Math.abs(focus - 0.7) * 20)}px)`,
                        scale: running ? 1.5 + zoom : 1
                    }}
                    className="w-full h-full relative"
                >
                    {/* Bunch of random cells */}
                    {Array.from({ length: 30 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute border border-emerald-500/20 bg-emerald-500/5 rounded-full"
                            style={{
                                width: `${20 + Math.random() * 40}px`,
                                height: `${15 + Math.random() * 30}px`,
                                top: `${10 + Math.random() * 80}%`,
                                left: `${10 + Math.random() * 80}%`,
                                transform: `rotate(${Math.random() * 360}deg)`
                            }}
                        >
                            <div className="w-2 h-2 bg-emerald-400/40 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                        </div>
                    ))}

                    {/* DNA structures if running */}
                    {running && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-1 h-64 bg-emerald-400/10 blur-xl animate-pulse" />
                        </div>
                    )}
                </motion.div>

                {/* Vignette */}
                <div className="absolute inset-0 shadow-[inset_0_0_150px_black] border-[30px] border-black/50 pointer-events-none" />
            </div>

            <div className="mt-8 text-emerald-500/50 font-mono text-[10px] animate-pulse">
                OBJECTIVE: 40X | TOTAL MAGNIFICATION: 400X
            </div>

            {/* Lens reflection overlay */}
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        </div>
    );
};
