import React, { useRef } from 'react';
import { useLabStore, LabType } from '../../store/useLabStore';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Slider definition per lab ─── */
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
  circuit: [
    { inputKey: 'voltage', label: 'Voltage', min: 0, max: 24, step: 0.5, unit: 'V', icon: '⚡' },
    { inputKey: 'resistance', label: 'Resistance', min: 1, max: 1000, step: 1, unit: 'Ω', icon: '🔧', logarithmic: true },
  ],
  titration: [
    { inputKey: 'baseVolume', label: 'Base Volume', min: 0, max: 50, step: 0.5, unit: 'mL', icon: '💧' },
  ],
  enzyme: [
    { inputKey: 'temperature', label: 'Temperature', min: 0, max: 100, step: 1, unit: '°C', icon: '🌡️' },
    { inputKey: 'substrateConcentration', label: 'Substrate Conc.', min: 0, max: 20, step: 0.5, unit: 'mmol/L', icon: '🧬' },
  ],
  pendulum: [
    { inputKey: 'length', label: 'String Length', min: 0.5, max: 5, step: 0.1, unit: 'm', icon: '📏' },
    { inputKey: 'gravity', label: 'Gravity', min: 1, max: 25, step: 0.1, unit: 'm/s²', icon: '🌍' },
    { inputKey: 'angle', label: 'Start Angle', min: 5, max: 90, step: 1, unit: '°', icon: '📐' },
  ],
  gravity: [
    { inputKey: 'planetMass', label: 'Planet Mass', min: 50, max: 500, step: 10, unit: 'Me', icon: '🌑' },
    { inputKey: 'objectDistance', label: 'Distance', min: 20, max: 200, step: 5, unit: 'km', icon: '📏' },
  ],
};

const labMeta: Record<LabType, { title: string; icon: string; desc: string; accent: string }> = {
  circuit: { title: 'Circuit Forge', icon: '⚡', desc: 'Configure circuit parameters', accent: 'from-amber-500/30 to-orange-600/30' },
  titration: { title: 'Titration Bench', icon: '🧪', desc: 'Set titration volumes', accent: 'from-emerald-500/30 to-teal-600/30' },
  enzyme: { title: 'Microscope Cell View', icon: '🧬', desc: 'Adjust reaction conditions', accent: 'from-purple-500/30 to-violet-600/30' },
  pendulum: { title: 'Pendulum Motion', icon: '⏱️', desc: 'Study harmonic motion parameters', accent: 'from-blue-500/30 to-cyan-600/30' },
  gravity: { title: 'Gravity Sandbox', icon: '🪐', desc: 'Configure orbital mechanics', accent: 'from-rose-500/30 to-red-600/30' },
};

/* ─── Logarithmic helpers ─── */
function logToLinear(value: number, min: number, max: number): number {
  const minLog = Math.log(min || 1);
  const maxLog = Math.log(max);
  return (Math.log(value || 1) - minLog) / (maxLog - minLog) * 100;
}

function linearToLog(position: number, min: number, max: number): number {
  const minLog = Math.log(min || 1);
  const maxLog = Math.log(max);
  return Math.round(Math.exp(minLog + (position / 100) * (maxLog - minLog)));
}

/* ─── Format slider value display ─── */
function formatValue(value: number, step: number): string {
  if (step >= 1) return Math.round(value).toString();
  if (step >= 0.1) return value.toFixed(1);
  return value.toFixed(2);
}

/* ─── Slider Component ─── */
const LabSlider: React.FC<{
  def: SliderDef;
  value: number;
  onChange: (val: number) => void;
  index: number;
}> = ({ def, value, onChange, index }) => {
  const isLog = def.logarithmic;
  const sliderPos = isLog ? logToLinear(value, def.min, def.max) : undefined;
  const fillPercent = isLog
    ? sliderPos!
    : ((value - def.min) / (def.max - def.min)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = parseFloat(e.target.value);
    if (isLog) {
      onChange(linearToLog(raw, def.min, def.max));
    } else {
      onChange(raw);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06, duration: 0.25 }}
      className="glass-panel rounded-xl p-4 group hover:border-white/[0.12] transition-colors"
    >
      {/* Label row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base">{def.icon}</span>
          <label className="text-sm font-medium text-white/80">{def.label}</label>
        </div>
        <motion.span
          key={value}
          initial={{ scale: 1.15, color: '#60a5fa' }}
          animate={{ scale: 1, color: '#93c5fd' }}
          transition={{ duration: 0.2 }}
          className="text-xs font-mono bg-blue-500/15 text-blue-300 px-2.5 py-1 rounded-lg border border-blue-500/20 tabular-nums"
        >
          {formatValue(value, def.step)} {def.unit}
        </motion.span>
      </div>

      {/* Slider track */}
      <div className="relative">
        <input
          id={`slider-${def.inputKey}`}
          type="range"
          min={isLog ? 0 : def.min}
          max={isLog ? 100 : def.max}
          step={isLog ? 0.1 : def.step}
          value={isLog ? sliderPos : value}
          onChange={handleChange}
          className="lab-slider w-full"
          style={{
            '--fill-percent': `${fillPercent}%`,
          } as React.CSSProperties}
        />
      </div>

      {/* Range labels */}
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-white/20 font-mono">
          {def.min} {def.unit}
        </span>
        {isLog && (
          <span className="text-[9px] text-white/15 italic">log scale</span>
        )}
        <span className="text-[10px] text-white/20 font-mono">
          {def.max} {def.unit}
        </span>
      </div>
    </motion.div>
  );
};

