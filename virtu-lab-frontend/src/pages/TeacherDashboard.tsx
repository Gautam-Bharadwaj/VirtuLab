import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface SessionRow {
  id: string;
  student_id: string;
  experiment: string;
  score: number;
  misconception: string;
  duration: number;
  created_at: string;
}

type SortKey = keyof SessionRow;
type SortDir = 'asc' | 'desc';

const MOCK_DATA: SessionRow[] = [
  { id: '1', student_id: 'STU-001', experiment: 'Circuit Forge', score: 92, misconception: 'None', duration: 145, created_at: new Date(Date.now() - 120000).toISOString() },
  { id: '2', student_id: 'STU-002', experiment: 'Titration Bench', score: 67, misconception: 'pH Misconception', duration: 230, created_at: new Date(Date.now() - 300000).toISOString() },
  { id: '3', student_id: 'STU-003', experiment: 'Enzyme Reactor', score: 45, misconception: 'Enzyme Denaturation', duration: 180, created_at: new Date(Date.now() - 500000).toISOString() },
  { id: '4', student_id: 'STU-004', experiment: 'Circuit Forge', score: 78, misconception: 'Overvoltage', duration: 200, created_at: new Date(Date.now() - 700000).toISOString() },
  { id: '5', student_id: 'STU-005', experiment: 'Titration Bench', score: 88, misconception: 'None', duration: 165, created_at: new Date(Date.now() - 900000).toISOString() },
  { id: '6', student_id: 'STU-006', experiment: 'Enzyme Reactor', score: 34, misconception: 'Enzyme Denaturation', duration: 310, created_at: new Date(Date.now() - 1100000).toISOString() },
  { id: '7', student_id: 'STU-007', experiment: 'Circuit Forge', score: 56, misconception: 'Short Circuit', duration: 190, created_at: new Date(Date.now() - 1300000).toISOString() },
  { id: '8', student_id: 'STU-008', experiment: 'Titration Bench', score: 91, misconception: 'None', duration: 140, created_at: new Date(Date.now() - 1500000).toISOString() },
  { id: '9', student_id: 'STU-009', experiment: 'Circuit Forge', score: 72, misconception: 'Overvoltage', duration: 255, created_at: new Date(Date.now() - 1700000).toISOString() },
  { id: '10', student_id: 'STU-010', experiment: 'Enzyme Reactor', score: 83, misconception: 'None', duration: 175, created_at: new Date(Date.now() - 1900000).toISOString() },
  { id: '11', student_id: 'STU-011', experiment: 'Circuit Forge', score: 25, misconception: 'Short Circuit', duration: 95, created_at: new Date(Date.now() - 2100000).toISOString() },
  { id: '12', student_id: 'STU-012', experiment: 'Titration Bench', score: 61, misconception: 'pH Misconception', duration: 280, created_at: new Date(Date.now() - 2300000).toISOString() },
  { id: '13', student_id: 'STU-013', experiment: 'Enzyme Reactor', score: 95, misconception: 'None', duration: 120, created_at: new Date(Date.now() - 2500000).toISOString() },
  { id: '14', student_id: 'STU-014', experiment: 'Circuit Forge', score: 42, misconception: 'Overvoltage', duration: 340, created_at: new Date(Date.now() - 2700000).toISOString() },
  { id: '15', student_id: 'STU-015', experiment: 'Titration Bench', score: 79, misconception: 'pH Misconception', duration: 210, created_at: new Date(Date.now() - 2900000).toISOString() },
  { id: '16', student_id: 'STU-016', experiment: 'Enzyme Reactor', score: 55, misconception: 'Enzyme Denaturation', duration: 265, created_at: new Date(Date.now() - 3100000).toISOString() },
  { id: '17', student_id: 'STU-017', experiment: 'Circuit Forge', score: 87, misconception: 'None', duration: 155, created_at: new Date(Date.now() - 3300000).toISOString() },
  { id: '18', student_id: 'STU-018', experiment: 'Titration Bench', score: 38, misconception: 'pH Misconception', duration: 300, created_at: new Date(Date.now() - 3500000).toISOString() },
  { id: '19', student_id: 'STU-019', experiment: 'Enzyme Reactor', score: 74, misconception: 'None', duration: 185, created_at: new Date(Date.now() - 3700000).toISOString() },
  { id: '20', student_id: 'STU-020', experiment: 'Circuit Forge', score: 63, misconception: 'Short Circuit', duration: 225, created_at: new Date(Date.now() - 3900000).toISOString() },
];

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-panel rounded-lg px-3 py-2 border border-white/10 text-xs">
      <p className="text-white/80 font-medium">{label}</p>
      <p className="text-blue-400 font-mono mt-0.5">
        {payload[0].value} occurrence{payload[0].value !== 1 ? 's' : ''}
      </p>
    </div>
  );
};

