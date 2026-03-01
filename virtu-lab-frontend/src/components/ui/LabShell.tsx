import React, { ReactNode, useEffect } from 'react';
import { useLabStore } from '../../store/useLabStore';
import { Navbar } from './Navbar';
import { BottomBar } from './BottomBar';
import SkillRadar from './SkillRadar';
import { motion, AnimatePresence } from 'framer-motion';
import { PredictionCard } from '../features/PredictionCard';
import { PredictionComparison } from '../features/PredictionComparison';
import { LabReportModal } from '../features/LabReportModal';
import { ChallengePanel } from '../features/ChallengePanel';

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
    predictionPhase,
    running,
    addObservation,
  } = useLabStore();

  // Record observations every 5 seconds while experiment is running
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      const state = useLabStore.getState();
      const obs: Record<string, number> = { ...state.inputs };
      // Compute derived values
      if (state.activeLab === 'circuit') {
        obs.current = (state.inputs.voltage ?? 5) / (state.inputs.resistance ?? 20);
        obs.power = obs.current * obs.current * (state.inputs.resistance ?? 20);
      } else if (state.activeLab === 'titration') {
        obs.pH = 7 + 3.5 * Math.tanh(((state.inputs.baseVolume ?? 0) - 25) / 3);
      } else if (state.activeLab === 'enzyme') {
        const Vmax = 10 * Math.exp(-0.01 * Math.pow((state.inputs.temperature ?? 37) - 37, 2));
        obs.reactionRate = (Vmax * (state.inputs.substrateConcentration ?? 5)) / (2.5 + (state.inputs.substrateConcentration ?? 5));
      } else if (state.activeLab === 'pendulum') {
        obs.period = 2 * Math.PI * Math.sqrt((state.inputs.length ?? 2) / (state.inputs.gravity ?? 9.8));
      }
      addObservation(obs);
    }, 5000);
    return () => clearInterval(interval);
  }, [running, addObservation]);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0a0a1a] overflow-hidden">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
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

        {/* Left Sidebar */}
        {sidebarOpen && (
          <div
            id="controls-sidebar"
            className="relative flex-shrink-0 w-[340px] border-r border-white/[0.04] overflow-y-auto overflow-x-hidden"
          >
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

        {/* Center: Simulation Canvas */}
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

            {/* ── Feature Overlays ── */}
            <AnimatePresence>
              {predictionPhase === 'predict' && <PredictionCard />}
              {predictionPhase === 'comparison' && <PredictionComparison />}
            </AnimatePresence>
          </div>
        </main>

        {/* Right: AI Tutor Panel */}
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

      {/* Skill Radar Modal */}
      <SkillRadar
        score={score}
        mistakeCount={mistakeCount}
        duration={experimentDuration}
        failureTriggered={!!failureState}
        isOpen={showSkillRadar}
        onClose={() => setShowSkillRadar(false)}
      />

      {/* Lab Report Modal */}
      <LabReportModal />

      {/* Challenge Panel */}
      <AnimatePresence>
        {predictionPhase === 'challenge' && <ChallengePanel />}
      </AnimatePresence>
    </div>
  );
};
