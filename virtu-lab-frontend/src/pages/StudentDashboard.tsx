import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { useSessionStore } from '../store/sessionStore';
import type { LabType } from '../store/useLabStore';

const labIcons: Record<LabType, string> = {
  circuit: '⚡',
  titration: '🧪',
  enzyme: '🧬',
  pendulum: '⏱️',
  gravity: '🌍',
};
const labNames: Record<LabType, string> = {
  circuit: 'Circuit Forge',
  titration: 'Titration Bench',
  enzyme: 'Enzyme Reactor',
  pendulum: 'Pendulum Lab',
  gravity: 'Gravity Well',
};
const labColors: Record<LabType, string> = {
  circuit: 'from-amber-500/20 to-orange-500/20',
  titration: 'from-emerald-500/20 to-teal-500/20',
  enzyme: 'from-purple-500/20 to-violet-500/20',
  pendulum: 'from-blue-500/20 to-sky-500/20',
  gravity: 'from-pink-500/20 to-rose-500/20',
};

export const StudentDashboard: React.FC = () => {
  const {
    sessions,
    challengeHistory,
    getSessionCount,
    getBestScore,
    getPredictionAccuracy,
    getOverallPredictionAccuracy,
    getSafetyRate,
    getAverageScore,
    getRecentMistakes,
  } = useSessionStore();

  const totalSessions = sessions.length;
  const avgScore = getAverageScore();
  const safetyRate = getSafetyRate();
  const predictionAcc = getOverallPredictionAccuracy();
  const recentMistakes = getRecentMistakes(10);
  const allLabs: LabType[] = ['circuit', 'titration', 'enzyme', 'pendulum', 'gravity'];

  // Skill radar data
  const radarData = useMemo(() => {
    if (totalSessions === 0) return [];
    const efficiency = Math.min(100, Math.max(0, 100 - (sessions.reduce((sum, s) => sum + s.duration, 0) / totalSessions - 30) * 2));
    const errorRecovery = totalSessions > 1
      ? Math.min(100, (sessions.filter(s => s.failures.length === 0).length / totalSessions) * 100)
      : 50;

    return [
      { subject: 'Accuracy', value: avgScore },
      { subject: 'Safety', value: safetyRate },
      { subject: 'Efficiency', value: efficiency },
      { subject: 'Recovery', value: errorRecovery },
      { subject: 'Mastery', value: Math.round((avgScore * 0.4 + safetyRate * 0.2 + efficiency * 0.2 + errorRecovery * 0.2)) },
    ];
  }, [totalSessions, sessions, avgScore, safetyRate]);

  if (totalSessions === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <div className="text-center space-y-6 p-8">
          <span className="text-6xl block">🧪</span>
          <h1 className="text-2xl font-bold text-white">No Experiments Yet</h1>
          <p className="text-white/40 max-w-sm mx-auto">
            You haven't completed any experiments. Run your first simulation to start tracking your progress!
          </p>
          <Link
            to="/lab/circuit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/20 transition-all"
          >
            🚀 Start First Experiment
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      {/* Top bar */}
      <div className="border-b border-white/[0.06] bg-[#0e0e20]/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <Link to="/lab/circuit" className="text-white/40 hover:text-white/70 transition-colors text-sm">
            ← Back to Lab
          </Link>
        </div>
        <h1 className="text-lg font-bold">
          <span className="text-blue-400">📊</span> Student Dashboard
        </h1>
        <div className="text-xs text-white/30">
          {totalSessions} sessions • avg {avgScore}/100
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ── Summary Stats ── */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Total Sessions', value: totalSessions, icon: '🧪', color: 'from-blue-500/20 to-indigo-500/20' },
            { label: 'Average Score', value: `${avgScore}/100`, icon: '🎯', color: 'from-emerald-500/20 to-green-500/20' },
            { label: 'Safety Rate', value: `${safetyRate}%`, icon: '🛡️', color: 'from-amber-500/20 to-orange-500/20' },
            { label: 'Prediction Accuracy', value: `${predictionAcc}%`, icon: '🔮', color: 'from-purple-500/20 to-violet-500/20' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 border border-white/[0.08]`}
            >
              <span className="text-2xl">{stat.icon}</span>
              <div className="text-xl font-bold mt-2">{stat.value}</div>
              <div className="text-[11px] text-white/40">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Progress Cards + Skill Radar ── */}
        <div className="grid grid-cols-3 gap-6">
          {/* Left: Progress Cards (2 cols) */}
          <div className="col-span-2 space-y-4">
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">Simulation Progress</h2>
            <div className="grid grid-cols-2 gap-3">
              {allLabs.map((lab) => {
                const count = getSessionCount(lab);
                const best = getBestScore(lab);
                const pct = Math.min(count * 20, 100);
                return (
                  <motion.div
                    key={lab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`bg-gradient-to-br ${labColors[lab]} rounded-xl p-4 border border-white/[0.06]`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{labIcons[lab]}</span>
                        <span className="text-sm font-semibold">{labNames[lab]}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${best >= 80 ? 'bg-emerald-500/20 text-emerald-400' : best >= 60 ? 'bg-amber-500/20 text-amber-400' : best > 0 ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-white/30'}`}>
                        {best > 0 ? `Best: ${best}` : 'No runs'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/40 mb-2">
                      <span>{count} session{count !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                      />
                    </div>
                    <Link
                      to={`/lab/${lab}`}
                      className="mt-3 block text-center text-[10px] font-bold uppercase tracking-wider text-blue-400/60 hover:text-blue-400 transition-colors"
                    >
                      Start →
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right: Skill Radar */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">Skill Radar</h2>
            <div className="bg-white/[0.02] rounded-2xl border border-white/[0.06] p-4">
              {radarData.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.06)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={false}
                      axisLine={false}
                    />
                    <Radar
                      dataKey="value"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-white/30 text-center py-12">
                  Complete at least one experiment to see your radar
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Prediction Accuracy ── */}
        <div>
          <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Prediction Accuracy by Simulation</h2>
          <div className="grid grid-cols-5 gap-3">
            {allLabs.map((lab) => {
              const acc = getPredictionAccuracy(lab);
              return (
                <div key={lab} className="bg-white/[0.02] rounded-xl p-4 border border-white/[0.06] text-center">
                  <span className="text-2xl block">{labIcons[lab]}</span>
                  <div className={`text-xl font-bold mt-2 ${acc >= 70 ? 'text-emerald-400' : acc >= 40 ? 'text-amber-400' : acc > 0 ? 'text-red-400' : 'text-white/20'}`}>
                    {acc > 0 ? `${acc}%` : '—'}
                  </div>
                  <div className="text-[10px] text-white/30 mt-1">{labNames[lab]}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mistake Log + My Reports (side by side) ── */}
        <div className="grid grid-cols-2 gap-6">
          {/* Mistake Log */}
          <div>
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Recent Mistakes</h2>
            {recentMistakes.length > 0 ? (
              <div className="space-y-2">
                {recentMistakes.map((m) => (
                  <div key={m.id} className="bg-red-500/[0.03] rounded-xl p-3 border border-red-500/10 flex items-start gap-3">
                    <span className="text-sm">{labIcons[m.lab]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/70 truncate">{m.misconception}</p>
                      <p className="text-[10px] text-white/30 mt-0.5">{m.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/30 bg-white/[0.02] rounded-xl p-6 text-center border border-white/[0.06]">
                No mistakes recorded yet — keep it up! 🌟
              </p>
            )}
          </div>

          {/* My Reports */}
          <div>
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">My Reports</h2>
            {sessions.length > 0 ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto scrollbar-thin">
                {[...sessions].reverse().slice(0, 15).map((s) => (
                  <div key={s.id} className="bg-white/[0.02] rounded-xl p-3 border border-white/[0.06] flex items-center gap-3">
                    <span className="text-sm">{labIcons[s.lab]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white/70 font-medium">{labNames[s.lab]}</p>
                      <p className="text-[10px] text-white/30">
                        {new Date(s.timestamp).toLocaleDateString()} • {s.duration}s
                      </p>
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${s.score >= 80 ? 'bg-emerald-500/20 text-emerald-400' : s.score >= 60 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                      {s.score}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-white/30 bg-white/[0.02] rounded-xl p-6 text-center border border-white/[0.06]">
                No reports yet
              </p>
            )}
          </div>
        </div>

        {/* ── Challenges Completed ── */}
        {challengeHistory.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">Challenges Completed</h2>
            <div className="grid grid-cols-3 gap-3">
              {challengeHistory.filter(c => c.completed).map((c, i) => (
                <div key={i} className="bg-orange-500/[0.03] rounded-xl p-3 border border-orange-500/10">
                  <div className="flex items-center gap-2 mb-1">
                    <span>🏆</span>
                    <span className="text-xs font-bold text-orange-400">{labNames[c.lab]}</span>
                  </div>
                  <p className="text-[10px] text-white/50 truncate">{c.challengeDesc}</p>
                  <p className="text-[10px] text-white/30 mt-1">{c.attempts} attempt{c.attempts !== 1 ? 's' : ''}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
