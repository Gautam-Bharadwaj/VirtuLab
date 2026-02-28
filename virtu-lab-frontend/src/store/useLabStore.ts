import { create } from "zustand";

// ─── Type Definitions ────────────────────────────────────────────────

type LabType = "circuit" | "titration" | "enzyme";

interface CircuitInputs {
  voltage: number;
  resistance: number;
}

interface CircuitOutputs {
  current: number;
  power: number;
  brightnessPercent: number;
}

interface TitrationInputs {
  baseVolume: number;
}

interface TitrationOutputs {
  pH: number;
  colorHex: string;
}

interface EnzymeInputs {
  temperature: number;
  substrateConc: number;
}

interface EnzymeOutputs {
  reactionRate: number;
  normalizedRate: number;
}

interface LabState {
  // Global
  activeLab: LabType;
  isRunning: boolean;
  failureState: string | null;
  mistakeCount: number;
  sessionStartTime: number | null;

  // Per-experiment
  circuit: { inputs: CircuitInputs; outputs: CircuitOutputs };
  titration: { inputs: TitrationInputs; outputs: TitrationOutputs };
  enzyme: { inputs: EnzymeInputs; outputs: EnzymeOutputs };

  // Actions
  setActiveLab: (lab: LabType) => void;
  updateInput: (key: string, value: number) => void;
  startExperiment: () => void;
  stopExperiment: () => void;
  resetExperiment: () => void;
  recordMistake: () => void;
}

// ─── Compute Helpers ─────────────────────────────────────────────────

function computeCircuit(inputs: CircuitInputs): {
  outputs: CircuitOutputs;
  failure: string | null;
} {
  const current = inputs.voltage / inputs.resistance;
  const power = current * current * inputs.resistance;
  const brightnessPercent = Math.min((current / 0.05) * 100, 100);
  const failure = current > 0.05 ? "OVERLOAD" : null;
  return { outputs: { current, power, brightnessPercent }, failure };
}

function computeTitration(inputs: TitrationInputs): {
  outputs: TitrationOutputs;
  failure: string | null;
} {
  const pH = 7 + 3.5 * Math.tanh((inputs.baseVolume - 25) / 3);

  let colorHex: string;
  if (pH < 6) colorHex = "#FF6B6B";
  else if (pH < 7) colorHex = "#FFE66D";
  else if (pH <= 8) colorHex = "#A8E6CF";
  else colorHex = "#FF8B94";

  const failure = inputs.baseVolume > 45 ? "OVERSHOOT" : null;
  return { outputs: { pH, colorHex }, failure };
}

function computeEnzyme(inputs: EnzymeInputs): {
  outputs: EnzymeOutputs;
  failure: string | null;
} {
  const Vmax = 10 * Math.exp(-0.01 * Math.pow(inputs.temperature - 37, 2));
  const reactionRate =
    (Vmax * inputs.substrateConc) / (2.5 + inputs.substrateConc);
  const normalizedRate = Vmax === 0 ? 0 : reactionRate / Vmax;
  const failure = inputs.temperature > 65 ? "DENATURED" : null;
  return { outputs: { reactionRate, normalizedRate }, failure };
}

// ─── Default Values ──────────────────────────────────────────────────

const defaultCircuitInputs: CircuitInputs = { voltage: 6, resistance: 10 };
const defaultTitrationInputs: TitrationInputs = { baseVolume: 0 };
const defaultEnzymeInputs: EnzymeInputs = { temperature: 37, substrateConc: 5 };

