import { create } from "zustand";

export type LabType =
  | "ohm-law" | "projectile-motion" | "optics-bench" | "logic-gates"
  | "titration" | "flame-test" | "periodic-table" | "reaction-rate"
  | "microscope" | "cell-structure" | "mitosis" | "anatomy";

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

export interface ChallengeData {
  id: string;
  title: string;
  description: string;
  fixedParams: Record<string, number>;
  targetKey: string;
  targetValue: number;
  targetUnit: string;
  tolerance: number;
  compute: string;
  hint: string;
  proof: string;
}

export interface PredictionConfig {
  question: (inputs: LabInputs) => string;
  unit: string;
  computeActual: (inputs: LabInputs) => number;
  hintOnGap: (predicted: number, actual: number) => string;
}

const predictionConfigs: Partial<Record<LabType, PredictionConfig>> = {
  "ohm-law": {
    question: (inp) => `With voltage ${inp.voltage ?? 5}V and resistance ${inp.resistance ?? 100}\u03A9, what current do you predict (in mA)?`,
    unit: "mA",
    computeActual: (inp) => ((inp.voltage ?? 5) / (inp.resistance ?? 100)) * 1000,
    hintOnGap: () => "Remember Ohm's Law: I = V / R. Current is directly proportional to voltage and inversely proportional to resistance.",
  },
  "projectile-motion": {
    question: (inp) => `With angle ${inp.angle ?? 45}\u00B0 and velocity ${inp.velocity ?? 20} m/s, how far will the projectile land (in metres)?`,
    unit: "m",
    computeActual: (inp) => {
      const v = inp.velocity ?? 20;
      const a = ((inp.angle ?? 45) * Math.PI) / 180;
      return (v ** 2 * Math.sin(2 * a)) / 9.81;
    },
    hintOnGap: () => "The range formula is R = v\u00B2 sin(2\u03B8) / g. Maximum range occurs at 45\u00B0. Doubling velocity quadruples range.",
  },
  "titration": {
    question: (inp) => `After adding ${inp.baseVolume ?? 0} mL of NaOH, what pH do you predict?`,
    unit: "pH",
    computeActual: (inp) => {
      const vol = inp.baseVolume ?? 0;
      if (vol < 24) return 1 + (vol / 24) * 5;
      if (vol < 26) return 7 + Math.sin(((vol - 24) / 2) * Math.PI / 2) * 3;
      return 10 + Math.min((vol - 26) / 24, 1) * 4;
    },
    hintOnGap: () => "Before equivalence point pH rises slowly. At the equivalence point (\u224825 mL), pH jumps sharply from \u22487 to \u224810. After that it levels off.",
  },
  "optics-bench": {
    question: (inp) => `With focal length ${inp.focalLength ?? 15} cm and object at ${inp.objectDistance ?? 30} cm, where will the image form (in cm)?`,
    unit: "cm",
    computeActual: (inp) => {
      const f = inp.focalLength ?? 15;
      const u = inp.objectDistance ?? 30;
      return (u * f) / (u - f);
    },
    hintOnGap: () => "Use the lens/mirror formula: 1/v = 1/f - 1/u. When object is at 2F, image forms at 2F (same size).",
  },
  "reaction-rate": {
    question: (inp) => `At ${inp.temperature ?? 25}\u00B0C and ${inp.concentration ?? 1}M concentration, what reaction rate do you predict (arbitrary units)?`,
    unit: "units",
    computeActual: (inp) => {
      const T = inp.temperature ?? 25;
      const C = inp.concentration ?? 1;
      return parseFloat((C * Math.exp((T - 25) / 10) * 2).toFixed(2));
    },
    hintOnGap: () => "Rate increases roughly 2x for every 10\u00B0C rise (Arrhenius). Rate is also proportional to concentration.",
  },
};

export interface LabInputs {
  [key: string]: number;
}

