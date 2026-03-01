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
