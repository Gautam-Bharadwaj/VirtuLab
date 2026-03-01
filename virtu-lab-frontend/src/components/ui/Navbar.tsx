import React from 'react';

export const Navbar: React.FC = () => {
    return (
        <nav className="relative z-50 flex items-center justify-between px-4 md:px-6 h-16 glass-navbar select-none">
            <div className="flex items-center gap-4">
                <a
                    href="/"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.1] hover:border-white/20 transition-all text-white/60 hover:text-white group"
                >
                    <svg className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7 7-7" />
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:inline">Exit Lab</span>
                </a>

                <a
                    href="/"
                    className="flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 shrink-0"
                >
                    <span className="text-2xl font-black tracking-tighter text-white">
                        VirtuLab<span className="text-orange-500">.ai</span>
                    </span>
                </a>
            </div>

        </nav>
    );
};
