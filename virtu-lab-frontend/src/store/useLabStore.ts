import { create } from "zustand";

export type LabType = "circuit" | "titration" | "enzyme";
export type Language = "en" | "hi" | "ta";

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

const defaultInputs: Record<LabType, LabInputs> = {
  circuit: { voltage: 5, resistance: 20 },
  titration: { baseVolume: 0 },
  enzyme: { temperature: 37, substrateConcentration: 5 },
};

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
  { label: "Temperature", value: "25.0", unit: "°C", icon: "🌡️", trend: "stable" },
];

const enzymeStats: StatReading[] = [
  { label: "Temperature", value: "37.0", unit: "°C", icon: "🌡️", trend: "stable" },
  { label: "pH Level", value: "6.8", unit: "pH", icon: "🧬", trend: "stable" },
  { label: "Substrate", value: "5.0", unit: "mM", icon: "🔬", trend: "down" },
  { label: "Rate", value: "0.42", unit: "μM/s", icon: "📈", trend: "up" },
];

const getStatsForLab = (lab: LabType): StatReading[] => {
  switch (lab) {
    case "circuit":
      return circuitStats;
    case "titration":
      return titrationStats;
    case "enzyme":
      return enzymeStats;
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

/* ─── Store interface ─── */
interface LabState {
  // Active lab
  /** Currently selected laboratory simulation */
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
}

export const useLabStore = create<LabState>((set, get) => ({
  activeLab: "circuit",
  setActiveLab: (lab) =>
    set({
      activeLab: lab,
      stats: getStatsForLab(lab),
      inputs: { ...defaultInputs[lab] },
      running: false,
      failureState: null,
    }),

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

  startExperiment: () => {
    const { inputs, activeLab, mistakeCount } = get();
    // Check for failure conditions
    let failure: FailureState | null = null;
    let newMistakes = mistakeCount;

    if (activeLab === "circuit") {
      if (inputs.voltage > 20) {
        failure = {
          name: "Overvoltage Detected",
          description: "Voltage exceeds safe operating range (>20V). Components may burn out.",
        };
        newMistakes++;
      } else if (inputs.resistance < 2) {
        failure = {
          name: "Short Circuit Risk",
          description: "Resistance is too low (<2Ω). Excessive current may damage the circuit.",
        };
        newMistakes++;
      }
    } else if (activeLab === "enzyme") {
      if (inputs.temperature > 70) {
        failure = {
          name: "Enzyme Denaturation",
          description: "Temperature exceeds 70°C — enzyme structure is destroyed.",
        };
        newMistakes++;
      }
    }

    set({
      running: true,
      failureState: failure,
      mistakeCount: newMistakes,
      experimentStartTime: get().experimentStartTime ?? Date.now(),
    });
  },

  stopExperiment: () => {
    const { experimentStartTime, failureState, inputs, activeLab } = get();
    const duration = experimentStartTime
      ? Math.round((Date.now() - experimentStartTime) / 1000)
      : 0;

    // Compute a score based on how close inputs are to optimal values
    let score = 75; // baseline
    if (activeLab === "circuit") {
      // Optimal: voltage 5-12V, resistance 10-100Ω
      const vScore = inputs.voltage >= 3 && inputs.voltage <= 15 ? 90 : 60;
      const rScore = inputs.resistance >= 10 && inputs.resistance <= 100 ? 90 : 55;
      score = Math.round((vScore + rScore) / 2);
    } else if (activeLab === "titration") {
      // Optimal: baseVolume near 25mL for equivalence
      const diff = Math.abs(inputs.baseVolume - 25);
      score = Math.round(Math.max(40, 100 - diff * 2.5));
    } else if (activeLab === "enzyme") {
      // Optimal: temp 35-40°C, substrate 5-10 mmol/L
      const tScore = inputs.temperature >= 30 && inputs.temperature <= 45 ? 90 : 50;
      const sScore = inputs.substrateConcentration >= 3 && inputs.substrateConcentration <= 12 ? 90 : 55;
      score = Math.round((tScore + sScore) / 2);
    }
    // Penalize if failure occurred
    if (failureState) score = Math.max(20, score - 25);

    set({
      running: false,
      score,
      experimentDuration: duration,
      showSkillRadar: true,
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
