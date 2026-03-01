import React, { useState, lazy, Suspense } from 'react';
import { useLabStore, LabType } from '../../store/useLabStore';
import { motion, AnimatePresence } from 'framer-motion';
import { TheoryPart } from './TheoryPart';
import { ProcedurePart } from './ProcedurePart';
import { ResourcesPart } from './ResourcesPart';
import { PredictionCard } from './PredictionCard';
import { PredictionResult } from './PredictionResult';

const OhmLawSim = lazy(() => import('./OhmLawSim').then(m => ({ default: m.OhmLawSim })));
const ProjectileSim = lazy(() => import('./ProjectileSim').then(m => ({ default: m.ProjectileSim })));
const TitrationSim = lazy(() => import('./TitrationSim').then(m => ({ default: m.TitrationSim })));
const MicroscopeSim = lazy(() => import('./MicroscopeSim').then(m => ({ default: m.MicroscopeSim })));
const OpticsSim = lazy(() => import('./OpticsSim').then(m => ({ default: m.OpticsSim })));
const LogicGatesSim = lazy(() => import('./LogicGatesSim').then(m => ({ default: m.LogicGatesSim })));
const FlameTestSim = lazy(() => import('./FlameTestSim').then(m => ({ default: m.FlameTestSim })));
const PeriodicTableSim = lazy(() => import('./PeriodicTableSim').then(m => ({ default: m.PeriodicTableSim })));
const ReactionRateSim = lazy(() => import('./ReactionRateSim').then(m => ({ default: m.ReactionRateSim })));
const CellStructureSim = lazy(() => import('./CellStructureSim').then(m => ({ default: m.CellStructureSim })));
const MitosisSim = lazy(() => import('./MitosisSim').then(m => ({ default: m.MitosisSim })));
const AnatomySim = lazy(() => import('./AnatomySim').then(m => ({ default: m.AnatomySim })));

const labDescriptions: Record<LabType, any> = {
  "ohm-law": {
    title: "Ohm's Law & Resistance",
    subtitle: "Study V-I characteristics and resistance",
    gradient: "from-blue-500/20 via-cyan-500/10 to-transparent",
    accent: "text-blue-400",
    icon: "/icon_ohm_law.png",
    component: OhmLawSim,
  },
  "projectile-motion": {
    title: "Projectile Motion",
    subtitle: "Analyze trajectory, velocity, and angles",
    gradient: "from-indigo-500/20 via-blue-500/10 to-transparent",
    accent: "text-indigo-400",
    icon: "/icon_projectile.png",
    component: ProjectileSim,
  },
  "optics-bench": {
    title: "Optics Bench",
    subtitle: "Image formation by lenses & mirrors",
    gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
    accent: "text-cyan-400",
    icon: "/icon_optics.png",
    component: OpticsSim,
  },
  "logic-gates": {
    title: "Logic Gates",
    subtitle: "Construct digital circuits with basic gates",
    gradient: "from-blue-600/20 via-indigo-600/10 to-transparent",
    accent: "text-blue-400",
    icon: "/icon_logic_gates.png",
    component: LogicGatesSim,
  },
  "titration": {
    title: "Acid-Base Titration",
    subtitle: "Determine concentration using indicators",
    gradient: "from-orange-500/20 via-rose-500/10 to-transparent",
    accent: "text-orange-400",
    icon: "/icon_titration.png",
    component: TitrationSim,
  },
  "flame-test": {
    title: "Flame Test",
    subtitle: "Identify elements by flame color",
    gradient: "from-rose-500/20 via-orange-500/10 to-transparent",
    accent: "text-rose-400",
    icon: "/icon_flame_test.png",
    component: FlameTestSim,
  },
  "periodic-table": {
    title: "Periodic Table Trends",
    subtitle: "Explore atomic properties and structures",
    gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
    accent: "text-amber-400",
    icon: "/icon_periodic_table.png",
    component: PeriodicTableSim,
  },
  "reaction-rate": {
    title: "Rate of Reaction",
    subtitle: "Effect of temp & concentration on rates",
    gradient: "from-orange-600/20 via-red-600/10 to-transparent",
    accent: "text-orange-500",
    icon: "/icon_reaction_rate.png",
    component: ReactionRateSim,
  },
  "microscope": {
    title: "Virtual Microscope",
    subtitle: "Examine onion peel and cheek cells",
    gradient: "from-emerald-500/20 via-teal-500/10 to-transparent",
    accent: "text-emerald-400",
    icon: "/icon_microscope.png",
    component: MicroscopeSim,
  },
  "cell-structure": {
    title: "Cell Structure",
    subtitle: "Functions of organelles in plant/animal cells",
    gradient: "from-teal-500/20 via-emerald-500/10 to-transparent",
    accent: "text-teal-400",
    icon: "/icon_cell.png",
    component: CellStructureSim,
  },
  "mitosis": {
    title: "Mitosis",
    subtitle: "Follow stages of somatic cell division",
    gradient: "from-green-600/20 via-emerald-600/10 to-transparent",
    accent: "text-green-500",
    icon: "/icon_mitosis.png",
    component: MitosisSim,
  },
  "anatomy": {
    title: "Human Anatomy",
    subtitle: "Explore 3D models of heart & brain",
    gradient: "from-emerald-600/20 via-teal-600/10 to-transparent",
    accent: "text-emerald-500",
    icon: "/icon_anatomy.png",
    component: AnatomySim,
  },
};