const ScoreBadge: React.FC<{ score: number }> = ({ score }) => {
  const color =
    score > 80
      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
      : score >= 60
        ? 'bg-amber-500/15 text-amber-400 border-amber-500/20'
        : 'bg-red-500/15 text-red-400 border-red-500/20';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold border ${color}`}>
      {score}
    </span>
  );
};

const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: string;
  sub?: string;
  index: number;
}> = ({ label, value, icon, sub, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.35 }}
    className="glass-panel rounded-2xl p-5 flex items-start gap-4 group hover:border-white/[0.12] transition-colors"
  >
    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 flex items-center justify-center text-2xl shrink-0 border border-blue-500/10 group-hover:shadow-lg group-hover:shadow-blue-500/10 transition-shadow">
      <img src={icon} alt={label} className="w-6 h-6 object-contain" />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] text-white/35 uppercase tracking-widest font-medium">{label}</p>
      <p className="text-2xl font-bold text-white mt-0.5 tabular-nums">{value}</p>
      {sub && <p className="text-[11px] text-white/30 mt-0.5 truncate">{sub}</p>}
    </div>
  </motion.div>
);

const SortIcon: React.FC<{ active: boolean; dir: SortDir }> = ({ active, dir }) => (
  <svg className={`w-3 h-3 inline ml-1 transition-colors ${active ? 'text-blue-400' : 'text-white/15'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    {dir === 'asc' ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    )}
  </svg>
);

