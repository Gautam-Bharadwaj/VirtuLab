import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLabStore } from '../../store/useLabStore';

export const GravitySim: React.FC = () => {
    const { inputs, running } = useLabStore();
    const [orbits, setOrbits] = useState<{ x: number, y: number }[]>([]);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    const mass = inputs.planetMass || 100;
    const distance = inputs.objectDistance || 50;

    useEffect(() => {
        let interval: any;
        if (running) {
            let angle = 0;
            const speed = Math.sqrt(mass / distance) * 0.05;

            interval = setInterval(() => {
                angle += speed;
                const x = Math.cos(angle) * (distance * 2);
                const y = Math.sin(angle) * (distance * 1.2); // Elliptical
                setPos({ x, y });
                setOrbits(prev => [...prev.slice(-50), { x, y }]);
            }, 16);
        } else {
            setOrbits([]);
            setPos({ x: distance * 2, y: 0 });
        }
        return () => clearInterval(interval);
    }, [running, mass, distance]);

    return (
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-black/20">
            <div className="absolute top-10 flex gap-4">
                <div className="glass-panel px-4 py-2 border-rose-500/20 text-[10px] text-rose-400 font-bold uppercase tracking-widest">
                    Gravitational Force: {((mass * 10) / Math.pow(distance / 10, 2)).toFixed(2)} N
                </div>
            </div>

            <div className="relative">
                <div
                    className="w-16 h-16 bg-gradient-to-br from-rose-500 to-red-900 rounded-full shadow-[0_0_60px_rgba(244,63,94,0.4)] z-10 relative flex items-center justify-center"
                    style={{ transform: `scale(${1 + mass / 200})` }}
                >
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-30 rounded-full" />
                </div>

                <svg className="absolute inset-0 w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <polyline
                        points={orbits.map(p => `${400 + p.x},${400 + p.y}`).join(' ')}
                        fill="none"
                        stroke="rgba(251, 113, 133, 0.2)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                    />
                </svg>

                <motion.div
                    className="absolute w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white] z-20"
                    style={{
                        x: pos.x - 8,
                        y: pos.y - 8,
                    }}
                />
            </div>

            <div className="absolute inset-0 pointer-events-none opacity-20">
                {Array.from({ length: 50 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute w-0.5 h-0.5 bg-white rounded-full bubble"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
