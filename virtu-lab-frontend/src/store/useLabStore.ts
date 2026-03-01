import { create } from "zustand";

export type LabType =
  | "circuit"
  | "titration"
  | "enzyme"
  | "pendulum"
  | "gravity";
export type Language = "en" | "hi" | "ta";
export type PredictionPhase =
  | "idle"
  | "predict"
  | "running"
  | "comparison"
  | "report"
  | "challenge";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
}

interface StatReading {
  label: string;
  value: string;
  unit: string;
  icon: string;
  trend?: "up" | "down" | "stable";
}

export interface FailureState {
  name: string;
  description: string;
}

/* ─── Per-lab default inputs ─── */
export interface LabInputs {
  [key: string]: number;
}

export const defaultInputs: Record<LabType, LabInputs> = {
  circuit: { voltage: 5, resistance: 20 },
  titration: { baseVolume: 0 },
  enzyme: { temperature: 37, substrateConcentration: 5 },
  pendulum: { length: 2.0, gravity: 9.8, angle: 45 },
  gravity: { planetMass: 100, objectDistance: 50 },
};

/* ─── Prediction question generators ─── */
export interface PredictionData {
  question: string;
  expected: number;
  unit: string;
  userGuess: number | null;
}

export function generatePrediction(
  lab: LabType,
  inputs: LabInputs,
): PredictionData {
  switch (lab) {
    case "circuit": {
      const v = inputs.voltage ?? 5;
      const r = inputs.resistance ?? 20;
      return {
        question: `With voltage ${v}V and resistance ${r}Ω, what current do you predict in Amperes?`,
        expected: v / r,
        unit: "A",
        userGuess: null,
      };
    }
    case "titration": {
      const bv = inputs.baseVolume ?? 0;
      return {
        question: `After adding ${bv}mL of base, what pH do you predict?`,
        expected: 7 + 3.5 * Math.tanh((bv - 25) / 3),
        unit: "pH",
        userGuess: null,
      };
    }
    case "enzyme": {
      const t = inputs.temperature ?? 37;
      const sc = inputs.substrateConcentration ?? 5;
      const Vmax = 10 * Math.exp(-0.01 * Math.pow(t - 37, 2));
      return {
        question: `At ${t}°C with ${sc}mmol/L substrate, what reaction rate do you predict?`,
        expected: (Vmax * sc) / (2.5 + sc),
        unit: "μM/s",
        userGuess: null,
      };
    }
    case "pendulum": {
      const l = inputs.length ?? 2.0;
      const g = inputs.gravity ?? 9.8;
      return {
        question: `With string length ${l}m and gravity ${g}m/s², what will the period be in seconds?`,
        expected: 2 * Math.PI * Math.sqrt(l / g),
        unit: "s",
        userGuess: null,
      };
    }
    case "gravity": {
      const m = inputs.planetMass ?? 100;
      const d = inputs.objectDistance ?? 50;
      const G = 6.674e-11;
      const Me = 5.972e24;
      const force = (G * m * Me * Me) / (d * 1000 * (d * 1000));
      return {
        question: `At distance ${d}km with planet mass ${m}Me, what gravitational force (N)?`,
        expected: force,
        unit: "N",
        userGuess: null,
      };
    }
  }
}

/* ─── Stats per lab ─── */
const circuitStats: StatReading[] = [
  { label: "Voltage", value: "5.0", unit: "V", icon: "⚡", trend: "stable" },
  { label: "Current", value: "0.25", unit: "A", icon: "〰️", trend: "up" },
  { label: "Resistance", value: "20", unit: "Ω", icon: "🔧", trend: "stable" },
  { label: "Power", value: "1.25", unit: "W", icon: "💡", trend: "up" },
];

const titrationStats: StatReading[] = [
  { label: "pH Level", value: "7.0", unit: "pH", icon: "🧪", trend: "stable" },
  { label: "Volume", value: "25.0", unit: "mL", icon: "💧", trend: "up" },
  { label: "Molarity", value: "0.1", unit: "M", icon: "⚗️", trend: "stable" },
  {
    label: "Temperature",
    value: "25.0",
    unit: "°C",
    icon: "🌡️",
    trend: "stable",
  },
];