export const TeacherDashboard: React.FC = () => {
  const [rows, setRows] = useState<SessionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
        const res = await fetch(`${backendUrl}/api/teacher/heatmap`);
        if (!res.ok) throw new Error('API unavailable');
        const data: SessionRow[] = await res.json();
        if (!cancelled) {
          setRows(data);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setRows(MOCK_DATA);
          setLoading(false);
        }
      }
    };

    fetchData();

    let channel: any = null;
    const subscribeRealtime = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
          console.log('[Dashboard] No Supabase credentials — using mock mode');
          setIsLive(true); // Mark as "live" even with mock data
          return;
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        channel = supabase
          .channel('teacher-sessions')
          .on(
            'postgres_changes',
            { event: 'INSERT', schema: 'public', table: 'sessions' },
            (payload: any) => {
              const newRow = payload.new as SessionRow;
              setRows((prev) => [newRow, ...prev]);
            }
          )
          .subscribe((status: string) => {
            if (status === 'SUBSCRIBED') setIsLive(true);
          });
      } catch {
        console.log('[Dashboard] Supabase unavailable — mock mode');
        setIsLive(true);
      }
    };

    subscribeRealtime();

    return () => {
      cancelled = true;
      if (channel) channel.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isLive) return;

    const experiments = ['Circuit Forge', 'Titration Bench', 'Enzyme Reactor'];
    const misconceptions = ['Overvoltage', 'Short Circuit', 'pH Misconception', 'Enzyme Denaturation', 'None', 'None'];

    const interval = setInterval(() => {
      const newRow: SessionRow = {
        id: `live-${Date.now()}`,
        student_id: `STU-${String(Math.floor(Math.random() * 100) + 21).padStart(3, '0')}`,
        experiment: experiments[Math.floor(Math.random() * experiments.length)],
        score: Math.floor(Math.random() * 60) + 40,
        misconception: misconceptions[Math.floor(Math.random() * misconceptions.length)],
        duration: Math.floor(Math.random() * 250) + 60,
        created_at: new Date().toISOString(),
      };
      setRows((prev) => [newRow, ...prev]);
    }, 8000);

    return () => clearInterval(interval);
  }, [isLive]);

  const stats = useMemo(() => {
    if (!rows.length) return { total: 0, avgScore: 0, topMisconception: 'N/A' };

    const avgScore = rows.reduce((s, r) => s + r.score, 0) / rows.length;

    const freq: Record<string, number> = {};
    rows.forEach((r) => {
      if (r.misconception && r.misconception !== 'None') {
        freq[r.misconception] = (freq[r.misconception] || 0) + 1;
      }
    });
    const topMisconception =
      Object.keys(freq).length > 0
        ? Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0]
        : 'None detected';

    return { total: rows.length, avgScore: Math.round(avgScore * 10) / 10, topMisconception };
  }, [rows]);

  const chartData = useMemo(() => {
    const freq: Record<string, number> = {};
    rows.forEach((r) => {
      if (r.misconception && r.misconception !== 'None') {
        freq[r.misconception] = (freq[r.misconception] || 0) + 1;
      }
    });
    return Object.entries(freq)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [rows]);

  const BAR_COLORS = ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899'];

  const handleSort = useCallback(
    (key: SortKey) => {
      if (sortKey === key) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortKey(key);
        setSortDir('desc');
      }
    },
    [sortKey]
  );

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDir === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return copy.slice(0, 20);
  }, [rows, sortKey, sortDir]);

  const columns: { key: SortKey; label: string; className?: string }[] = [
    { key: 'student_id', label: 'Student ID' },
    { key: 'experiment', label: 'Experiment' },
    { key: 'score', label: 'Score' },
    { key: 'misconception', label: 'Misconception' },
    { key: 'duration', label: 'Duration' },
    { key: 'created_at', label: 'Time' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a1a] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a1a] text-white">
      <header className="glass-navbar sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href="/"
            className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors mr-3"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-xs">Lab</span>
          </a>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/20">
            T
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold">Teacher Dashboard</h1>
              {isLive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-semibold tracking-wide">LIVE</span>
                </motion.div>
              )}
            </div>
            <p className="text-[11px] text-white/30">Real-time class analytics</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-white/25 font-mono tabular-nums">
            {rows.length} records
          </span>
          <button
            onClick={() => {
              setRows(MOCK_DATA);
            }}
            className="px-3 py-1.5 rounded-lg text-xs bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors"
          >
            Refresh
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            index={0}
            label="Total Sessions"
            value={stats.total}
            icon="/icon_periodic_table.png"
            sub="All experiments combined"
          />
          <StatCard
            index={1}
            label="Average Score"
            value={`${stats.avgScore}%`}
            icon="/icon_projectile.png"
            sub={stats.avgScore >= 70 ? 'Above benchmark' : 'Below benchmark'}
          />
          <StatCard
            index={2}
            label="Most Common Misconception"
            value={stats.topMisconception}
            icon="/icon_warning.png"
            sub="Most frequently triggered"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-white">Class Misconception Heatmap</h2>
              <p className="text-[11px] text-white/30 mt-0.5">Frequency of misconceptions across all students</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-blue-500" />
              <span className="text-[10px] text-white/30">Occurrences</span>
            </div>
          </div>

          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59,130,246,0.06)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={60}>
                  {chartData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex items-center justify-center text-white/20 text-sm">
              No misconceptions recorded yet
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="glass-panel rounded-2xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Recent Sessions</h2>
              <p className="text-[11px] text-white/30 mt-0.5">Last 20 student lab entries</p>
            </div>
            <span className="text-[10px] text-white/20 font-mono">
              Sort: {columns.find((c) => c.key === sortKey)?.label} ({sortDir})
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-6 py-3 text-left text-[10px] font-semibold text-white/30 uppercase tracking-widest cursor-pointer hover:text-white/50 transition-colors select-none"
                    >
                      {col.label}
                      <SortIcon active={sortKey === col.key} dir={sortKey === col.key ? sortDir : 'desc'} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence initial={false}>
                  {sortedRows.map((row, i) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 8 }}
                      transition={{ duration: 0.2 }}
                      className={`border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors ${i === 0 && row.id.startsWith('live-') ? 'bg-blue-500/[0.03]' : ''
                        }`}
                    >
                      <td className="px-6 py-3 font-mono text-xs text-white/60">{row.student_id}</td>
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs text-white/70">
                          <span>
                            {row.experiment === 'Circuit Forge'
                              ? <img src="/icon_ohm_law.png" className="w-4 h-4 object-contain inline" alt="Physics" />
                              : row.experiment === 'Titration Bench'
                                ? <img src="/icon_titration.png" className="w-4 h-4 object-contain inline" alt="Chemistry" />
                                : <img src="/icon_cell.png" className="w-4 h-4 object-contain inline" alt="Biology" />}
                          </span>
                          {row.experiment}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <ScoreBadge score={row.score} />
                      </td>
                      <td className="px-6 py-3 text-xs text-white/50">
                        {row.misconception === 'None' ? (
                          <span className="text-emerald-400/50">✓ None</span>
                        ) : (
                          <span className="text-amber-400/70">{row.misconception}</span>
                        )}
                      </td>
                      <td className="px-6 py-3 font-mono text-xs text-white/40">{row.duration}s</td>
                      <td className="px-6 py-3 font-mono text-[11px] text-white/30">
                        {new Date(row.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {sortedRows.length === 0 && (
            <div className="px-6 py-12 text-center text-white/20 text-sm">
              No sessions recorded yet
            </div>
          )}
        </motion.div>
      </main>

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-1/3 w-[500px] h-[500px] bg-blue-600/[0.03] rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-1/3 w-[400px] h-[400px] bg-indigo-600/[0.03] rounded-full blur-[100px]" />
      </div>
    </div>
  );
};

export default TeacherDashboard;