/* ─── Main Component ─── */
export const ControlsSidebar: React.FC = () => {
  const {
    activeLab,
    inputs,
    updateInput,
    running,
    startExperiment,
    stopExperiment,
    resetExperiment,
    failureState,
    sidebarOpen,
    predictionPhase,
    setPredictionPhase,
  } = useLabStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const sliders = sliderDefs[activeLab];
  const meta = labMeta[activeLab];

  // Start button now triggers prediction phase first
  const handleStart = () => {
    if (predictionPhase === 'idle') {
      setPredictionPhase('predict');
    } else {
      startExperiment();
    }
  };

  if (!sidebarOpen) return null;

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full overflow-y-auto p-4 space-y-3 select-none scrollbar-thin"
    >
      {/* ── Lab Header ── */}
      <div className="glass-panel rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${meta.accent} flex items-center justify-center text-xl border border-white/[0.08] shadow-lg`}>
            {meta.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-base font-semibold text-white truncate">{meta.title}</h2>
            <p className="text-[11px] text-white/35">{meta.desc}</p>
          </div>
          {running && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/20"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-medium">LIVE</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── Failure Alert ── */}
      <AnimatePresence>
        {failureState && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="relative overflow-hidden rounded-xl border border-red-500/30"
          >
            {/* Pulsing background */}
            <motion.div
              className="absolute inset-0 bg-red-500/10"
              animate={{ opacity: [0.05, 0.15, 0.05] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="relative p-4 flex items-start gap-3">
              {/* Warning icon */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-9 h-9 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0 border border-red-500/20"
              >
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </motion.div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-red-300">{failureState.name}</h4>
                <p className="text-[11px] text-red-400/70 mt-0.5 leading-relaxed">{failureState.description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Dynamic Sliders ── */}
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {sliders.map((def, i) => (
              <LabSlider
                key={def.inputKey}
                def={def}
                value={inputs[def.inputKey] ?? 0}
                onChange={(val) => updateInput(def.inputKey, val)}
                index={i}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Experiment Action Buttons ── */}
      <div className="space-y-2 pt-1">
        {/* Start */}
        {!running ? (
          <motion.button
            id="start-experiment"
            whileTap={{ scale: 0.97 }}
            onClick={handleStart}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 text-white font-semibold text-sm shadow-lg shadow-emerald-500/15 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 group"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start Experiment
          </motion.button>
        ) : (
          <motion.button
            id="stop-experiment"
            whileTap={{ scale: 0.97 }}
            onClick={stopExperiment}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white font-semibold text-sm shadow-lg shadow-red-500/15 hover:shadow-red-500/30 transition-all flex items-center justify-center gap-2 group"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
              <rect x="6" y="6" width="12" height="12" rx="2" />
            </svg>
            Stop Experiment
          </motion.button>
        )}

        {/* Reset */}
        <motion.button
          id="reset-experiment"
          whileTap={{ scale: 0.97 }}
          onClick={resetExperiment}
          className="w-full py-2.5 rounded-xl bg-white/[0.04] text-white/50 font-medium text-sm border border-white/[0.06] hover:bg-white/[0.08] hover:text-white/70 transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </motion.button>
      </div>

      {/* ── Upload Diagram (Vision-to-Sim) ── */}
      <div className="pt-1">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          id="diagram-upload-input"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              // TODO: Wire to Vision-to-Sim pipeline
              console.log('Diagram uploaded:', file.name);
            }
          }}
        />
        <motion.button
          id="upload-diagram"
          whileTap={{ scale: 0.97 }}
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-3 rounded-xl glass-panel border-dashed border-white/[0.1] hover:border-blue-500/30 hover:bg-blue-500/[0.04] transition-all flex items-center justify-center gap-2.5 text-white/40 hover:text-blue-300 group"
        >
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-blue-500/10 flex items-center justify-center transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="text-left">
            <span className="text-sm font-medium block">Upload Diagram</span>
            <span className="text-[10px] text-white/25 group-hover:text-blue-400/50">Vision-to-Sim • Snap or upload</span>
          </div>
        </motion.button>
      </div>

      {/* ── Simulation Catalog (Quick Switch) ── */}
      <div className="glass-panel rounded-2xl p-4">
        <h3 className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-3">Simulation Catalog</h3>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(labMeta) as LabType[]).map((key) => (
            <button
              key={key}
              onClick={() => {
                (useLabStore.getState() as any).setActiveLab(key);
              }}
              className={`p-2 rounded-xl border transition-all text-left group ${activeLab === key
                ? 'bg-orange-500/10 border-orange-500/40'
                : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.06] hover:border-white/[0.1]'
                }`}
            >
              <div className="text-lg mb-1">{labMeta[key].icon}</div>
              <div className={`text-[9px] font-bold uppercase truncate ${activeLab === key ? 'text-orange-400' : 'text-white/40 group-hover:text-white/60'}`}>
                {labMeta[key].title.split(' ')[0]}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Quick Tips ── */}
      <div className="glass-panel rounded-2xl p-4">
        <h3 className="text-[10px] font-semibold text-white/30 uppercase tracking-widest mb-2">Quick Tips</h3>
        <ul className="space-y-1.5 text-[11px] text-white/35 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="text-blue-400/60 mt-px">›</span>
            Adjust sliders to change experiment parameters
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400/60 mt-px">›</span>
            Watch for failure alerts at extreme values
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-400/60 mt-px">›</span>
            Simulation switch is now here in the sidebar
          </li>
        </ul>
      </div>
    </motion.aside>
  );
};
