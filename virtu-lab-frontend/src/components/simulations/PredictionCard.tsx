import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLabStore } from '../../store/useLabStore';

export const PredictionCard: React.FC = () => {
    const { inputs, getPredictionConfig, submitPrediction, skipPrediction, startExperiment } = useLabStore();
    const [value, setValue] = useState('');
    const config = getPredictionConfig();

    if (!config) return null;

    const question = config.question(inputs);

    const handleSubmit = () => {
        const num = parseFloat(value);
        if (isNaN(num)) return;
        submitPrediction(num);
    };

    const handleSkip = () => {
        skipPrediction();
        startExperiment();
    };

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 260 }}
            className="absolute bottom-0 left-0 right-0 z-50 pointer-events-auto"
        >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent backdrop-blur-md rounded-t-3xl" />

            <div className="relative px-8 py-7 flex flex-col gap-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/30 to-amber-500/20 border border-orange-500/20 flex items-center justify-center shadow-lg shadow-orange-500/10">
                        <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white uppercase tracking-wider">Predict Before You Start</h3>
                        <p className="text-[10px] text-white/40 font-medium">Make a hypothesis — then test it!</p>
                    </div>
                </div>

                <p className="text-sm text-white/80 leading-relaxed pl-1">{question}</p>

                <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                        <input
                            type="number"
                            step="any"
                            placeholder="Enter your prediction..."
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            className="w-full bg-white/[0.06] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.08] transition-all font-mono"
                            autoFocus
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-white/30">{config.unit}</span>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={handleSubmit}
                        disabled={!value || isNaN(parseFloat(value))}
                        className="h-12 px-6 bg-orange-500 text-black font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-orange-500/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 transition-opacity"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                        Submit & Start
                    </motion.button>

                    <button
                        onClick={handleSkip}
                        className="h-12 px-5 rounded-xl border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/5 text-xs font-bold uppercase tracking-widest transition-all"
                    >
                        Skip
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
