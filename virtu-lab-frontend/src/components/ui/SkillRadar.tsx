import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

/* ─── Props ─── */
interface SkillRadarProps {
  score: number;
  mistakeCount: number;
  duration: number;           // in seconds
  failureTriggered: boolean;
  isOpen: boolean;
  onClose: () => void;
}

/* ─── Axis feedback map ─── */
const FEEDBACK: Record<string, string> = {
  'Procedural Accuracy':
    '📝 Focus on following the correct experimental steps more carefully.',
  'Safety Awareness':
    '⚠️ Watch for dangerous parameter ranges — safety is the top priority in any lab.',
  Efficiency:
    '⏱️ Try to complete your experiment faster — plan your steps before starting.',
  'Error Recovery':
    '🔄 Fewer mistakes means better understanding — review the theory before experimenting.',
  'Concept Mastery':
    '📚 Strengthen your understanding of the underlying science concepts.',
};

/* ─── Grade helper ─── */
function getGrade(avg: number): { label: string; color: string; emoji: string } {
  if (avg >= 90) return { label: 'Outstanding', color: 'text-emerald-400', emoji: '🏆' };
  if (avg >= 75) return { label: 'Great Job', color: 'text-blue-400', emoji: '⭐' };
  if (avg >= 60) return { label: 'Good Effort', color: 'text-amber-400', emoji: '👍' };
  if (avg >= 40) return { label: 'Needs Improvement', color: 'text-orange-400', emoji: '📖' };
  return { label: 'Keep Practicing', color: 'text-red-400', emoji: '💪' };
}

/* ─── Custom Angle Axis Tick ─── */
const CustomTick: React.FC<any> = ({ payload, x, y, cx, cy }) => {
  const dx = x - cx;
  const dy = y - cy;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const offsetX = (dx / dist) * 18;
  const offsetY = (dy / dist) * 18;

  return (
    <text
      x={x + offsetX}
      y={y + offsetY}
      textAnchor={x > cx ? 'start' : x < cx ? 'end' : 'middle'}
      dominantBaseline="central"
      fill="rgba(255,255,255,0.45)"
      fontSize={11}
      fontWeight={500}
    >
      {payload.value}
    </text>
  );
};

/* ─────────────────────────────────────────── */
/* ─── SkillRadar Component ───────────────── */
/* ─────────────────────────────────────────── */
const SkillRadar: React.FC<SkillRadarProps> = ({
  score,
  mistakeCount,
  duration,
  failureTriggered,
  isOpen,
  onClose,
}) => {
  /* ── Compute 5 axis scores ── */
  const axes = useMemo(() => {
    const proceduralAccuracy = Math.min(100, Math.max(0, score));
    const safetyAwareness = failureTriggered ? 30 : 100;
    const efficiency = Math.max(0, Math.round(100 - (duration / 300) * 100));
    const errorRecovery = Math.max(0, 100 - mistakeCount * 15);
    const conceptMastery = Math.round((proceduralAccuracy + safetyAwareness) / 2);

    return [
      { axis: 'Procedural Accuracy', value: proceduralAccuracy },
      { axis: 'Safety Awareness', value: safetyAwareness },
      { axis: 'Efficiency', value: efficiency },
      { axis: 'Error Recovery', value: errorRecovery },
      { axis: 'Concept Mastery', value: conceptMastery },
    ];
  }, [score, mistakeCount, duration, failureTriggered]);

  /* ── Find weakest axis for feedback ── */
  const weakest = useMemo(
    () => axes.reduce((min, cur) => (cur.value < min.value ? cur : min), axes[0]),
    [axes]
  );

  const average = useMemo(
    () => Math.round(axes.reduce((s, a) => s + a.value, 0) / axes.length),
    [axes]
  );

  const grade = useMemo(() => getGrade(average), [average]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-[480px] max-w-[92vw] glass-panel rounded-3xl border border-white/[0.08] shadow-2xl shadow-blue-500/5 overflow-hidden"
          >
            {/* Header gradient bar */}
            <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

            {/* Close button */}
            <button
              id="close-skill-radar"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.1] transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Title */}
            <div className="px-6 pt-5 pb-2">
              <h2 className="text-lg font-bold text-white">Experiment Performance</h2>
              <p className="text-xs text-white/30 mt-0.5">Your skill breakdown from this session</p>
            </div>

            {/* Grade + Average */}
            <div className="flex items-center gap-3 mx-6 mb-2 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.05]">
              <span className="text-3xl">{grade.emoji}</span>
              <div>
                <p className={`text-lg font-bold ${grade.color}`}>{grade.label}</p>
                <p className="text-xs text-white/30">
                  Overall Score: <span className="text-white/60 font-mono">{average}%</span>
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-white/20">Duration</p>
                <p className="text-sm text-white/50 font-mono">{duration}s</p>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="px-4 py-2">
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={axes} cx="50%" cy="50%" outerRadius="72%">
                  <PolarGrid
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="3 3"
                  />
                  <PolarAngleAxis
                    dataKey="axis"
                    tick={<CustomTick />}
                  />
                  <PolarRadiusAxis
                    angle={90}
                    domain={[0, 100]}
                    tick={false}
                    axisLine={false}
                  />
                  <Radar
                    name="Performance"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    fill="#3b82f6"
                    fillOpacity={0.4}
                    dot={{
                      r: 4,
                      fill: '#3b82f6',
                      stroke: '#0a0a1a',
                      strokeWidth: 2,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Axis scores breakdown */}
            <div className="px-6 pb-2">
              <div className="grid grid-cols-5 gap-1">
                {axes.map((a) => (
                  <div key={a.axis} className="text-center">
                    <div
                      className={`text-base font-bold font-mono ${a.value >= 80
                          ? 'text-emerald-400'
                          : a.value >= 50
                            ? 'text-amber-400'
                            : 'text-red-400'
                        }`}
                    >
                      {a.value}
                    </div>
                    <div className="text-[8px] text-white/25 leading-tight mt-0.5">
                      {a.axis.split(' ')[0]}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Feedback */}
            <div className="mx-6 mb-5 mt-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500/[0.06] to-indigo-500/[0.06] border border-blue-500/[0.1]">
              <div className="flex items-start gap-2">
                <span className="text-sm mt-0.5">🤖</span>
                <div>
                  <p className="text-xs text-white/50 font-medium mb-0.5">AI Feedback</p>
                  <p className="text-sm text-white/80 leading-relaxed">
                    {FEEDBACK[weakest.axis]}
                  </p>
                  <p className="text-[10px] text-white/25 mt-1">
                    Weakest area: <span className="text-blue-400/60">{weakest.axis}</span> ({weakest.value}%)
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom action */}
            <div className="px-6 pb-5 flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-sm text-white/50 hover:text-white/80 hover:bg-white/[0.06] transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  onClose();
                }}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm text-white font-medium hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-[0.98]"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SkillRadar;
