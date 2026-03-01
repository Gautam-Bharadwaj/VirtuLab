import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore } from '../../store/useLabStore';
import { useSessionStore } from '../../store/sessionStore';
import { vivaQuestions } from '../../lib/vivaQuestions';
import { reportAims, reportResults, observationColumns } from '../../lib/reportTemplates';
import { useNavigate } from 'react-router-dom';

export const LabReportModal: React.FC = () => {
  const {
    predictionPhase,
    setPredictionPhase,
    activeLab,
    score,
    mistakeCount,
    experimentDuration,
    failureState,
    observations,
    inputs,
    prediction,
    resetExperiment,
  } = useLabStore();
  const navigate = useNavigate();

  const isOpen = predictionPhase === 'report';

  // Build observation rows from recorded data or current inputs
  const obsRows = useMemo(() => {
    if (observations.length > 0) {
      return observations.slice(-5); // max 5 rows
    }
    // Fallback: single row from current inputs
    const row: Record<string, number> = { ...inputs };
    if (activeLab === 'circuit') {
      row.current = (inputs.voltage ?? 5) / (inputs.resistance ?? 20);
      row.power = row.current * row.current * (inputs.resistance ?? 20);
    } else if (activeLab === 'titration') {
      row.pH = 7 + 3.5 * Math.tanh(((inputs.baseVolume ?? 0) - 25) / 3);
    } else if (activeLab === 'enzyme') {
      const Vmax = 10 * Math.exp(-0.01 * Math.pow((inputs.temperature ?? 37) - 37, 2));
      row.reactionRate = (Vmax * (inputs.substrateConcentration ?? 5)) / (2.5 + (inputs.substrateConcentration ?? 5));
    } else if (activeLab === 'pendulum') {
      row.period = 2 * Math.PI * Math.sqrt((inputs.length ?? 2) / (inputs.gravity ?? 9.8));
    }
    return [row];
  }, [observations, inputs, activeLab]);

  const columns = observationColumns[activeLab] || [];
  const aim = reportAims[activeLab] || "To investigate the current experiment parameters.";
  const result = reportResults[activeLab] || "The experiment data suggests relationships consistent with theoretical predictions.";
  const viva = vivaQuestions[activeLab] || [];

  // Build report text for copy
  const buildReportText = () => {
    let text = `LAB REPORT — ${activeLab.toUpperCase()}\n`;
    text += `Date: ${new Date().toLocaleDateString()}\n`;
    text += `Duration: ${experimentDuration}s | Score: ${score}/100\n\n`;
    text += `AIM\n${aim}\n\n`;
    text += `OBSERVATIONS\n`;
    text += columns.map(c => c.label).join('\t') + '\n';
    obsRows.forEach(row => {
      text += columns.map(c => {
        const v = row[c.key];
        return v !== undefined ? (typeof v === 'number' ? v.toFixed(3) : String(v)) : '—';
      }).join('\t') + '\n';
    });
    text += `\nRESULT\n${result}\n`;
    if (failureState || mistakeCount > 0) {
      text += `\nWHERE YOU STRUGGLED\n`;
      if (failureState) text += `- ${failureState.name}: ${failureState.description}\n`;
      text += `- Total mistakes: ${mistakeCount}\n`;
    }
    text += `\nVIVA QUESTIONS\n`;
    viva.forEach((q, i) => { text += `${i + 1}. ${q}\n`; });
    return text;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildReportText());
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = buildReportText();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
  };

  const handleTryAgain = () => {
    resetExperiment();
  };

  const handleViewDashboard = () => {
    // Save session before navigating
    const sessionStore = useSessionStore.getState();
    sessionStore.addSession({
      id: `session-${Date.now()}`,
      lab: activeLab,
      inputs: { ...inputs },
      score,
      duration: experimentDuration,
      failures: failureState ? [failureState.name] : [],
      observations: obsRows,
      prediction: prediction?.userGuess != null ? {
        question: prediction.question,
        expected: prediction.expected,
        userGuess: prediction.userGuess,
      } : null,
      timestamp: Date.now(),
    });
    setPredictionPhase('idle');
    navigate('/dashboard');
  };

  const handleDismiss = () => {
    // Save session
    const sessionStore = useSessionStore.getState();
    sessionStore.addSession({
      id: `session-${Date.now()}`,
      lab: activeLab,
      inputs: { ...inputs },
      score,
      duration: experimentDuration,
      failures: failureState ? [failureState.name] : [],
      observations: obsRows,
      prediction: prediction?.userGuess != null ? {
        question: prediction.question,
        expected: prediction.expected,
        userGuess: prediction.userGuess,
      } : null,
      timestamp: Date.now(),
    });
    setPredictionPhase('challenge');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8"
      >
        <motion.div
          initial={{ scale: 0.92, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="w-full max-w-3xl mx-4 relative"
        >
          <div className="overflow-hidden rounded-2xl border border-white/[0.1] bg-[#0e0e20]/98 backdrop-blur-xl shadow-2xl">
            {/* Top accent */}
            <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500" />

            <div className="p-8 space-y-6 max-h-[85vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📋</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">Lab Report</h2>
                    <p className="text-xs text-white/40">
                      {new Date().toLocaleDateString()} • {experimentDuration}s duration • Score: {score}/100
                    </p>
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-lg text-xs font-bold ${score >= 80 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : score >= 60 ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                  {score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Work'}
                </div>
              </div>

              {/* Section 1: Aim */}
              <div>
                <h3 className="text-xs uppercase font-bold text-blue-400 tracking-widest mb-2">1. Aim</h3>
                <p className="text-sm text-white/70 leading-relaxed bg-white/[0.02] rounded-xl p-4 border border-white/[0.06]">
                  {aim}
                </p>
              </div>

              {/* Section 2: Observations Table */}
              <div>
                <h3 className="text-xs uppercase font-bold text-blue-400 tracking-widest mb-2">2. Observations</h3>
                <div className="overflow-x-auto rounded-xl border border-white/[0.06]">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-white/[0.03]">
                        <th className="px-4 py-2.5 text-left text-[10px] uppercase text-white/40 font-bold tracking-wider">#</th>
                        {columns.map((col) => (
                          <th key={col.key} className="px-4 py-2.5 text-left text-[10px] uppercase text-white/40 font-bold tracking-wider">
                            {col.label} {col.unit && `(${col.unit})`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {obsRows.map((row, i) => (
                        <tr key={i} className="border-t border-white/[0.04] hover:bg-white/[0.02]">
                          <td className="px-4 py-2.5 text-white/30 font-mono text-xs">{i + 1}</td>
                          {columns.map((col) => (
                            <td key={col.key} className="px-4 py-2.5 text-white/70 font-mono text-xs">
                              {row[col.key] !== undefined
                                ? (typeof row[col.key] === 'number' ? (row[col.key] as number).toFixed(3) : String(row[col.key]))
                                : '—'}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 3: Result */}
              <div>
                <h3 className="text-xs uppercase font-bold text-blue-400 tracking-widest mb-2">3. Result</h3>
                <p className="text-sm text-white/70 leading-relaxed bg-white/[0.02] rounded-xl p-4 border border-white/[0.06]">
                  {result}
                </p>
              </div>

              {/* Section 4: Where You Struggled */}
              {(failureState || mistakeCount > 0) && (
                <div>
                  <h3 className="text-xs uppercase font-bold text-red-400 tracking-widest mb-2">4. Where You Struggled</h3>
                  <div className="bg-red-500/[0.04] rounded-xl p-4 border border-red-500/20 space-y-2">
                    {failureState && (
                      <div className="flex items-start gap-2">
                        <span className="text-red-400 mt-0.5">⚠️</span>
                        <p className="text-sm text-red-300/80">
                          <strong>{failureState.name}:</strong> {failureState.description}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-white/40">
                      Total mistakes during experiment: {mistakeCount}
                    </p>
                  </div>
                </div>
              )}

              {/* Section 5: Viva Questions */}
              <div>
                <h3 className="text-xs uppercase font-bold text-purple-400 tracking-widest mb-2">
                  {failureState || mistakeCount > 0 ? '5' : '4'}. Viva Questions
                </h3>
                <div className="space-y-2">
                  {viva.map((q, i) => (
                    <div key={i} className="bg-purple-500/[0.04] rounded-xl p-3 border border-purple-500/15 flex items-start gap-3">
                      <span className="text-xs font-bold text-purple-400/60 mt-0.5">Q{i + 1}</span>
                      <p className="text-sm text-white/70 leading-relaxed">{q}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCopy}
                  className="flex-1 py-3 rounded-xl bg-white/[0.05] text-white/70 font-medium text-sm border border-white/[0.08] hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2"
                >
                  📋 Copy Report
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleTryAgain}
                  className="flex-1 py-3 rounded-xl bg-white/[0.05] text-white/70 font-medium text-sm border border-white/[0.08] hover:bg-white/[0.1] transition-all flex items-center justify-center gap-2"
                >
                  🔄 Try Again
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={handleViewDashboard}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg flex items-center justify-center gap-2"
                >
                  📊 Dashboard
                </motion.button>
              </div>

              {/* Dismiss to challenge */}
              <button
                onClick={handleDismiss}
                className="w-full text-center text-xs text-white/30 hover:text-white/50 transition-colors py-2"
              >
                Dismiss → Try a Challenge
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
