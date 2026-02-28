import { create } from "zustand";

// ─── Type Definitions ────────────────────────────────────────────────

export type LabType = "circuit" | "titration" | "enzyme";
export type Language = "en" | "hi";

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

export interface LabState {
  // Global
  activeLab: LabType;
  isRunning: boolean;
  running: boolean; // alias for isRunning (Gautam's UI uses this)
  failureState: string | null;
  mistakeCount: number;
  sessionStartTime: number | null;

  // Per-experiment
  circuit: { inputs: CircuitInputs; outputs: CircuitOutputs };
  titration: { inputs: TitrationInputs; outputs: TitrationOutputs };
  enzyme: { inputs: EnzymeInputs; outputs: EnzymeOutputs };

  // Flat inputs accessor (Gautam's ControlsSidebar uses inputs[key])
  inputs: Record<string, number>;

  // UI State
  sidebarOpen: boolean;
  tutorOpen: boolean;
  showSkillRadar: boolean;
  score: number;
  experimentDuration: number;
  language: Language;

  // Stats for BottomBar
  stats: Array<{
    label: string;
    value: string;
    unit: string;
    trend: "up" | "down" | "stable";
  }>;

  // Actions
  setActiveLab: (lab: LabType) => void;
  updateInput: (key: string, value: number) => void;
  startExperiment: () => void;
  stopExperiment: () => void;
  resetExperiment: () => void;
  recordMistake: () => void;
  toggleSidebar: () => void;
  toggleTutor: () => void;
  setShowSkillRadar: (v: boolean) => void;
  setLanguage: (l: Language) => void;
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

function getFlatInputs(
  lab: LabType,
  circuit: CircuitInputs,
  titration: TitrationInputs,
  enzyme: EnzymeInputs,
): Record<string, number> {
  if (lab === "circuit") return { ...circuit };
  if (lab === "titration") return { ...titration };
  return { ...enzyme };
}

function buildStats(
  lab: LabType,
  circuit: { inputs: CircuitInputs; outputs: CircuitOutputs },
  titration: { inputs: TitrationInputs; outputs: TitrationOutputs },
  enzyme: { inputs: EnzymeInputs; outputs: EnzymeOutputs },
) {
  if (lab === "circuit") {
    return [
      {
        label: "Voltage",
        value: circuit.inputs.voltage.toFixed(1),
        unit: "V",
        trend: "stable" as const,
      },
      {
        label: "Current",
        value: circuit.outputs.current.toFixed(3),
        unit: "A",
        trend:
          circuit.outputs.current > 0.04
            ? ("up" as const)
            : ("stable" as const),
      },
      {
        label: "Power",
        value: circuit.outputs.power.toFixed(2),
        unit: "W",
        trend: "stable" as const,
      },
      {
        label: "Brightness",
        value: circuit.outputs.brightnessPercent.toFixed(0),
        unit: "%",
        trend: "stable" as const,
      },
    ];
  }
  if (lab === "titration") {
    return [
      {
        label: "Base Vol",
        value: titration.inputs.baseVolume.toFixed(1),
        unit: "mL",
        trend: "stable" as const,
      },
      {
        label: "pH",
        value: titration.outputs.pH.toFixed(2),
        unit: "",
        trend: titration.outputs.pH > 7 ? ("up" as const) : ("down" as const),
      },
    ];
  }
  return [
    {
      label: "Temp",
      value: enzyme.inputs.temperature.toFixed(0),
      unit: "°C",
      trend:
        enzyme.inputs.temperature > 50 ? ("up" as const) : ("stable" as const),
    },
    {
      label: "Rate",
      value: enzyme.outputs.reactionRate.toFixed(2),
      unit: "",
      trend: "stable" as const,
    },
    {
      label: "Normalized",
      value: enzyme.outputs.normalizedRate.toFixed(2),
      unit: "",
      trend: "stable" as const,
    },
  ];
}

// ─── Store ───────────────────────────────────────────────────────────

export const useLabStore = create<LabState>((set, get) => ({
  activeLab: "circuit",
  isRunning: false,
  running: false,
  failureState: null,
  mistakeCount: 0,
  sessionStartTime: null,

  circuit: {
    inputs: { ...defaultCircuitInputs },
    outputs: computeCircuit(defaultCircuitInputs).outputs,
  },
  titration: {
    inputs: { ...defaultTitrationInputs },
    outputs: computeTitration(defaultTitrationInputs).outputs,
  },
  enzyme: {
    inputs: { ...defaultEnzymeInputs },
    outputs: computeEnzyme(defaultEnzymeInputs).outputs,
  },

  inputs: { ...defaultCircuitInputs },
  stats: buildStats(
    "circuit",
    {
      inputs: defaultCircuitInputs,
      outputs: computeCircuit(defaultCircuitInputs).outputs,
    },
    {
      inputs: defaultTitrationInputs,
      outputs: computeTitration(defaultTitrationInputs).outputs,
    },
    {
      inputs: defaultEnzymeInputs,
      outputs: computeEnzyme(defaultEnzymeInputs).outputs,
    },
  ),

  // UI State
  sidebarOpen: true,
  tutorOpen: false,
  showSkillRadar: false,
  score: 0,
  experimentDuration: 0,
  language: "en",

  // ── Actions ──────────────────────────────────────────────────────

  setActiveLab: (lab) =>
    set((state) => ({
      activeLab: lab,
      failureState: null,
      isRunning: false,
      running: false,
      mistakeCount: 0,
      sessionStartTime: null,
      inputs: getFlatInputs(
        lab,
        state.circuit.inputs,
        state.titration.inputs,
        state.enzyme.inputs,
      ),
      stats: buildStats(lab, state.circuit, state.titration, state.enzyme),
    })),

  updateInput: (key, value) =>
    set((state) => {
      const lab = state.activeLab;

      if (lab === "circuit") {
        const nextInputs = { ...state.circuit.inputs, [key]: value };
        const { outputs, failure } = computeCircuit(nextInputs);
        const isNewFailure = failure !== null && state.failureState === null;
        const nextCircuit = { inputs: nextInputs, outputs };
        return {
          circuit: nextCircuit,
          failureState: state.failureState ?? failure,
          mistakeCount: isNewFailure
            ? state.mistakeCount + 1
            : state.mistakeCount,
          inputs: { ...nextInputs },
          stats: buildStats(lab, nextCircuit, state.titration, state.enzyme),
        };
      }

      if (lab === "titration") {
        const nextInputs = { ...state.titration.inputs, [key]: value };
        const { outputs, failure } = computeTitration(nextInputs);
        const isNewFailure = failure !== null && state.failureState === null;
        const nextTitration = { inputs: nextInputs, outputs };
        return {
          titration: nextTitration,
          failureState: state.failureState ?? failure,
          mistakeCount: isNewFailure
            ? state.mistakeCount + 1
            : state.mistakeCount,
          inputs: { ...nextInputs },
          stats: buildStats(lab, state.circuit, nextTitration, state.enzyme),
        };
      }

      // enzyme
      const nextInputs = { ...state.enzyme.inputs, [key]: value };
      const { outputs, failure } = computeEnzyme(nextInputs);
      const isNewFailure = failure !== null && state.failureState === null;
      const nextEnzyme = { inputs: nextInputs, outputs };
      return {
        enzyme: nextEnzyme,
        failureState: state.failureState ?? failure,
        mistakeCount: isNewFailure
          ? state.mistakeCount + 1
          : state.mistakeCount,
        inputs: { ...nextInputs },
        stats: buildStats(lab, state.circuit, state.titration, nextEnzyme),
      };
    }),

  startExperiment: () =>
    set({ isRunning: true, running: true, sessionStartTime: Date.now() }),

  stopExperiment: () => {
    const state = get();
    const duration = state.sessionStartTime
      ? Math.floor((Date.now() - state.sessionStartTime) / 1000)
      : 0;
    set({
      isRunning: false,
      running: false,
      experimentDuration: duration,
      showSkillRadar: true,
      score: Math.max(0, 100 - state.mistakeCount * 20),
    });
  },

  resetExperiment: () =>
    set((state) => {
      const base = {
        failureState: null,
        mistakeCount: 0,
        isRunning: false,
        running: false,
        sessionStartTime: null,
        score: 0,
        experimentDuration: 0,
        showSkillRadar: false,
      };

      if (state.activeLab === "circuit") {
        const nextCircuit = {
          inputs: { ...defaultCircuitInputs },
          outputs: computeCircuit(defaultCircuitInputs).outputs,
        };
        return {
          ...base,
          circuit: nextCircuit,
          inputs: { ...defaultCircuitInputs },
          stats: buildStats(
            "circuit",
            nextCircuit,
            state.titration,
            state.enzyme,
          ),
        };
      }

      if (state.activeLab === "titration") {
        const nextTitration = {
          inputs: { ...defaultTitrationInputs },
          outputs: computeTitration(defaultTitrationInputs).outputs,
        };
        return {
          ...base,
          titration: nextTitration,
          inputs: { ...defaultTitrationInputs },
          stats: buildStats(
            "titration",
            state.circuit,
            nextTitration,
            state.enzyme,
          ),
        };
      }

      const nextEnzyme = {
        inputs: { ...defaultEnzymeInputs },
        outputs: computeEnzyme(defaultEnzymeInputs).outputs,
      };
      return {
        ...base,
        enzyme: nextEnzyme,
        inputs: { ...defaultEnzymeInputs },
        stats: buildStats("enzyme", state.circuit, state.titration, nextEnzyme),
      };
    }),

  recordMistake: () =>
    set((state) => ({ mistakeCount: state.mistakeCount + 1 })),

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleTutor: () => set((state) => ({ tutorOpen: !state.tutorOpen })),
  setShowSkillRadar: (v) => set({ showSkillRadar: v }),
  setLanguage: (l) => set({ language: l }),
}));