const enzymeStats: StatReading[] = [
  {
    label: "Temperature",
    value: "37.0",
    unit: "°C",
    icon: "🌡️",
    trend: "stable",
  },
  { label: "pH Level", value: "6.8", unit: "pH", icon: "🧬", trend: "stable" },
  { label: "Substrate", value: "5.0", unit: "mM", icon: "🔬", trend: "down" },
  { label: "Rate", value: "0.42", unit: "μM/s", icon: "📈", trend: "up" },
];

const pendulumStats: StatReading[] = [
  { label: "Period", value: "2.84", unit: "s", icon: "⏱️", trend: "stable" },
  {
    label: "Frequency",
    value: "0.35",
    unit: "Hz",
    icon: "🔄",
    trend: "stable",
  },
  {
    label: "Velocity",
    value: "0.00",
    unit: "m/s",
    icon: "💨",
    trend: "stable",
  },
  { label: "Potential E", value: "4.5", unit: "J", icon: "🔋", trend: "down" },
];

const gravityStats: StatReading[] = [
  { label: "Force", value: "98.1", unit: "N", icon: "💥", trend: "stable" },
  { label: "Accel", value: "9.81", unit: "m/s²", icon: "🚀", trend: "stable" },
  { label: "Orbit Vel", value: "7.9", unit: "km/s", icon: "🌍", trend: "up" },
  { label: "Energy", value: "1240", unit: "kJ", icon: "✨", trend: "stable" },
];

const getStatsForLab = (lab: LabType): StatReading[] => {
  switch (lab) {
    case "circuit":
      return circuitStats;
    case "titration":
      return titrationStats;
    case "enzyme":
      return enzymeStats;
    case "pendulum":
      return pendulumStats;
    case "gravity":
      return gravityStats;
    default:
      return circuitStats;
  }
};

const welcomeMessages: ChatMessage[] = [
  {
    id: "welcome-1",
    role: "assistant",
    text: "Welcome to VirtuLab! 🧪 I'm your AI Lab Mentor. I'll guide you through experiments, explain concepts, and help you learn. Select an experiment tab above to get started!",
    timestamp: Date.now(),
  },
];

/* ─── Challenge State ─── */
export interface ChallengeState {
  description: string;
  metric: string;
  targetValue: number;
  tolerance: number;
  fixedInputs?: Record<string, number>;
  proof: string;
  attempts: number;
  hintUnlocked: boolean;
  completed: boolean;
}

/* ─── Store interface ─── */
interface LabState {
  // Active lab
  activeLab: LabType;
  setActiveLab: (lab: LabType) => void;

  // Language
  language: Language;
  setLanguage: (lang: Language) => void;

  // Dynamic inputs per lab
  inputs: LabInputs;
  updateInput: (key: string, value: number) => void;

  // Experiment run state
  running: boolean;
  startExperiment: () => void;
  stopExperiment: () => void;
  resetExperiment: () => void;

  // Failure state
  failureState: FailureState | null;
  setFailureState: (failure: FailureState | null) => void;

  // Experiment performance tracking
  score: number;
  mistakeCount: number;
  experimentStartTime: number | null;
  experimentDuration: number;
  showSkillRadar: boolean;
  setShowSkillRadar: (show: boolean) => void;

  // Prediction system (Feature 1)
  predictionPhase: PredictionPhase;
  setPredictionPhase: (phase: PredictionPhase) => void;
  prediction: PredictionData | null;
  setPrediction: (p: PredictionData | null) => void;
  submitPrediction: (guess: number) => void;

  // Observations (Feature 4 — Lab Report)
  observations: Array<Record<string, number>>;
  addObservation: (obs: Record<string, number>) => void;
  clearObservations: () => void;

  // Danger zone tracking (Feature 2 — Event AI)
  dangerStartTime: number | null;
  setDangerStartTime: (t: number | null) => void;
  lastAIMessageTime: number;
  setLastAIMessageTime: (t: number) => void;
  misconceptionLevel: Record<string, number>;
  incrementMisconceptionLevel: (key: string) => void;

