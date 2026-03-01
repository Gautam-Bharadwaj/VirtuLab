import React from 'react';
import { useLabStore } from '../../store/useLabStore';
import { motion, AnimatePresence } from 'framer-motion';

export const OpticsSim: React.FC = () => {
    const { inputs, running } = useLabStore();
    const focalLength = inputs.focalLength || 20; // f in cm
    const u = inputs.objectDistance || 40; // u (object distance) in cm
    const u_signed = -u;
    const v = (focalLength * u_signed) / (focalLength + u_signed); // Image distance
    const magnification = v / u_signed;

    const scale = 4;
    const centerX = 250;
    const centerY = 150;

    const objX = centerX - u * scale;
    const imgX = centerX + v * scale;
    const objHeight = 40;
    const imgHeight = objHeight * magnification;

    return (
        <div className="w-full h-full flex flex-col p-8 bg-black/40 backdrop-blur-sm rounded-3xl border border-white/5 relative overflow-hidden">
            <h2 className="text-2xl font-black text-cyan-400 uppercase tracking-tighter mb-8 z-10">Optics Bench Experiment</h2>

            <div className="flex-1 glass-panel border border-cyan-500/10 rounded-[2rem] relative overflow-hidden bg-[#050510]/50">
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10 dash-sm" style={{ backgroundImage: 'linear-gradient(to right, white 2px, transparent 2px)', backgroundSize: '10px 1px' }} />

                <div className="absolute bottom-4 left-0 right-0 flex justify-between px-8 text-[8px] font-mono text-white/20">
                    {Array.from({ length: 11 }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className="h-2 w-px bg-white/10 mb-1" />
                            {i * 20}cm
                        </div>
                    ))}
                </div>

                <div className="relative h-full w-full flex items-center justify-center">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 300">
                        <line x1="0" y1={centerY} x2="500" y2={centerY} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                        <path
                            d="M 250,50 Q 270,150 250,250 Q 230,150 250,50"
                            fill="rgba(100, 200, 255, 0.2)"
                            stroke="rgba(100, 200, 255, 0.6)"
                            strokeWidth="2"
                        />
                        <text x="250" y="40" textAnchor="middle" fill="rgba(100, 200, 255, 0.4)" className="text-[10px] font-bold uppercase tracking-widest">Convex Lens</text>

                        <circle cx={centerX - focalLength * scale} cy={centerY} r="2" fill="#ff5555" opacity="0.5" />
                        <circle cx={centerX + focalLength * scale} cy={centerY} r="2" fill="#ff5555" opacity="0.5" />
                        <text x={centerX - focalLength * scale} y={centerY + 15} textAnchor="middle" fill="#ff5555" opacity="0.3" fontSize="8">F1</text>
                        <text x={centerX + focalLength * scale} y={centerY + 15} textAnchor="middle" fill="#ff5555" opacity="0.3" fontSize="8">F2</text>

                        <g transform={`translate(${objX}, ${centerY})`}>
                            <motion.line x1="0" y1="0" x2="0" y2={-objHeight} stroke="#fff" strokeWidth="4" strokeLinecap="round" />
                            <motion.path
                                d="M -4,-objHeight Q 0,-objHeight-15 4,-objHeight T 0,-objHeight"
                                fill="#ffaa00"
                                animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.1, 1] }}
                                transition={{ duration: 0.5, repeat: Infinity }}
                            />
                            <text x="0" y="20" textAnchor="middle" fill="white" fillOpacity="0.4" className="text-[8px] font-black tracking-tighter">OBJECT</text>
                        </g>

                        {running && (
                            <g>
                                <motion.line
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                    x1={objX} y1={centerY - objHeight} x2={imgX} y2={centerY + imgHeight}
                                    stroke="rgba(255,255,255,0.3)" strokeWidth="1" strokeDasharray="4 2"
                                />
                                <motion.polyline
                                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                                    points={`${objX},${centerY - objHeight} ${centerX},${centerY - objHeight} ${imgX},${centerY + imgHeight}`}
                                    fill="none" stroke="rgba(0,255,255,0.3)" strokeWidth="1" strokeDasharray="4 2"
                                />
                            </g>
                        )}

                        {running && v > 0 && (
                            <AnimatePresence>
                                <motion.g
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transform={`translate(${imgX}, ${centerY})`}
                                >
                                    <line x1="0" y1="0" x2="0" y2={imgHeight} stroke="rgba(0,255,255,0.5)" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 1" />
                                    <circle cx="0" cy={imgHeight} r="4" fill="rgba(0,255,255,0.6)" />
                                    <text x="0" y={imgHeight > 0 ? imgHeight + 15 : imgHeight - 15} textAnchor="middle" fill="rgba(0,255,255,0.4)" className="text-[8px] font-black tracking-tighter uppercase whitespace-nowrap">
                                        Real & Inverted Image
                                    </text>
                                </motion.g>
                            </AnimatePresence>
                        )}

                        {running && v < 0 && (
                            <motion.g transform={`translate(${centerX + v * scale}, ${centerY})`}>
                                <line x1="0" y1="0" x2="0" y2={-Math.abs(imgHeight)} stroke="rgba(255,100,100,0.5)" strokeWidth="2" strokeDasharray="5 5" />
                                <text x="0" y={-Math.abs(imgHeight) - 10} textAnchor="middle" fill="rgba(255,100,100,0.4)" className="text-[8px] font-black tracking-tighter uppercase">
                                    Virtual & Erect Image
                                </text>
                            </motion.g>
                        )}
                    </svg>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="glass-panel p-4 border-white/5 rounded-2xl flex flex-col">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Object Distance (u)</span>
                    <span className="text-2xl font-black text-white">-{u}<span className="text-xs text-white/30 ml-1">cm</span></span>
                </div>
                <div className="glass-panel p-4 border-white/5 rounded-2xl flex flex-col">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Image Distance (v)</span>
                    <span className="text-2xl font-black text-white">{v.toFixed(1)}<span className="text-xs text-white/30 ml-1">cm</span></span>
                </div>
                <div className="glass-panel p-4 border-white/5 rounded-2xl flex flex-col">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Magnification (m)</span>
                    <span className="text-2xl font-black text-white">{magnification.toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};