const defaultInputs: Record<LabType, LabInputs> = {
  "ohm-law": { voltage: 5, resistance: 100 },
  "projectile-motion": { angle: 45, velocity: 20 },
  "optics-bench": { focalLength: 15, objectDistance: 30 },
  "logic-gates": { gateType: 1 },
  "titration": { baseVolume: 0 },
  "flame-test": { elementIdx: 0 },
  "periodic-table": { elementIdx: 1 },
  "reaction-rate": { temperature: 25, concentration: 1 },
  "microscope": { magnification: 10 },
  "cell-structure": { zoom: 1 },
  "mitosis": { stage: 0 },
  "anatomy": { rotate: 0 },
};

const genericStats: StatReading[] = [
  { label: "Stability", value: "98.5", unit: "%", icon: "/icon_periodic_table.png", trend: "stable" },
  { label: "Accuracy", value: "0.01", unit: "Δ", icon: "/icon_projectile.png", trend: "up" },
  { label: "Performance", value: "60", unit: "fps", icon: "/icon_ohm_law.png", trend: "stable" },
];

const getStatsForLab = (_lab: LabType): StatReading[] => {
  return genericStats;
};

const welcomeMessages: ChatMessage[] = [
  {
    id: "welcome-1",
    role: "assistant",
    text: "Welcome to VirtuLab! I'm your AI Lab Mentor. I'll guide you through experiments, explain concepts, and help you learn. Select an experiment from the sidebar to get started!",
    timestamp: Date.now(),
  },
];