  // Challenge mode (Feature 3)
  challengeState: ChallengeState | null;
  setChallengeState: (c: ChallengeState | null) => void;
  incrementChallengeAttempt: () => void;
  completeChallenge: () => void;
  unlockChallengeHint: () => void;

  // Chat
  messages: ChatMessage[];
  addMessage: (role: "user" | "assistant", text: string) => void;
  clearMessages: () => void;

  // Stats
  stats: StatReading[];
  setStats: (stats: StatReading[]) => void;

  // Sidebar collapse
  sidebarOpen: boolean;
  toggleSidebar: () => void;

  // Tutor panel
  tutorOpen: boolean;
  toggleTutor: () => void;

  // OLabs Tabs
  activeTab: "theory" | "procedure" | "simulator" | "resources";
  setActiveTab: (
    tab: "theory" | "procedure" | "simulator" | "resources",
  ) => void;
}

export const useLabStore = create<LabState>((set, get) => ({
  activeLab: "circuit",
  setActiveLab: (lab) =>
    set({
      activeLab: lab,
      activeTab: "simulator",
      stats: getStatsForLab(lab),
      inputs: { ...defaultInputs[lab] },
      running: false,
      failureState: null,
      predictionPhase: "idle",
      prediction: null,
      observations: [],
      challengeState: null,
      dangerStartTime: null,
    }),

  activeTab: "simulator",
  setActiveTab: (tab) => set({ activeTab: tab }),

  language: "en",
  setLanguage: (lang) => set({ language: lang }),

  // Inputs
  inputs: { ...defaultInputs["circuit"] },
  updateInput: (key, value) =>
    set((state) => ({
      inputs: { ...state.inputs, [key]: value },
    })),

  // Experiment controls
  running: false,
  score: 0,
  mistakeCount: 0,
  experimentStartTime: null,
  experimentDuration: 0,
  showSkillRadar: false,
  setShowSkillRadar: (show) => set({ showSkillRadar: show }),

  // Prediction system
  predictionPhase: "idle",
  setPredictionPhase: (phase) => set({ predictionPhase: phase }),
  prediction: null,
  setPrediction: (p) => set({ prediction: p }),
  submitPrediction: (guess) =>
    set((state) => ({
      prediction: state.prediction
        ? { ...state.prediction, userGuess: guess }
        : null,
    })),

  // Observations
  observations: [],
  addObservation: (obs) =>
    set((state) => ({
      observations: [...state.observations, obs],
    })),
  clearObservations: () => set({ observations: [] }),

  // Danger zone
  dangerStartTime: null,
  setDangerStartTime: (t) => set({ dangerStartTime: t }),
  lastAIMessageTime: 0,
  setLastAIMessageTime: (t) => set({ lastAIMessageTime: t }),
  misconceptionLevel: {},
  incrementMisconceptionLevel: (key) =>
    set((state) => ({
      misconceptionLevel: {
        ...state.misconceptionLevel,
        [key]: Math.min((state.misconceptionLevel[key] ?? 0) + 1, 3),
      },
    })),

  // Challenge mode
  challengeState: null,
  setChallengeState: (c) => set({ challengeState: c }),
  incrementChallengeAttempt: () =>
    set((state) => ({
      challengeState: state.challengeState
        ? {
            ...state.challengeState,
            attempts: state.challengeState.attempts + 1,
            hintUnlocked: state.challengeState.attempts + 1 >= 3,
          }
        : null,
    })),
  completeChallenge: () =>
    set((state) => ({
      challengeState: state.challengeState
        ? { ...state.challengeState, completed: true }
        : null,
    })),
  unlockChallengeHint: () =>
    set((state) => ({
      challengeState: state.challengeState
        ? { ...state.challengeState, hintUnlocked: true }
        : null,
    })),

  startExperiment: () => {
    const { inputs, activeLab, mistakeCount } = get();
    let failure: FailureState | null = null;
    let newMistakes = mistakeCount;

    if (activeLab === "circuit") {
      if (inputs.voltage > 20) {
        failure = {
          name: "Overvoltage Detected",
          description:
            "Voltage exceeds safe operating range (>20V). Components may burn out.",
        };
        newMistakes++;
      } else if (inputs.resistance < 2) {
        failure = {
          name: "Short Circuit Risk",
          description:
            "Resistance is too low (<2Ω). Excessive current may damage the circuit.",
        };
        newMistakes++;
      }
    } else if (activeLab === "enzyme") {
      if (inputs.temperature > 70) {
        failure = {
          name: "Enzyme Denaturation",
          description:
            "Temperature exceeds 70°C — enzyme structure is destroyed.",
        };
        newMistakes++;
      }
    } else if (activeLab === "titration") {
      if (inputs.baseVolume > 45) {
        failure = {
          name: "Overshoot",
          description:
            "Base volume exceeds 45mL — the equivalence point was passed long ago.",
        };
        newMistakes++;
      }
    } else if (activeLab === "pendulum") {
      if (inputs.angle > 85) {
        failure = {
          name: "Large Angle Warning",
          description:
            "Angle exceeds 85° — small angle approximation breaks down significantly.",
        };
        newMistakes++;
      }
    }

    set({
      running: true,
      predictionPhase: "running",
      failureState: failure,
      mistakeCount: newMistakes,
      experimentStartTime: get().experimentStartTime ?? Date.now(),
    });
  },

  stopExperiment: () => {
    const { experimentStartTime, failureState, inputs, activeLab, prediction } =
      get();
    const duration = experimentStartTime
      ? Math.round((Date.now() - experimentStartTime) / 1000)
      : 0;

    // Compute score
    let score = 75;
    if (activeLab === "circuit") {
      const vScore = inputs.voltage >= 3 && inputs.voltage <= 15 ? 90 : 60;
      const rScore =
        inputs.resistance >= 10 && inputs.resistance <= 100 ? 90 : 55;
      score = Math.round((vScore + rScore) / 2);
    } else if (activeLab === "titration") {
      const diff = Math.abs(inputs.baseVolume - 25);
      score = Math.round(Math.max(40, 100 - diff * 2.5));
    } else if (activeLab === "enzyme") {
      const tScore =
        inputs.temperature >= 30 && inputs.temperature <= 45 ? 90 : 50;
      const sScore =
        inputs.substrateConcentration >= 3 &&
        inputs.substrateConcentration <= 12
          ? 90
          : 55;
      score = Math.round((tScore + sScore) / 2);
    } else if (activeLab === "pendulum") {
      score = inputs.angle <= 30 ? 90 : inputs.angle <= 60 ? 75 : 55;
    } else if (activeLab === "gravity") {
      score = 80;
    }
    if (failureState) score = Math.max(20, score - 25);

    // If prediction was made, go to comparison phase; else go to report (if >30s)
    const nextPhase: PredictionPhase =
      prediction?.userGuess !== null && prediction?.userGuess !== undefined
        ? "comparison"
        : duration >= 30
          ? "report"
          : "idle";

    set({
      running: false,
      score,
      experimentDuration: duration,
      showSkillRadar: nextPhase === "idle",
      predictionPhase: nextPhase,
    });
  },

  resetExperiment: () => {
    const { activeLab } = get();
    set({
      inputs: { ...defaultInputs[activeLab] },
      running: false,
      failureState: null,
      score: 0,
      mistakeCount: 0,
      experimentStartTime: null,
      experimentDuration: 0,
      showSkillRadar: false,
      predictionPhase: "idle",
      prediction: null,
      observations: [],
      challengeState: null,
      dangerStartTime: null,
    });
  },

  // Failure
  failureState: null,
  setFailureState: (failure) => set({ failureState: failure }),

  // Chat
  messages: welcomeMessages,
  addMessage: (role, text) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          role,
          text,
          timestamp: Date.now(),
        },
      ],
    })),
  clearMessages: () => set({ messages: welcomeMessages }),

  // Stats
  stats: circuitStats,
  setStats: (stats) => set({ stats }),

  // Panels
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  tutorOpen: true,
  toggleTutor: () => set((state) => ({ tutorOpen: !state.tutorOpen })),
}));
