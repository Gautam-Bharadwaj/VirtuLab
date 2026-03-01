import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLabStore } from '../../store/useLabStore';

export const PendulumSim: React.FC = () => {
    const { inputs, running } = useLabStore();
    const [angle, setAngle] = useState(0);
    const [time, setTime] = useState(0);

    const length = inputs.length || 2;
    const gravity = inputs.gravity || 9.8;
    const initialAngle = inputs.angle || 45;

    useEffect(() => {
        let interval: any;
        if (running) {
            const startTime = Date.now();
            interval = setInterval(() => {
                const elapsed = (Date.now() - startTime) / 1000;
                setTime(elapsed);
                const omega = Math.sqrt(gravity / length);
                const newAngle = initialAngle * Math.cos(omega * elapsed);
                setAngle(newAngle);
            }, 16);
        } else {
            setAngle(0);
            setTime(0);
        }
        return () => clearInterval(interval);
    }, [running, length, gravity, initialAngle]);

    return (
        <div className="relative w-full h-full flex items-center justify-center p-12">
            <div className="absolute top-10 w-full flex justify-center">
                <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-full text-xs font-mono text-white/60">
                    T = 2π√(L/g) | Period: {(2 * Math.PI * Math.sqrt(length / gravity)).toFixed(3)}s
                </div>
            </div>

            <div className="relative flex flex-col items-center">
                <div className="w-32 h-3 bg-zinc-800 border border-zinc-700 rounded-full z-10" />

                <motion.div
                    style={{
                        transformOrigin: 'top center',
                        rotate: running ? angle : initialAngle
                    }}
                    className="relative flex flex-col items-center pt-0"
                >
                    <div
                        className="w-1 bg-gradient-to-b from-zinc-600 to-zinc-400"
                        style={{ height: `${length * 80}px` }}
                    />
                    <div className="w-12 h-12 -mt-4 bg-gradient-to-br from-orange-400 to-amber-600 rounded-full shadow-[0_0_30px_rgba(249,115,22,0.4)] border-2 border-orange-500/50 flex items-center justify-center">
                        <div className="w-2 h-2 bg-white/40 rounded-full blur-[1px]" />
                    </div>
                </motion.div>
            </div>

            <div className="absolute inset-0 pointer-events-none opacity-5"
                style={{
                    backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            {running && (
                <div className="absolute bottom-10 right-10 glass-panel p-4 border-orange-500/30 rounded-2xl bg-orange-500/5">
                    <div className="text-[10px] uppercase font-bold text-orange-400 mb-1">Electronic Timer</div>
                    <div className="text-2xl font-mono text-white tracking-widest">{time.toFixed(3)}s</div>
                </div>
            )}
        </div>
    );
};
