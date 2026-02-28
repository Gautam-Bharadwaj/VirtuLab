import React from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { useLabStore } from '../../store/useLabStore';
import CircuitSim from './CircuitSim';
import TitrationSim from './TitrationSim';
import EnzymeSim from './EnzymeSim';

const SimulationEngine: React.FC = () => {
  const activeLab = useLabStore((s) => s.activeLab);

  return (
    <div className="w-full h-full relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLab}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="w-full h-full absolute inset-0"
        >
          <Canvas
            camera={{ position: [0, 2, 8], fov: 50 }}
            gl={{ antialias: true }}
            style={{ background: '#0a0a1a' }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#3b82f6" />

            {activeLab === 'circuit' && <CircuitSim />}
            {activeLab === 'titration' && <TitrationSim />}
            {activeLab === 'enzyme' && <EnzymeSim />}
          </Canvas>
        </motion.div>
      </AnimatePresence>

      {/* Overlay label */}
      <div className="absolute top-4 left-4 pointer-events-none">
        <span className="text-white/30 font-mono text-xs tracking-widest uppercase">
          {activeLab} engine
        </span>
      </div>
    </div>
  );
};

export default SimulationEngine;
