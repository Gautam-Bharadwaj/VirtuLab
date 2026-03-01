import React, { ReactNode } from 'react';
import { useLabStore } from '../../store/useLabStore';
import { Navbar } from './Navbar';
import { BottomBar } from './BottomBar';
import SkillRadar from './SkillRadar';
import { motion } from 'framer-motion';

interface LabShellProps {
  children: ReactNode;
  sidebar: ReactNode;
  tutor: ReactNode;
}

export const LabShell: React.FC<LabShellProps> = ({ children, sidebar, tutor }) => {
  const {
    sidebarOpen,
    tutorOpen,
    toggleSidebar,
    toggleTutor,
    showSkillRadar,
    setShowSkillRadar,
    score,
    mistakeCount,
    experimentDuration,
    failureState,
  } = useLabStore();

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0a0a1a] overflow-hidden">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area — forced horizontal flex */}
      <div className="flex-1 flex flex-row overflow-hidden relative min-h-0">
        {/* Sidebar Toggle (when collapsed) */}
        {!sidebarOpen && (
          <motion.button
            key="toggle-btn"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            onClick={toggleSidebar}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-24 bg-white/[0.03] border border-white/[0.08] rounded-full flex items-center justify-center hover:bg-white/[0.06] transition-colors group z-20"
          >
            <svg className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        )}

        {/* Left Sidebar — fixed width, no shrink */}
        {sidebarOpen && (
          <div
            id="controls-sidebar"
            className="relative flex-shrink-0 w-[340px] border-r border-white/[0.04] overflow-y-auto overflow-x-hidden"
          >
            {/* Collapse button */}
            <button
              id="collapse-sidebar"
              onClick={toggleSidebar}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors"
              title="Collapse sidebar"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {sidebar}
          </div>
        )}

        {/* Center: Simulation Canvas — takes remaining space */}
        <main
          id="simulation-container"
          className={`flex-1 min-w-0 p-4 pb-24 overflow-hidden h-full flex flex-col transition-[margin] duration-300 ${tutorOpen ? 'mr-[320px]' : 'mr-0'}`}
        >
          {/* OLabs Style Tab Bar */}
          <div className="flex-shrink-0 flex items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-2xl mb-4 w-fit self-center z-10">
            {(["theory", "procedure", "simulator", "resources"] as const).map((tab) => {
              const { activeTab, setActiveTab } = (useLabStore as any)();
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${activeTab === tab
                    ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20"
                    : "text-white/40 hover:text-white/80 hover:bg-white/5"
                    }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          <div className="flex-1 min-h-0 relative">
            {children}
          </div>
        </main>

        {/* Right: AI Tutor Panel (positioned fixed inside the aside component) */}
        {tutor}

        {/* Tutor Toggle (when collapsed) */}
        {!tutorOpen && (
          <motion.button
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={toggleTutor}
            className="absolute right-3 top-4 z-30 p-2 rounded-lg glass-panel hover:bg-white/[0.08] transition-colors"
            title="Open Lab Mentor"
          >
            <span className="text-lg">🤖</span>
          </motion.button>
        )}
      </div>

      {/* Bottom Stats Bar */}
      <BottomBar />

      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/[0.04] rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/[0.04] rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/[0.02] rounded-full blur-[120px]" />
      </div>

      {/* Skill Radar Modal — appears when experiment is stopped */}
      <SkillRadar
        score={score}
        mistakeCount={mistakeCount}
        duration={experimentDuration}
        failureTriggered={!!failureState}
        isOpen={showSkillRadar}
        onClose={() => setShowSkillRadar(false)}
      />
    </div>
  );
};
