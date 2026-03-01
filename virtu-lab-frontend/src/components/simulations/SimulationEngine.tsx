import React, { useState } from 'react';
import { useLabStore } from '../../store/useLabStore';
import { motion, AnimatePresence } from 'framer-motion';
import { TheoryPart } from './TheoryPart';
import { ProcedurePart } from './ProcedurePart';
import { ResourcesPart } from './ResourcesPart';
import { PendulumSim } from './PendulumSim';
import { CircuitSim } from './CircuitSim';
import { TitrationSim } from './TitrationSim';
import { GravitySim } from './GravitySim';
import { MicroscopeSim } from './MicroscopeSim';

const labDescriptions: Record<string, any> = {
  circuit: {
    title: 'Circuit Forge',
    subtitle: 'Build & simulate electrical circuits',
    gradient: 'from-amber-500/20 via-orange-500/10 to-transparent',
    accent: 'text-amber-400',
    icon: '⚡',
    component: <CircuitSim />,
    animation: <CircuitAnimation />,
  },
  titration: {
    title: 'Titration Bench',
    subtitle: 'Acid-base titration experiments',
    gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent',
    accent: 'text-emerald-400',
    icon: '🧪',
    component: <TitrationSim />,
    animation: <TitrationAnimation />,
  },
  enzyme: {
    title: 'Microscope Cell View',
    subtitle: 'Inspect micro-organic structures',
    gradient: 'from-purple-500/20 via-violet-500/10 to-transparent',
    accent: 'text-purple-400',
    icon: '🧬',
    component: <MicroscopeSim />,
    animation: <EnzymeAnimation />,
  },
  pendulum: {
    title: 'Pendulum Motion',
    subtitle: 'Study harmonic motion & gravity',
    gradient: 'from-blue-500/20 via-indigo-500/10 to-transparent',
    accent: 'text-blue-400',
    icon: '⏱️',
    component: <PendulumSim />,
    animation: <PendulumAnimation />,
  },
  gravity: {
    title: 'Gravity Sandbox',
    subtitle: 'Planetary orbits & attraction',
    gradient: 'from-rose-500/20 via-red-500/10 to-transparent',
    accent: 'text-rose-400',
    icon: '🪐',
    component: <GravitySim />,
    animation: <GravityAnimation />,
  },
};

function PendulumAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-20">
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <motion.g
          animate={{ rotate: [-45, 45, -45] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: '200px 50px' }}
        >
          <line x1="200" y1="50" x2="200" y2="220" stroke="#60A5FA" strokeWidth="2" />
          <circle cx="200" cy="220" r="15" fill="#3B82F6" />
          <circle cx="200" cy="220" r="8" fill="#93C5FD" opacity="0.5" />
        </motion.g>
        <line x1="150" y1="50" x2="250" y2="50" stroke="#60A5FA" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}

function GravityAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-20">
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <circle cx="200" cy="150" r="30" fill="#FB7185" />
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '200px 150px' }}
        >
          <circle cx="320" cy="150" r="10" fill="#F43F5E" />
          <ellipse cx="200" cy="150" rx="120" ry="60" fill="none" stroke="#FDA4AF" strokeWidth="1" strokeDasharray="5 5" />
        </motion.g>
        <motion.g
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: '200px 150px' }}
        >
          <circle cx="270" cy="150" r="6" fill="#E11D48" />
          <ellipse cx="200" cy="150" rx="70" ry="35" fill="none" stroke="#FDA4AF" strokeWidth="0.5" strokeDasharray="3 3" />
        </motion.g>
      </svg>
    </div>
  );
}

function CircuitAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-20">
      {/* Animated circuit paths */}
      <svg className="w-full h-full" viewBox="0 0 400 300">
        <motion.path
          d="M 50 150 L 120 150 L 120 80 L 280 80 L 280 150 L 350 150"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
        />
        <motion.path
          d="M 50 150 L 120 150 L 120 220 L 280 220 L 280 150 L 350 150"
          fill="none"
          stroke="#F59E0B"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatType: 'loop' }}
        />
        {/* Moving electrons */}
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.circle
            key={i}
            r="3"
            fill="#FBBF24"
            initial={{ offsetDistance: '0%' }}
            animate={{ offsetDistance: '100%' }}
            transition={{ duration: 3, delay: i * 0.6, repeat: Infinity, ease: 'linear' }}
            style={{ offsetPath: "path('M 50 150 L 120 150 L 120 80 L 280 80 L 280 150 L 350 150')" }}
          />
        ))}
        {/* Resistor symbols */}
        <motion.rect x="170" y="68" width="60" height="24" rx="4" fill="none" stroke="#F59E0B" strokeWidth="1.5"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.rect x="170" y="208" width="60" height="24" rx="4" fill="none" stroke="#F59E0B" strokeWidth="1.5"
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, delay: 0.5, repeat: Infinity }}
        />
        {/* Battery */}
        <line x1="50" y1="130" x2="50" y2="170" stroke="#F59E0B" strokeWidth="3" />
        <line x1="40" y1="140" x2="40" y2="160" stroke="#F59E0B" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function TitrationAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-20">
      <svg className="w-full h-full" viewBox="0 0 400 300">
        {/* Burette */}
        <rect x="185" y="20" width="30" height="120" rx="4" fill="none" stroke="#10B981" strokeWidth="1.5" />
        <motion.rect
          x="187" y="22" width="26" height="116" rx="3"
          fill="#10B981"
          initial={{ scaleY: 1 }}
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
          style={{ transformOrigin: 'top' }}
        />
        {/* Drops */}
        {[0, 1, 2].map((i) => (
          <motion.ellipse
            key={i}
            cx="200"
            rx="4"
            ry="6"
            fill="#34D399"
            initial={{ cy: 140, opacity: 1 }}
            animate={{ cy: 200, opacity: 0 }}
            transition={{ duration: 1.5, delay: i * 0.8, repeat: Infinity }}
          />
        ))}
        {/* Beaker */}
        <path d="M 140 200 L 140 270 Q 140 280 150 280 L 250 280 Q 260 280 260 270 L 260 200" fill="none" stroke="#10B981" strokeWidth="1.5" />
        <motion.rect
          x="142" y="220" width="116" height="58" rx="2"
          fill="#10B981"
          initial={{ opacity: 0.15 }}
          animate={{ opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        {/* Stir bar */}
        <motion.line
          x1="180" y1="265" x2="220" y2="265"
          stroke="#6EE7B7"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '200px 265px' }}
        />
      </svg>
    </div>
  );
}

function EnzymeAnimation() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden opacity-20">
      <svg className="w-full h-full" viewBox="0 0 400 300">
        {/* DNA-like helix */}
        {Array.from({ length: 12 }).map((_, i) => (
          <React.Fragment key={i}>
            <motion.circle
              cx={200 + Math.sin(i * 0.5) * 60}
              cy={30 + i * 22}
              r="5"
              fill="#A855F7"
              animate={{
                cx: [200 + Math.sin(i * 0.5) * 60, 200 + Math.sin(i * 0.5 + Math.PI) * 60, 200 + Math.sin(i * 0.5) * 60],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.circle
              cx={200 + Math.sin(i * 0.5 + Math.PI) * 60}
              cy={30 + i * 22}
              r="5"
              fill="#C084FC"
              animate={{
                cx: [200 + Math.sin(i * 0.5 + Math.PI) * 60, 200 + Math.sin(i * 0.5) * 60, 200 + Math.sin(i * 0.5 + Math.PI) * 60],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.line
              x1={200 + Math.sin(i * 0.5) * 60}
              y1={30 + i * 22}
              x2={200 + Math.sin(i * 0.5 + Math.PI) * 60}
              y2={30 + i * 22}
              stroke="#7C3AED"
              strokeWidth="1"
              animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2, delay: i * 0.15, repeat: Infinity }}
            />
          </React.Fragment>
        ))}
        {/* Floating enzyme molecules */}
        {[
          { x: 80, y: 80 },
          { x: 320, y: 120 },
          { x: 90, y: 240 },
          { x: 310, y: 220 },
        ].map((pos, i) => (
          <motion.g key={i}
            animate={{
              x: [0, Math.sin(i) * 15, 0],
              y: [0, Math.cos(i) * 10, 0],
            }}
            transition={{ duration: 3 + i, repeat: Infinity, ease: 'easeInOut' }}
          >
            <circle cx={pos.x} cy={pos.y} r="12" fill="none" stroke="#A855F7" strokeWidth="1" strokeDasharray="4 2" />
            <circle cx={pos.x} cy={pos.y} r="5" fill="#C084FC" opacity="0.4" />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

export const SimulationEngine: React.FC = () => {
  const { activeLab, activeTab } = useLabStore();
  const [initialized, setInitialized] = useState(false);
  const lab = labDescriptions[activeLab] || labDescriptions['circuit']; // Fallback to circuit

  // Reset initialization when switching labs
  React.useEffect(() => {
    setInitialized(false);
  }, [activeLab]);

  if (activeTab === 'theory') return <TheoryPart />;
  if (activeTab === 'procedure') return <ProcedurePart />;
  if (activeTab === 'resources') return <ResourcesPart />;

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
            {lab.animation}
