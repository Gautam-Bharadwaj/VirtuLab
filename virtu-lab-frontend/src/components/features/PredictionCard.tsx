import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLabStore, generatePrediction } from '../../store/useLabStore';

export const PredictionCard: React.FC = () => {
  const { activeLab, inputs, predictionPhase, setPrediction, submitPrediction, startExperiment } = useLabStore();
  const [guess, setGuess] = useState('');

  if (predictionPhase !== 'predict') return null;

  const pred = generatePrediction(activeLab, inputs);

  const handleSubmitAndStart = () => {
    const numGuess = parseFloat(guess);
    if (isNaN(numGuess)) return;
    setPrediction(pred);
    submitPrediction(numGuess);
    // Update the prediction with the guess before starting
    useLabStore.setState({
      prediction: { ...pred, userGuess: numGuess },
    });
    startExperiment();
  };

  const handleSkip = () => {
    setPrediction(null);
    startExperiment();
  };

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="absolute bottom-4 left-4 right-4 z-30"
    >
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[#12122a]/95 backdrop-blur-xl shadow-2xl shadow-black/40">
        {/* Gradient accent */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/20">
              <span className="text-xl">🎯</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Predict Before You Do</h3>
              <p className="text-[11px] text-white/40">Make a hypothesis before running the experiment</p>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06] mb-4">
            <p className="text-sm text-blue-300 leading-relaxed">{pred.question}</p>
          </div>

          {/* Input */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 relative">
              <input
                type="number"
                step="any"
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                placeholder="Enter your prediction..."
                className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 outline-none focus:border-blue-500/40 focus:ring-1 focus:ring-blue-500/20 transition-colors"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmitAndStart();
                }}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/30 font-mono">
                {pred.unit}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSubmitAndStart}
              disabled={!guess.trim()}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span>🚀</span> Submit & Start
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSkip}
              className="px-6 py-3 rounded-xl bg-white/[0.04] text-white/50 font-medium text-sm border border-white/[0.06] hover:bg-white/[0.08] hover:text-white/70 transition-all"
            >
              Skip →
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