interface LabState {
  activeLab: LabType;
  setActiveLab: (lab: LabType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  inputs: LabInputs;
  updateInput: (key: string, value: number) => void;
  running: boolean;
  startExperiment: () => void;
  stopExperiment: () => void;
  resetExperiment: () => void;
  failureState: FailureState | null;
  setFailureState: (failure: FailureState | null) => void;
  score: number;
  mistakeCount: number;
  experimentStartTime: number | null;
  experimentDuration: number;
  showSkillRadar: boolean;
  setShowSkillRadar: (show: boolean) => void;
  messages: ChatMessage[];
  addMessage: (role: "user" | "assistant", text: string) => void;
  clearMessages: () => void;
  stats: StatReading[];
  setStats: (stats: StatReading[]) => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  tutorOpen: boolean;
  toggleTutor: () => void;
  activeTab: "theory" | "procedure" | "simulator" | "resources";
  setActiveTab: (tab: "theory" | "procedure" | "simulator" | "resources") => void;
  prediction: number | null;
  predictionSkipped: boolean;
  predictionActual: number | null;
  showPredictionResult: boolean;
  setPrediction: (val: number | null) => void;
  skipPrediction: () => void;
  submitPrediction: (val: number) => void;
  closePredictionResult: () => void;
  getPredictionConfig: () => PredictionConfig | null;
  challengeActive: boolean;
  challengeData: ChallengeData | null;
  challengeAttempts: number;
  challengeHintUnlocked: boolean;
  challengeCompleted: boolean;
  showChallengePanel: boolean;
  showChallengeSuccess: boolean;
  startChallenge: (data: ChallengeData) => void;
  incrementChallengeAttempt: () => void;
  completeChallenge: () => void;
  dismissChallenge: () => void;
  setShowChallengePanel: (show: boolean) => void;
  observations: Record<string, number>[];
  addObservation: (obs: Record<string, number>) => void;
  failureHistory: FailureState[];
  showLabReport: boolean;
  setShowLabReport: (show: boolean) => void;
}

export const useLabStore = create<LabState>((set, get) => ({
  activeLab: "ohm-law",
  setActiveLab: (lab) =>
    set({
      activeLab: lab,
      activeTab: "simulator",
      stats: getStatsForLab(lab),
      inputs: { ...defaultInputs[lab] },
      running: false,
      failureState: null,
      prediction: null,
      predictionSkipped: false,
      predictionActual: null,
      showPredictionResult: false,
    }),

  activeTab: "simulator",
  setActiveTab: (tab) => set({ activeTab: tab }),

  language: "en",
  setLanguage: (lang) => set({ language: lang }),

  inputs: { ...defaultInputs["ohm-law"] },
  updateInput: (key, value) =>
    set((state) => ({
      inputs: { ...state.inputs, [key]: value },
    })),

  running: false,
  score: 0,
  mistakeCount: 0,
  experimentStartTime: null,
  experimentDuration: 0,
  showSkillRadar: false,
  setShowSkillRadar: (show) => set({ showSkillRadar: show }),

  startExperiment: () => {
    set({
      running: true,
      failureState: null,
      experimentStartTime: get().experimentStartTime ?? Date.now(),
      observations: [],
      failureHistory: [],
    });
  },

  stopExperiment: () => {
    const { experimentStartTime, activeLab, inputs, prediction, challengeActive } = get();
    const duration = experimentStartTime
      ? Math.round((Date.now() - experimentStartTime) / 1000)
      : 0;

    const config = predictionConfigs[activeLab];
    const actualVal = config ? config.computeActual(inputs) : null;

    const showReport = duration >= 30 && !challengeActive;

    set({
      running: false,
      score: 85,
      experimentDuration: duration,
      showSkillRadar: prediction === null && !showReport,
      predictionActual: actualVal,
      showPredictionResult: prediction !== null && actualVal !== null,
      showLabReport: showReport,
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
      prediction: null,
      predictionSkipped: false,
      predictionActual: null,
      showPredictionResult: false,
    });
  },

  failureState: null,
  setFailureState: (failure) => {
    if (failure) {
      set((state) => ({
        failureState: failure,
        failureHistory: [...state.failureHistory, failure],
      }));
    } else {
      set({ failureState: null });
    }
  },

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

  stats: genericStats,
  setStats: (stats) => set({ stats }),

  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  tutorOpen: true,
  toggleTutor: () => set((state) => ({ tutorOpen: !state.tutorOpen })),

  prediction: null,
  predictionSkipped: false,
  predictionActual: null,
  showPredictionResult: false,
  setPrediction: (val) => set({ prediction: val }),
  skipPrediction: () => set({ predictionSkipped: true, prediction: null }),
  submitPrediction: (val) => {
    set({ prediction: val, predictionSkipped: true });
    get().startExperiment();
  },
  closePredictionResult: () => set({ showPredictionResult: false, showSkillRadar: true }),
  getPredictionConfig: () => predictionConfigs[get().activeLab] ?? null,

  challengeActive: false,
  challengeData: null,
  challengeAttempts: 0,
  challengeHintUnlocked: false,
  challengeCompleted: false,
  showChallengePanel: false,
  showChallengeSuccess: false,
  startChallenge: (data) => set({
    challengeActive: true,
    challengeData: data,
    challengeAttempts: 0,
    challengeHintUnlocked: false,
    challengeCompleted: false,
    showChallengePanel: true,
    showChallengeSuccess: false,
    running: false,
    predictionSkipped: true,
    prediction: null,
  }),
  incrementChallengeAttempt: () => {
    const attempts = get().challengeAttempts + 1;
    set({
      challengeAttempts: attempts,
      challengeHintUnlocked: attempts >= 3,
    });
  },
  completeChallenge: () => set({
    challengeCompleted: true,
    showChallengeSuccess: true,
    running: false,
  }),
  dismissChallenge: () => set({
    challengeActive: false,
    challengeData: null,
    showChallengePanel: false,
    showChallengeSuccess: false,
    challengeAttempts: 0,
    challengeHintUnlocked: false,
    challengeCompleted: false,
  }),
  setShowChallengePanel: (show) => set({ showChallengePanel: show }),

  observations: [],
  addObservation: (obs) => set((state) => ({
    observations: [...state.observations.slice(-4), obs], // keep max 5
  })),
  failureHistory: [],
  showLabReport: false,
  setShowLabReport: (show) => set({ showLabReport: show }),
}));
