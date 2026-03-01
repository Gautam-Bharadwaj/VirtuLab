import React from 'react';
import { motion } from 'framer-motion';
import { useLabStore } from '../../store/useLabStore';

export const TitrationSim: React.FC = () => {
  const { inputs } = useLabStore();

  // Base volume usually comes from a slider in the sidebar inputs
  const baseVolume = inputs.baseVolume || 0;

  // Equivalence point logic
  const eqPoint = 25.0;
  const ph = baseVolume < eqPoint
    ? 1 + (baseVolume / eqPoint) * 6
    : 7 + (baseVolume - eqPoint) * 1.5;

  // Color logic
  const solutionColor = baseVolume > 24.5
    ? baseVolume > 25.5 ? 'bg-pink-500/60' : 'bg-pink-300/40'
    : 'bg-blue-100/10';

  return (
    <div className="relative w-full h-full flex items-center justify-center p-12">
      <div className="absolute top-10 flex gap-4">
        <div className="glass-panel px-6 py-2 border-emerald-500/20 rounded-full flex gap-3 text-xs font-bold">
          <span className="text-white/40 uppercase tracking-widest">Indicator:</span>
          <span className="text-pink-400">Phenolphthalein</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* Burette */}
        <div className="relative w-8 h-[300px] border-2 border-white/20 rounded-b-lg bg-white/5 flex flex-col justify-end overflow-hidden">
          {/* Base Liquid */}
          <motion.div
            className="w-full bg-blue-300/30"
            style={{ height: `${100 - (baseVolume * 2)}%` }}
          />
          {/* Scale marks */}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="absolute w-2 h-0.5 bg-white/40 right-0" style={{ bottom: `${i * 10}%` }} />
          ))}
        </div>

        {/* Tap */}
        <div className="w-12 h-4 bg-zinc-800 rounded-sm -mt-1 z-10" />

        {/* Conical Flask */}
        <div className="relative w-48 h-64 mt-4">
          {/* Flask Outline */}
          <svg viewBox="0 0 100 120" className="w-full h-full fill-none stroke-white/20 stroke-1 overflow-visible">
            <path d="M 40 10 L 40 40 L 10 110 Q 10 120 20 120 L 80 120 Q 90 120 90 110 L 60 40 L 60 10 Z" />

            {/* Solution inside */}
            <motion.path
              d={`M ${40 + (100 - ph * 2) / 10} 120 L ${60 - (100 - ph * 2) / 10} 120 L 70 60 L 30 60 Z`}
              className={`${solutionColor} transition-colors duration-500`}
              style={{ opacity: 0.6 }}
            />
          </svg>

          {/* Reflection */}
          <div className="absolute top-10 left-1/4 w-4 h-32 bg-white/5 rounded-full blur-xl" />
        </div>
      </div>

      {/* Real-time pH Meter */}
      <div className="absolute bottom-10 right-10 glass-panel p-6 border-emerald-500/30 rounded-3xl bg-emerald-500/5 min-w-[200px]">
        <div className="text-[10px] uppercase font-bold text-emerald-400 mb-2 tracking-widest">pH Monitoring System</div>
        <div className="flex items-end gap-2">
          <div className="text-5xl font-mono text-white leading-none">{ph.toFixed(2)}</div>
          <div className="text-xs text-white/40 mb-1">pH</div>
        </div>
        <div className="mt-4 w-full h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-red-500 via-green-500 to-purple-500"
            style={{ width: `${(ph / 14) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
