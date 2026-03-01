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
