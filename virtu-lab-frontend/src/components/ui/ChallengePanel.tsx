import React, { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore, ChallengeData, LabInputs } from '../../store/useLabStore';

function evaluateCompute(expr: string, inputs: LabInputs): number {
    try {
        const fn = new Function('inputs', 'Math', `"use strict"; return (${expr});`);
        return fn(inputs, Math);
    } catch {
        return 0;
    }
}

let challengesCache: Record<string, ChallengeData[]> | null = null;

async function loadChallenges(): Promise<Record<string, ChallengeData[]>> {
    if (challengesCache) return challengesCache;
    try {
        const res = await fetch('/offline_challenges.json');
        challengesCache = await res.json();
        return challengesCache!;
    } catch {
        return {};
    }
}

export const ChallengePanel: React.FC = () => {
    const {
        activeLab, inputs, running,
        challengeActive, challengeData, challengeAttempts,
        challengeHintUnlocked,
        showChallengeSuccess,
        startChallenge, incrementChallengeAttempt,
        completeChallenge, dismissChallenge,
        startExperiment, stopExperiment,
    } = useLabStore();

    const [currentValue, setCurrentValue] = useState(0);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const hasCheckedRef = useRef(false);

    useEffect(() => {
        if (!challengeData || !challengeActive) return;
        const val = evaluateCompute(challengeData.compute, inputs);
        setCurrentValue(parseFloat(val.toFixed(2)));

        const diff = Math.abs(val - challengeData.targetValue);
        const maxDiff = Math.abs(challengeData.targetValue) || 1;
        const pct = Math.max(0, Math.min(100, (1 - diff / maxDiff) * 100));
        setProgress(parseFloat(pct.toFixed(1)));
    }, [inputs, challengeData, challengeActive]);

    useEffect(() => {
        if (!challengeActive || !challengeData || running) {
            hasCheckedRef.current = false;
            return;
        }
        if (hasCheckedRef.current) return;
        if (challengeAttempts === 0 && currentValue === 0) return;

        hasCheckedRef.current = true;
        const diff = Math.abs(currentValue - challengeData.targetValue);
        const toleranceVal = (challengeData.tolerance / 100) * Math.abs(challengeData.targetValue);

        if (diff <= toleranceVal) {
            completeChallenge();
        }
    }, [running, challengeActive, challengeData, currentValue, challengeAttempts, completeChallenge]);

    const [error, setError] = useState<string | null>(null);
    const loadChallenge = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const challenges = await loadChallenges();
            const labChallenges = challenges[activeLab];
            if (labChallenges && labChallenges.length > 0) {
                const randomIdx = Math.floor(Math.random() * labChallenges.length);
                startChallenge(labChallenges[randomIdx]);
            } else {
                setError(`No AI challenges available for ${activeLab.replace('-', ' ')} lab yet.`);
            }
        } catch {
            setError('Failed to connect to the challenge server.');
        } finally {
            setLoading(false);
        }
    }, [activeLab, startChallenge]);

    const handleCheck = useCallback(() => {
        if (!challengeData) return;
        incrementChallengeAttempt();

        const diff = Math.abs(currentValue - challengeData.targetValue);
        const toleranceVal = (challengeData.tolerance / 100) * Math.abs(challengeData.targetValue);

        if (diff <= toleranceVal) {
            completeChallenge();
        }
    }, [challengeData, currentValue, incrementChallengeAttempt, completeChallenge]);

    if (!challengeActive) {
        return (
            <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                className="fixed right-0 top-16 bottom-0 w-80 flex flex-col items-center justify-center glass-panel border-l border-white/[0.06] z-35 p-6"
            >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border border-purple-500/20 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/10">
                    <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>

                <h3 className="text-lg font-black text-white uppercase tracking-wider text-center mb-2">AI Challenge</h3>
                <p className="text-xs text-white/40 text-center leading-relaxed mb-6">
                    Ready for a challenge? The AI will set a specific target — can you find the right parameters?
                </p>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="w-full bg-rose-500/10 border border-rose-500/20 rounded-xl p-3 mb-6"
                    >
                        <p className="text-[10px] text-rose-400 font-bold text-center uppercase tracking-wider leading-relaxed">
                            {error}
                        </p>
                    </motion.div>
                )}

                <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={loadChallenge}
                    disabled={loading}
                    className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all disabled:opacity-50"
                >
                    {loading ? 'Loading...' : 'Start Challenge'}
                </motion.button>

                <button
                    onClick={dismissChallenge}
                    className="mt-3 text-[10px] text-white/30 hover:text-white/50 uppercase tracking-widest transition-colors"
                >
                    Skip
                </button>
            </motion.div>
        );
    }

    if (showChallengeSuccess && challengeData) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-[110] flex items-center justify-center"
            >
                <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={dismissChallenge} />

                <motion.div
                    initial={{ scale: 0.85, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 22 }}
                    className="relative w-full max-w-md mx-4 rounded-3xl border border-emerald-500/20 overflow-hidden shadow-2xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/5" />
                    <div className="absolute inset-0 bg-[#0d0d20]/90" />

                    <div className="relative z-10 p-8">
                        <div className="text-center mb-6">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500/30 flex items-center justify-center mb-4"
                            >
                                <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </motion.div>
                            <h2 className="text-2xl font-black text-emerald-400">Challenge Complete!</h2>
                            <p className="text-sm text-white/50 mt-1">Solved in {challengeAttempts} attempt{challengeAttempts !== 1 ? 's' : ''}</p>
                        </div>

                        <div className="flex items-center justify-center gap-4 mb-6 py-4 rounded-2xl bg-white/[0.03] border border-white/5">
                            <div className="text-center">
                                <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest block mb-1">Target</span>
                                <span className="text-xl font-black text-white font-mono">{challengeData.targetValue}</span>
                                <span className="text-xs text-white/30 ml-1">{challengeData.targetUnit}</span>
                            </div>
                            <div className="text-2xl text-emerald-400 font-bold">=</div>
                            <div className="text-center">
                                <span className="text-[10px] text-white/30 font-bold uppercase tracking-widest block mb-1">Your Value</span>
                                <span className="text-xl font-black text-emerald-400 font-mono">{currentValue}</span>
                                <span className="text-xs text-white/30 ml-1">{challengeData.targetUnit}</span>
                            </div>
                        </div>

                        <div className="mb-6 px-5 py-4 rounded-2xl bg-gradient-to-r from-emerald-500/[0.06] to-teal-500/[0.06] border border-emerald-500/10">
                            <p className="text-[10px] text-emerald-400/60 font-bold uppercase tracking-widest mb-2">Mathematical Proof</p>
                            <p className="text-sm text-white/70 leading-relaxed">{challengeData.proof}</p>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={dismissChallenge}
                            className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20"
                        >
                            Continue
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        );
    }

    if (!challengeData) return null;

    const diff = Math.abs(currentValue - challengeData.targetValue);
    const toleranceVal = (challengeData.tolerance / 100) * Math.abs(challengeData.targetValue);
    const isWithinTolerance = diff <= toleranceVal;
    const distancePercent = challengeData.targetValue !== 0
        ? ((diff / Math.abs(challengeData.targetValue)) * 100).toFixed(1)
        : diff.toFixed(2);

    return (
        <motion.div
            initial={{ x: 320 }}
            animate={{ x: 0 }}
            exit={{ x: 320 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed right-0 top-16 bottom-0 w-80 flex flex-col glass-panel border-l border-purple-500/[0.1] z-35 overflow-y-auto"
        >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white">{challengeData.title}</h3>
                        <span className="text-[10px] text-purple-400/60 font-bold uppercase tracking-widest">AI Challenge</span>
                    </div>
                </div>
                <button onClick={dismissChallenge} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="p-4 space-y-4 flex-1">
                <div className="px-4 py-4 rounded-2xl bg-purple-500/[0.06] border border-purple-500/10">
                    <p className="text-sm text-white/80 leading-relaxed">{challengeData.description}</p>
                </div>

                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Target</span>
                    <span className="text-lg font-black text-purple-400 font-mono">
                        {challengeData.targetValue} <span className="text-xs text-white/30">{challengeData.targetUnit}</span>
                    </span>
                </div>

                <div className="px-4 py-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Current Value</span>
                        <span className={`text-lg font-black font-mono ${isWithinTolerance ? 'text-emerald-400' : 'text-white'}`}>
                            {currentValue} <span className="text-xs text-white/30">{challengeData.targetUnit}</span>
                        </span>
                    </div>

                    <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            style={{ width: `${Math.min(progress, 100)}%` }}
                            className={`h-full rounded-full transition-all duration-300 ${isWithinTolerance
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                                : progress > 70
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                                    : 'bg-gradient-to-r from-purple-600 to-indigo-600'
                                }`}
                        />
                    </div>

                    <p className={`text-xs ${isWithinTolerance ? 'text-emerald-400 font-bold' : 'text-white/40'}`}>
                        {isWithinTolerance
                            ? 'Within tolerance! Click Check to verify.'
                            : `${distancePercent}% away from target`
                        }
                    </p>
                </div>

                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Attempts</span>
                    <div className="flex items-center gap-2">
                        {[0, 1, 2].map(i => (
                            <div key={i} className={`w-3 h-3 rounded-full border ${i < challengeAttempts
                                ? 'bg-purple-500 border-purple-400'
                                : 'bg-white/[0.04] border-white/10'
                                }`} />
                        ))}
                        {challengeAttempts > 3 && (
                            <span className="text-xs text-white/30 font-mono">+{challengeAttempts - 3}</span>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {challengeHintUnlocked && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="overflow-hidden"
                        >
                            <div className="px-4 py-4 rounded-2xl bg-gradient-to-r from-amber-500/[0.06] to-orange-500/[0.06] border border-amber-500/10">
                                <div className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                    <div>
                                        <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest mb-1">Hint Unlocked</p>
                                        <p className="text-xs text-white/70 leading-relaxed">{challengeData.hint}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!challengeHintUnlocked && challengeAttempts > 0 && (
                    <p className="text-[10px] text-white/20 text-center">
                        Hint unlocks after {3 - challengeAttempts} more attempt{3 - challengeAttempts !== 1 ? 's' : ''}
                    </p>
                )}
            </div>

            <div className="p-4 border-t border-white/[0.06] space-y-2">
                {!running ? (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                            if (challengeData.fixedParams) {
                                const store = useLabStore.getState();
                                Object.entries(challengeData.fixedParams).forEach(([key, val]) => {
                                    store.updateInput(key, val);
                                });
                            }
                            startExperiment();
                        }}
                        className="w-full h-11 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-purple-500/20"
                    >
                        Run Experiment
                    </motion.button>
                ) : (
                    <div className="flex gap-2">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                stopExperiment();
                                handleCheck();
                            }}
                            className="flex-1 h-11 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl"
                        >
                            Stop & Check
                        </motion.button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};
