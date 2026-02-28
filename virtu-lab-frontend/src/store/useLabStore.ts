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