export const SimulationEngine: React.FC = () => {
  const { activeLab, activeTab, running, predictionSkipped, showPredictionResult, getPredictionConfig, inputs, addObservation } = useLabStore();
  const [initialized, setInitialized] = useState(false);
  const lab = labDescriptions[activeLab] || labDescriptions["ohm-law"];
  const hasPrediction = getPredictionConfig() !== null;

  React.useEffect(() => {
    setInitialized(false);
  }, [activeLab]);

  React.useEffect(() => {
    if (!running) return;
    addObservation({ ...inputs });
    const interval = setInterval(() => {
      const state = useLabStore.getState();
      if (state.running) {
        state.addObservation({ ...state.inputs });
      }
    }, 8000);
    return () => clearInterval(interval);
  }, [running]); // eslint-disable-line react-hooks/exhaustive-deps

  if (activeTab === 'theory') return <TheoryPart />;
  if (activeTab === 'procedure') return <ProcedurePart />;
  if (activeTab === 'resources') return <ResourcesPart />;

  const showPredictionCard = initialized && !running && hasPrediction && !predictionSkipped;

  return (
    <div id="simulation-container" className="relative w-full h-full rounded-2xl overflow-hidden">
      <AnimatePresence mode="wait">
        {!initialized ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="absolute inset-0 glass-panel rounded-2xl flex flex-col items-center justify-center p-8 text-center"
          >
            <div className={`absolute inset-0 bg-gradient-radial ${lab.gradient} pointer-events-none`} />
            <div className="relative z-10 flex flex-col items-center">
              <img src={lab.icon} alt={lab.title} className="w-28 h-28 object-contain mb-6 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
              <h2 className={`text-4xl font-black ${lab.accent} mb-4 uppercase tracking-tighter`}>{lab.title}</h2>
              <p className="text-xl text-white/50 mb-10 max-w-lg mx-auto">{lab.subtitle}</p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setInitialized(true)}
                className="group relative flex items-center gap-4 bg-orange-500 text-black px-12 py-5 rounded-full font-black uppercase tracking-[0.2em] text-sm shadow-[0_0_40px_rgba(249,115,22,0.3)]"
              >
                <div className="absolute inset-0 rounded-full bg-white/40 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
                <div className="absolute inset-0 rounded-full bg-white/30 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_1s]" />
                <div className="absolute inset-0 rounded-full bg-white/20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_2s]" />
                <div className="absolute inset-0 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors" />
                <span>Initialize Simulation</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" /></svg>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="simulator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0"
          >
            <Suspense fallback={
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="w-12 h-12 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Loading Module...</span>
              </div>
            }>
              <lab.component />
            </Suspense>

            <AnimatePresence>
              {showPredictionCard && <PredictionCard />}
            </AnimatePresence>

            <AnimatePresence>
              {showPredictionResult && <PredictionResult />}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
