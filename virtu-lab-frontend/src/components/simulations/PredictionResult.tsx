import React from 'react';
import { motion } from 'framer-motion';
import { useLabStore } from '../../store/useLabStore';

export const PredictionResult: React.FC = () => {
    const { prediction, predictionActual, closePredictionResult, getPredictionConfig } = useLabStore();
    const config = getPredictionConfig();

    if (prediction === null || predictionActual === null || !config) return null;

    const predicted = prediction;
    const actual = parseFloat(predictionActual.toFixed(2));

    const gap = actual !== 0 ? Math.abs((predicted - actual) / actual) * 100 : Math.abs(predicted - actual);
    const gapPercent = parseFloat(gap.toFixed(1));
    const ratio = actual !== 0 ? Math.abs(predicted / actual) : 0;

    let rating: 'excellent' | 'close' | 'off';
    let ratingLabel: string;
    let ratingColor: string;
    let ratingBg: string;

    if (gapPercent <= 10) {
        rating = 'excellent';
        ratingLabel = 'Excellent prediction!';
        ratingColor = 'text-emerald-400';
        ratingBg = 'from-emerald-500/20 to-teal-500/10';
    } else if (gapPercent <= 30) {
        rating = 'close';
        ratingLabel = `Close — off by ${gapPercent}%`;
        ratingColor = 'text-amber-400';
        ratingBg = 'from-amber-500/20 to-orange-500/10';
    } else {
        rating = 'off';
        ratingLabel = `Off by ${ratio.toFixed(1)}x — let's understand why`;
        ratingColor = 'text-rose-400';
        ratingBg = 'from-rose-500/20 to-red-500/10';
    }

    const maxVal = Math.max(Math.abs(predicted), Math.abs(actual), 0.001);
    const predictedWidth = (Math.abs(predicted) / maxVal) * 100;
    const actualWidth = (Math.abs(actual) / maxVal) * 100;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center pointer-events-auto"
        >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={closePredictionResult} />

            <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 30 }}
                transition={{ type: 'spring', damping: 22, stiffness: 260 }}
                className="relative w-full max-w-lg mx-4 rounded-3xl border border-white/10 overflow-hidden shadow-2xl"
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${ratingBg} pointer-events-none`} />
                <div className="absolute inset-0 bg-[#0d0d20]/90" />

                <div className="relative z-10 p-8">
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-4`}
                        >
                            <div className={`w-2 h-2 rounded-full ${rating === 'excellent' ? 'bg-emerald-400' : rating === 'close' ? 'bg-amber-400' : 'bg-rose-400'} animate-pulse`} />
                            <span className={`text-xs font-black uppercase tracking-widest ${ratingColor}`}>
                                {rating === 'excellent' ? 'Spot On' : rating === 'close' ? 'Almost There' : 'Learning Moment'}
                            </span>
                        </motion.div>
                        <h2 className={`text-2xl font-black ${ratingColor}`}>
                            {ratingLabel}
                        </h2>
                    </div>

                    <div className="space-y-5 mb-8">
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Your Prediction</span>
                                <span className="text-sm font-mono font-bold text-white">{predicted} <span className="text-white/30">{config.unit}</span></span>
                            </div>
                            <div className="h-8 bg-white/[0.04] rounded-xl overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${predictedWidth}%` }}
                                    transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-end pr-2"
                                >
                                    <span className="text-[9px] font-bold text-white/80">{predicted}</span>
                                </motion.div>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Actual Result</span>
                                <span className="text-sm font-mono font-bold text-white">{actual} <span className="text-white/30">{config.unit}</span></span>
                            </div>
                            <div className="h-8 bg-white/[0.04] rounded-xl overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${actualWidth}%` }}
                                    transition={{ delay: 0.5, duration: 0.8, ease: 'easeOut' }}
                                    className={`h-full bg-gradient-to-r ${rating === 'excellent' ? 'from-emerald-500 to-teal-500' : rating === 'close' ? 'from-amber-500 to-orange-500' : 'from-rose-500 to-red-500'} rounded-xl flex items-center justify-end pr-2`}
                                >
                                    <span className="text-[9px] font-bold text-white/80">{actual}</span>
                                </motion.div>
                            </div>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className="flex items-center justify-center gap-3 py-3 rounded-xl bg-white/[0.03] border border-white/5"
                        >
                            <span className="text-xs text-white/40">Gap:</span>
                            <span className={`text-lg font-black ${ratingColor} tabular-nums`}>{gapPercent}%</span>
                        </motion.div>
                    </div>

                    {rating !== 'excellent' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="mb-6 px-5 py-4 rounded-2xl bg-gradient-to-r from-blue-500/[0.06] to-indigo-500/[0.06] border border-blue-500/[0.1]"
                        >
                            <div className="flex items-start gap-3">
                                <img src="/icon_ai_tutor.png" alt="AI" className="w-5 h-5 object-contain mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Why the gap?</p>
                                    <p className="text-sm text-white/70 leading-relaxed">
                                        {config.hintOnGap(predicted, actual)}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={closePredictionResult}
                        className="w-full h-12 bg-white/[0.06] border border-white/10 rounded-xl text-white/70 hover:text-white font-bold text-xs uppercase tracking-widest hover:bg-white/[0.1] transition-all"
                    >
                        Continue to Results
                    </motion.button>
                </div>
            </motion.div>
        </motion.div>
    );
};
