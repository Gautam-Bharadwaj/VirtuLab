import React from 'react';
import { useLabStore, LabType } from '../../store/useLabStore';
import { motion } from 'framer-motion';

interface SliderDef {
  inputKey: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  icon: string;
  logarithmic?: boolean;
}

const sliderDefs: Record<LabType, SliderDef[]> = {
  "ohm-law": [
    { inputKey: 'voltage', label: 'Voltage', min: 0, max: 24, step: 0.5, unit: 'V', icon: '⚡' },
    { inputKey: 'resistance', label: 'Resistance', min: 1, max: 1000, step: 1, unit: 'Ω', icon: '🔩' },
  ],
  "projectile-motion": [
    { inputKey: 'angle', label: 'Launch Angle', min: 0, max: 90, step: 1, unit: '°', icon: '📐' },
    { inputKey: 'velocity', label: 'Initial Velocity', min: 0, max: 50, step: 1, unit: 'm/s', icon: '💨' },
  ],
  "optics-bench": [
    { inputKey: 'focalLength', label: 'Focal Length', min: 5, max: 50, step: 1, unit: 'cm', icon: '👓' },
    { inputKey: 'objectDistance', label: 'Object Distance', min: 5, max: 100, step: 1, unit: 'cm', icon: '📏' },
  ],
  "logic-gates": [
    { inputKey: 'gateType', label: 'Gate Type', min: 1, max: 5, step: 1, unit: '', icon: '🔌' },
  ],
  "titration": [
    { inputKey: 'baseVolume', label: 'Base Volume', min: 0, max: 50, step: 0.1, unit: 'mL', icon: '💧' },
  ],
  "flame-test": [
    { inputKey: 'elementIdx', label: 'Sample Index', min: 0, max: 6, step: 1, unit: '', icon: '🔥' },
  ],
  "periodic-table": [
    { inputKey: 'elementIdx', label: 'Atomic Number', min: 1, max: 118, step: 1, unit: '', icon: '📊' },
  ],
  "reaction-rate": [
    { inputKey: 'temperature', label: 'Temperature', min: 0, max: 100, step: 1, unit: '°C', icon: '🌡️' },
    { inputKey: 'concentration', label: 'Conc.', min: 0.1, max: 5, step: 0.1, unit: 'M', icon: '🧪' },
  ],
  "mitosis": [
    { inputKey: 'stage', label: 'Time Step', min: 0, max: 100, step: 1, unit: '%', icon: '✂️' },
  ],
};

const labMeta: Record<LabType, { title: string; icon: string; desc: string; accent: string }> = {
  "ohm-law": { title: 'Ohm’s Law', icon: '⚡', desc: 'Voltage & Current', accent: 'from-blue-500/30 to-cyan-600/30' },
  "projectile-motion": { title: 'Projectile', icon: '🎯', desc: 'Trajectory Physics', accent: 'from-indigo-500/30 to-blue-600/30' },
  "optics-bench": { title: 'Optics', icon: '🔍', desc: 'Light & Lenses', accent: 'from-cyan-500/30 to-blue-600/30' },
  "logic-gates": { title: 'Logic Gates', icon: '🔌', desc: 'Digital Circuits', accent: 'from-blue-600/30 to-indigo-700/30' },
  "titration": { title: 'Titration', icon: '🧪', desc: 'Acid-Base Analysis', accent: 'from-orange-500/30 to-rose-600/30' },
  "flame-test": { title: 'Flame Test', icon: '🔥', desc: 'Salt Analysis', accent: 'from-rose-500/30 to-orange-600/30' },
  "periodic-table": { title: 'Periodic Table', icon: '📊', desc: 'Atomic Trends', accent: 'from-amber-500/30 to-orange-600/30' },
  "reaction-rate": { title: 'Reaction Rate', icon: '⏱️', desc: 'Kinetics Study', accent: 'from-orange-600/30 to-red-700/30' },
  "mitosis": { title: 'Mitosis', icon: '✂️', desc: 'Cell Division', accent: 'from-green-600/30 to-emerald-700/30' },
};

