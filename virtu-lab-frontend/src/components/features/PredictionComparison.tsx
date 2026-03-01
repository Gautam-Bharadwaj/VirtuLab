import React from 'react';
import { motion } from 'framer-motion';
import { useLabStore } from '../../store/useLabStore';

export const PredictionComparison: React.FC = () => {
  const { prediction, predictionPhase, setPredictionPhase, experimentDuration } = useLabStore();

  if (predictionPhase !== 'comparison' || !prediction || prediction.userGuess === null) return null;

  const actual = prediction.expected;
  const guess = prediction.userGuess;
  const gap = Math.abs(guess - actual);
  const percentGap = actual !== 0 ? (gap / Math.abs(actual)) * 100 : gap > 0 ? 100 : 0;

  let message: string;
  let messageColor: string;
  let emoji: string;

  if (percentGap <= 10) {
    message = "Excellent prediction!";
    messageColor = "text-emerald-400";
    emoji = "🎯";
  } else if (percentGap <= 30) {
    message = `Close — off by ${percentGap.toFixed(1)}%`;
    messageColor = "text-amber-400";
    emoji = "👍";
  } else {
    const times = (gap / Math.max(Math.abs(actual), 0.001)).toFixed(1);
    message = `Off by ${times}× — let's understand why`;
    messageColor = "text-red-400";
    emoji = "🤔";
  }

  // Normalize bars to max of either value
  const maxVal = Math.max(Math.abs(guess), Math.abs(actual), 0.001);
  const guessPercent = (Math.abs(guess) / maxVal) * 100;
  const actualPercent = (Math.abs(actual) / maxVal) * 100;

  const handleContinue = () => {
    setPredictionPhase(experimentDuration >= 30 ? "report" : "idle");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="w-full max-w-lg mx-4"
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-[#12122a]/98 backdrop-blur-xl shadow-2xl">
          {/* Top accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

          <div className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <span className="text-4xl mb-2 block">{emoji}</span>
              <h3 className={`text-xl font-bold ${messageColor}`}>{message}</h3>
              <p className="text-xs text-white/40 mt-1">Your prediction vs the actual result</p>
            </div>

            {/* Comparison Bars */}
            <div className="space-y-4 mb-8">
              {/* Your Prediction */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-white/50 font-medium">Your Prediction</span>
                  <span className="text-sm font-mono text-blue-300 font-bold">
                    {guess.toFixed(4)} {prediction.unit}
                  </span>
                </div>
                <div className="w-full h-8 bg-white/[0.04] rounded-lg overflow-hidden border border-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${guessPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-end pr-2"
                  >
                    {guessPercent > 20 && (
                      <span className="text-[10px] font-bold text-white/80">
                        {guess.toFixed(3)}
                      </span>
                    )}
                  </motion.div>
                </div>
              </div>

              {/* Actual Result */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-white/50 font-medium">Actual Result</span>
                  <span className="text-sm font-mono text-emerald-300 font-bold">
                    {actual.toFixed(4)} {prediction.unit}
                  </span>
                </div>
                <div className="w-full h-8 bg-white/[0.04] rounded-lg overflow-hidden border border-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${actualPercent}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                    className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-lg flex items-center justify-end pr-2"
                  >
                    {actualPercent > 20 && (
                      <span className="text-[10px] font-bold text-white/80">
                        {actual.toFixed(3)}
                      </span>
                    )}
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Gap display */}
            <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06] text-center mb-6">
              <span className="text-xs text-white/40">Percentage Gap</span>
              <div className={`text-2xl font-bold font-mono mt-1 ${messageColor}`}>
                {percentGap.toFixed(1)}%
              </div>
            </div>

            {/* Continue button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleContinue}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold text-sm shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              {experimentDuration >= 30 ? "Continue to Lab Report →" : "Done ✓"}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
