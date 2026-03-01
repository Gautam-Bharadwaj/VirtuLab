import React from 'react';
import { useLabStore } from '../../store/useLabStore';
import { motion } from 'framer-motion';

const trendArrows = {
    up: (
        <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
    ),
    down: (
        <svg className="w-3.5 h-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
    ),
    stable: (
        <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14" />
        </svg>
    ),
};

const trendColors = {
    up: 'shadow-emerald-500/10 border-emerald-500/10',
    down: 'shadow-rose-500/10 border-rose-500/10',
    stable: 'shadow-blue-500/10 border-blue-500/10',
};

export const BottomBar: React.FC = () => {
    const { stats, tutorOpen } = useLabStore();

    return (
        <div
            className="fixed bottom-0 left-0 z-40 h-20 flex items-center px-4 md:px-6 gap-3 glass-navbar border-t border-white/[0.04] transition-all duration-300"
            style={{ right: tutorOpen ? '320px' : '0px' }}
        >
            {stats.map((stat, i) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08, duration: 0.3 }}
                    className={`flex-1 glass-panel rounded-xl p-3 flex items-center gap-3 hover:bg-white/[0.06] transition-all duration-200 cursor-default group ${stat.trend ? trendColors[stat.trend] : ''
                        }`}
                >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-white/[0.06] to-white/[0.02] flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                        <img src={stat.icon} alt={stat.label} className="w-5 h-5 object-contain" />
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                            <span className="text-lg font-bold text-white font-mono tracking-tight">
                                {stat.value}
                            </span>
                            <span className="text-xs text-white/30 font-medium">{stat.unit}</span>
                            {stat.trend && (
                                <span className="ml-auto">{trendArrows[stat.trend]}</span>
                            )}
                        </div>
                        <p className="text-[10px] text-white/35 font-medium uppercase tracking-wider truncate">
                            {stat.label}
                        </p>
                    </div>
                </motion.div>
            ))}
        </div>
    );
};