const ParameterControl: React.FC<{
  slider: SliderDef;
  value: number;
  onChange: (val: number) => void;
}> = ({ slider, value, onChange }) => {
  const [localValue, setLocalValue] = React.useState(value.toString());

  React.useEffect(() => {
    setLocalValue(value.toString());
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const s = e.target.value;
    setLocalValue(s);
    if (s !== '') {
      const num = parseFloat(s);
      if (!isNaN(num)) {
        onChange(num);
      }
    }
  };

  return (
    <div className="glass-panel p-4 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2.5">
          <span className="text-base">{slider.icon}</span>
          <span className="text-xs font-semibold text-white/70 group-hover:text-white transition-colors">{slider.label}</span>
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            min={slider.min}
            max={slider.max}
            step={slider.step}
            value={localValue}
            onChange={handleTextChange}
            onBlur={() => setLocalValue(value.toString())}
            className="w-16 text-right bg-orange-500/10 text-orange-400 text-xs font-mono font-bold px-2 py-0.5 rounded-md border border-orange-500/20 focus:outline-none focus:border-orange-500/50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">{slider.unit}</span>
        </div>
      </div>
      <input
        type="range"
        min={slider.min}
        max={slider.max}
        step={slider.step}
        value={isNaN(value) ? slider.min : value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-orange-500 h-1.5 bg-white/5 rounded-full appearance-none cursor-pointer"
      />
    </div>
  );
};

export const ControlsSidebar: React.FC = () => {
  const { activeLab, inputs, updateInput, running, startExperiment, stopExperiment, resetExperiment, setShowLabReport } = useLabStore();

  const currentSliders = sliderDefs[activeLab] || [];

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-80 h-full flex flex-col gap-6 p-6 overflow-y-auto no-scrollbar relative z-10"
    >
      <div className="relative group">
        <div className={`absolute -inset-4 bg-gradient-to-br ${labMeta[activeLab].accent} opacity-20 blur-2xl rounded-[3rem] group-hover:opacity-30 transition-opacity`} />
        <div className="relative glass-panel rounded-3xl p-6 border border-white/10">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center text-2xl shadow-inner border border-white/5">
              {labMeta[activeLab].icon}
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight leading-none mb-1 uppercase">
                {labMeta[activeLab].title}
              </h1>
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                {labMeta[activeLab].desc}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              {!running ? (
                <button
                  onClick={startExperiment}
                  className="flex-1 bg-white text-black h-11 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  Run
                </button>
              ) : (
                <button
                  onClick={stopExperiment}
                  className="flex-1 bg-rose-500 text-white h-11 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-rose-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <div className="w-2.5 h-2.5 bg-white rounded-sm animate-pulse" />
                  Stop
                </button>
              )}
              <button
                onClick={() => useLabStore.getState().setShowChallengePanel(true)}
                className="w-11 h-11 rounded-xl glass-panel border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-orange-500/20 hover:border-orange-500/30 transition-all"
                title="AI Challenge"
              >
                <svg className="w-5 h-5 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
              <button
                onClick={resetExperiment}
                className="w-11 h-11 rounded-xl glass-panel border border-white/10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all"
                title="Reset"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
            </div>

            <button
              onClick={() => setShowLabReport(true)}
              className="w-full bg-blue-500/10 text-blue-400 h-11 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 border border-blue-500/20 shadow-lg shadow-blue-500/5 group"
            >
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Task Report
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-2">Parameters</h3>
        <div className="space-y-3">
          {currentSliders.map((slider) => (
            <ParameterControl
              key={slider.inputKey}
              slider={slider}
              value={inputs[slider.inputKey] ?? slider.min}
              onChange={(val) => updateInput(slider.inputKey, val)}
            />
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-4">
        <h3 className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-3">Simulation Catalog</h3>
        <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto no-scrollbar">
          {(Object.keys(labMeta) as LabType[]).map((key) => (
            <button
              key={key}
              onClick={() => {
                useLabStore.getState().setActiveLab(key);
              }}
              className={`p-2 rounded-xl border transition-all text-left group ${activeLab === key
                ? 'bg-orange-500/10 border-orange-500/40'
                : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.1]'
                }`}
            >
              <div className="text-lg mb-1">{labMeta[key].icon}</div>
              <div className={`text-[9px] font-bold uppercase truncate ${activeLab === key ? 'text-orange-400' : 'text-white/40 group-hover:text-white/60'}`}>
                {labMeta[key].title}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-4">
        <h3 className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2">Quick Tips</h3>
        <ul className="space-y-1.5 text-[11px] text-white/35 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-blue-400/60 mt-px">›</span>
            Adjust parameters to observe real-time changes
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400/60 mt-px">›</span>
            Switch labs anytime from the catalog above
          </li>
        </ul>
      </div>
    </motion.aside>
  );
};
