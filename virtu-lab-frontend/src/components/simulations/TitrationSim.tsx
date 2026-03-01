import React, { useMemo, useEffect } from 'react';
import { useLabStore } from '../../store/useLabStore';
import { motion } from 'framer-motion';

export const TitrationSim: React.FC = () => {
  const { inputs, running, setFailureState } = useLabStore();
  const baseVolume = inputs.baseVolume || 0; // mL

  useEffect(() => {
    if (!running) return;
    if (baseVolume > 40) {
      setFailureState({ name: 'PH_EXTREME', description: `${baseVolume.toFixed(1)}mL of base added \u2014 well past the equivalence point. The solution is now strongly basic.` });
    }
  }, [baseVolume, running, setFailureState]);
  const acidVolume = 25; // mL (Standard)
  const acidConc = 0.1; // Molar (HCl)
  const baseConc = 0.1; // Molar (NaOH)

  const neutralizedVolume = (acidConc * acidVolume) / baseConc;
  const currentPh = useMemo(() => {
    if (!running) return 1.0;

    if (baseVolume < neutralizedVolume) {
      const molesH = (acidConc * acidVolume - baseConc * baseVolume) / 1000;
      const totalVol = (acidVolume + baseVolume) / 1000;
      const concH = molesH / totalVol;
      return -Math.log10(concH);
    } else if (baseVolume === neutralizedVolume) {
      return 7.0;
    } else {
      const molesOH = (baseConc * baseVolume - acidConc * acidVolume) / 1000;
      const totalVol = (acidVolume + baseVolume) / 1000;
      const concOH = molesOH / totalVol;
      const pOH = -Math.log10(concOH);
      return 14 - pOH;
    }
  }, [baseVolume, running]);

  const flaskColor = useMemo(() => {
    if (!running) return 'rgba(255, 255, 255, 0.1)';
    if (currentPh < 8.2) return 'rgba(255, 255, 255, 0.15)';
    const intensity = Math.min((currentPh - 8) * 0.3, 0.8);
    return `rgba(255, 0, 150, ${intensity})`;
  }, [currentPh, running]);

  return (
    <div className="w-full h-full flex flex-col p-8 bg-black/40 backdrop-blur-sm rounded-3xl border border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '110%', x: `${Math.random() * 100}%` }}
            animate={{ y: '-10%' }}
            transition={{ duration: 5 + Math.random() * 5, repeat: Infinity, ease: 'linear' }}
            className="absolute w-8 h-8 rounded-full border border-orange-500/20"
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center justify-center h-full">
        <div className="flex flex-col items-center">
          <div className="relative w-12 h-80 bg-white/5 border-2 border-white/20 rounded-full flex flex-col justify-end overflow-hidden p-2">
            <div className="absolute top-4 left-0 right-0 h-4 border-b border-white/10 flex justify-between px-1 text-[8px] font-bold text-white/30">
              <span>0</span><span>20</span><span>40</span>
            </div>
            <motion.div
              animate={{ height: `${(baseVolume / 50) * 100}%` }}
              className="w-full bg-blue-500/20 border-t-2 border-blue-400 relative"
            >
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-blue-400 whitespace-nowrap">NaOH (Base)</div>
            </motion.div>
          </div>
          <div className="w-2 h-12 bg-white/20 relative">
            {running && baseVolume > 0 && (
              <motion.div
                initial={{ y: 0, opacity: 1, scale: 1 }}
                animate={{ y: 150, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.5, repeat: Infinity, ease: "easeIn" }}
                className="absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full blur-[2px]"
              />
            )}
          </div>

          <div className="relative mt-24">
            <svg width="180" height="200" viewBox="0 0 180 200" fill="none">
              <path d="M60 20 L120 20 L170 180 L10 180 Z" stroke="rgba(255,255,255,0.4)" strokeWidth="4" />
              <motion.path
                animate={{ fill: flaskColor }}
                d="M68 50 L112 50 L160 170 L20 170 Z"
                className="transition-colors duration-1000"
              />
              <text x="90" y="140" textAnchor="middle" fill="white" fillOpacity="0.2" className="text-[10px] font-bold">HCl SOLUTION</text>
            </svg>
          </div>
        </div>

        <div className="flex flex-col gap-6 max-w-md w-full">
          <div className="glass-panel p-8 text-center border-orange-500/20 bg-orange-500/5 rounded-[3rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl group-hover:scale-125 transition-transform" />
            <div className="relative z-10">
              <span className="text-[12px] font-black text-orange-400 uppercase tracking-[0.2em] block mb-2">pH Level Reading</span>
              <motion.div
                key={currentPh}
                initial={{ scale: 0.9, opacity: 0.8 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-8xl font-black text-white"
              >
                {currentPh.toFixed(1)}
              </motion.div>
              <div className="mt-4 flex items-center justify-center gap-4">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${currentPh < 6.5 ? 'border-red-500/50 text-red-400' : currentPh > 7.5 ? 'border-blue-500/50 text-blue-400' : 'border-emerald-500/50 text-emerald-400'}`}>
                  {currentPh < 6.5 ? 'Acidic' : currentPh > 7.5 ? 'Basic' : 'Neutral'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="glass-panel p-6 border-white/10 flex flex-col items-center">
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Base Added</span>
              <div className="text-3xl font-black text-white">{baseVolume.toFixed(2)}<span className="text-sm text-white/30 ml-1">mL</span></div>
            </div>
            <div className="glass-panel p-6 border-white/10 flex flex-col items-center">
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Acid Vol</span>
              <div className="text-3xl font-black text-white">{acidVolume}<span className="text-sm text-white/30 ml-1">mL</span></div>
            </div>
          </div>

          <div className="p-6 glass-panel border-white/5 bg-white/[0.02] rounded-2xl relative">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center shrink-0">
                <img src="/icon_titration.png" alt="Tip" className="w-6 h-6 object-contain" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white mb-1 uppercase tracking-tight">Pro-Tip for End Point</h4>
                <p className="text-[11px] text-white/35 leading-relaxed">
                  Add NaOH slowly near <span className="text-orange-400 font-bold">25.0mL</span>. Phenolphthalein turns a permanent pale pink color exactly when neutralization occurs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
