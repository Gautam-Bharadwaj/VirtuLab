import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore } from '../../store/useLabStore';
import { useSessionStore } from '../../store/sessionStore';

interface ChallengeData {
  description: string;
  metric: string;
  targetValue: number;
  tolerance: number;
  fixedInputs?: Record<string, number>;
  proof: string;
}

export const ChallengePanel: React.FC = () => {
  const {
    predictionPhase,
    setPredictionPhase,
    activeLab,
    inputs,
    challengeState,
    setChallengeState,
    incrementChallengeAttempt,
    completeChallenge,
  } = useLabStore();

  const [liveValue, setLiveValue] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load a random challenge for the current lab
  const loadChallenge = useCallback(async () => {
    try {
      const res = await fetch('/offline_challenges.json');
      const data = await res.json();
      const labChallenges: ChallengeData[] = data[activeLab] || [];
      if (labChallenges.length === 0) return;
      const picked = labChallenges[Math.floor(Math.random() * labChallenges.length)];
      setChallengeState({
        ...picked,
        attempts: 0,
        hintUnlocked: false,
        completed: false,
      });
    } catch {
      // Fallback if JSON fails
      setChallengeState(null);
    }
  }, [activeLab, setChallengeState]);

  useEffect(() => {
    if (predictionPhase === 'challenge' && !challengeState) {
      loadChallenge();
    }
  }, [predictionPhase, challengeState, loadChallenge]);

  // Compute live value from current inputs
  useEffect(() => {
    if (!challengeState) return;
    const m = challengeState.metric;
    if (activeLab === 'circuit') {
      const v = inputs.voltage ?? 5;
      const r = inputs.resistance ?? 20;
      if (m === 'current') setLiveValue(v / r);
      else if (m === 'power') setLiveValue((v * v) / r);
      else if (m === 'brightness') setLiveValue(Math.min((v / r / 0.05) * 100, 100));
    } else if (activeLab === 'titration') {
      const bv = inputs.baseVolume ?? 0;
      if (m === 'pH') setLiveValue(7 + 3.5 * Math.tanh((bv - 25) / 3));
      else if (m === 'baseVolume') setLiveValue(bv);
    } else if (activeLab === 'enzyme') {
      const t = inputs.temperature ?? 37;
      const sc = inputs.substrateConcentration ?? 5;
      const Vmax = 10 * Math.exp(-0.01 * Math.pow(t - 37, 2));
      if (m === 'reactionRate') setLiveValue((Vmax * sc) / (2.5 + sc));
      else if (m === 'temperature') setLiveValue(t);
      else if (m === 'substrateConcentration') setLiveValue(sc);
    } else if (activeLab === 'pendulum') {
      const l = inputs.length ?? 2;
      const g = inputs.gravity ?? 9.8;
      if (m === 'period') setLiveValue(2 * Math.PI * Math.sqrt(l / g));
      else if (m === 'gravity') setLiveValue(g);
    }
  }, [inputs, activeLab, challengeState]);

  // Check if target is reached
  useEffect(() => {
    if (!challengeState || challengeState.completed) return;
    const gap = Math.abs(liveValue - challengeState.targetValue);
    if (gap <= challengeState.tolerance) {
      completeChallenge();
      setShowSuccess(true);
      useSessionStore.getState().addChallenge({
        lab: activeLab,
        challengeDesc: challengeState.description,
        attempts: challengeState.attempts + 1,
        completed: true,
        timestamp: Date.now(),
      });
    }
  }, [liveValue, challengeState, activeLab, completeChallenge]);

  if (predictionPhase !== 'challenge' || !challengeState) return null;

  const gap = Math.abs(liveValue - challengeState.targetValue);
  const gapPercent = challengeState.targetValue !== 0
    ? (gap / Math.abs(challengeState.targetValue)) * 100
    : 0;
  const progressPercent = Math.max(0, Math.min(100, 100 - gapPercent));

  const handleCheckAttempt = () => {
    incrementChallengeAttempt();
  };

  const handleDismiss = () => {
    setPredictionPhase('idle');
    setChallengeState(null);
  };

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 250, damping: 28 }}
      className="fixed right-0 top-16 bottom-0 w-96 z-50 flex flex-col glass-panel border-l border-white/[0.06] overflow-y-auto"
    >
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center border border-orange-500/20">
              <span className="text-xl">🏆</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Challenge</h3>
              <span className="text-[10px] text-white/40">Prove your understanding</span>
            </div>
          </div>
          <button onClick={handleDismiss} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60">
            ✕
          </button>
        </div>

        {/* Challenge Description */}
        <div className="bg-gradient-to-br from-orange-500/[0.06] to-red-500/[0.06] rounded-xl p-4 border border-orange-500/20">
          <p className="text-sm text-orange-300 leading-relaxed font-medium">
            {challengeState.description}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {showSuccess && challengeState.completed ? (
            <motion.div
              key="success"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-4"
            >
              {/* Success */}
              <div className="text-center py-6">
                <span className="text-5xl block mb-3">🎉</span>
                <h4 className="text-lg font-bold text-emerald-400">Challenge Complete!</h4>
                <p className="text-xs text-white/40 mt-1">
                  Completed in {challengeState.attempts + 1} attempt{challengeState.attempts > 0 ? 's' : ''}
                </p>
              </div>

              {/* Math Proof */}
              <div className="bg-white/[0.03] rounded-xl p-4 border border-white/[0.06]">
                <h5 className="text-[10px] uppercase font-bold text-white/30 tracking-widest mb-2">Why It Works</h5>
                <p className="text-sm text-white/70 leading-relaxed">{challengeState.proof}</p>
              </div>

              <button
                onClick={handleDismiss}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold text-sm"
              >
                Done ✓
              </button>
            </motion.div>
          ) : (
            <motion.div key="progress" className="space-y-4">
              {/* Live Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/50">Live Progress</span>
                  <span className="text-xs text-white/30 font-mono">
                    Current: {liveValue.toFixed(3)} → Target: {challengeState.targetValue}
                  </span>
                </div>
                <div className="w-full h-4 bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.06]">
                  <motion.div
                    animate={{ width: `${progressPercent}%` }}
                    transition={{ duration: 0.3 }}
                    className={`h-full rounded-full ${progressPercent > 90 ? 'bg-emerald-500' : progressPercent > 60 ? 'bg-amber-500' : 'bg-red-500'}`}
                  />
                </div>
                <p className="text-xs text-white/40 mt-1 text-center">
                  {gap.toFixed(3)} away from target
                </p>
              </div>

              {/* Attempt Counter */}
              <div className="flex items-center justify-between bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
                <span className="text-xs text-white/50">Attempts</span>
                <span className="text-sm font-mono text-white/80">{challengeState.attempts}</span>
              </div>

              <button
                onClick={handleCheckAttempt}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-600 to-red-600 text-white font-semibold text-sm"
              >
                Check ({challengeState.attempts}/3 before hint)
              </button>

              {/* Hint (unlocked after 3 attempts) */}
              <AnimatePresence>
                {challengeState.hintUnlocked && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-blue-500/[0.06] rounded-xl p-4 border border-blue-500/20"
                  >
                    <h5 className="text-[10px] uppercase font-bold text-blue-400 tracking-widest mb-1">💡 Hint Unlocked</h5>
                    <p className="text-xs text-blue-300/80 leading-relaxed">{challengeState.proof}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
