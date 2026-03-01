import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LabType } from "./useLabStore";

/* ─── Types ─── */
export interface SessionRecord {
  id: string;
  lab: LabType;
  inputs: Record<string, number>;
  score: number;
  duration: number;
  failures: string[];
  observations: Array<Record<string, number>>;
  prediction: { question: string; expected: number; userGuess: number } | null;
  timestamp: number;
}

export interface MistakeEntry {
  id: string;
  lab: LabType;
  misconception: string;
  tip: string;
  timestamp: number;
}

export interface ChallengeRecord {
  lab: LabType;
  challengeDesc: string;
  attempts: number;
  completed: boolean;
  timestamp: number;
}

interface SessionState {
  sessions: SessionRecord[];
  mistakeLog: MistakeEntry[];
  challengeHistory: ChallengeRecord[];

  // Actions
  addSession: (session: SessionRecord) => void;
  addMistake: (entry: MistakeEntry) => void;
  addChallenge: (record: ChallengeRecord) => void;

  // Selectors
  getSessionsForLab: (lab: LabType) => SessionRecord[];
  getBestScore: (lab: LabType) => number;
  getSessionCount: (lab: LabType) => number;
  getPredictionAccuracy: (lab: LabType) => number;
  getOverallPredictionAccuracy: () => number;
  getRecentMistakes: (count: number) => MistakeEntry[];
  getSafetyRate: () => number;
  getAverageScore: () => number;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      sessions: [],
      mistakeLog: [],
      challengeHistory: [],

      addSession: (session) =>
        set((state) => ({
          sessions: [...state.sessions, session],
        })),

      addMistake: (entry) =>
        set((state) => ({
          mistakeLog: [...state.mistakeLog, entry].slice(-50), // keep last 50
        })),

      addChallenge: (record) =>
        set((state) => ({
          challengeHistory: [...state.challengeHistory, record],
        })),

      getSessionsForLab: (lab) => get().sessions.filter((s) => s.lab === lab),

      getBestScore: (lab) => {
        const labSessions = get().sessions.filter((s) => s.lab === lab);
        if (labSessions.length === 0) return 0;
        return Math.max(...labSessions.map((s) => s.score));
      },

      getSessionCount: (lab) =>
        get().sessions.filter((s) => s.lab === lab).length,

      getPredictionAccuracy: (lab) => {
        const predictions = get()
          .sessions.filter((s) => s.lab === lab && s.prediction !== null)
          .map((s) => s.prediction!);
        if (predictions.length === 0) return 0;
        const within10 = predictions.filter((p) => {
          const gap =
            Math.abs(p.userGuess - p.expected) /
            Math.max(Math.abs(p.expected), 0.001);
          return gap <= 0.1;
        }).length;
        return Math.round((within10 / predictions.length) * 100);
      },

      getOverallPredictionAccuracy: () => {
        const predictions = get()
          .sessions.filter((s) => s.prediction !== null)
          .map((s) => s.prediction!);
        if (predictions.length === 0) return 0;
        const within10 = predictions.filter((p) => {
          const gap =
            Math.abs(p.userGuess - p.expected) /
            Math.max(Math.abs(p.expected), 0.001);
          return gap <= 0.1;
        }).length;
        return Math.round((within10 / predictions.length) * 100);
      },

      getRecentMistakes: (count) => get().mistakeLog.slice(-count).reverse(),

      getSafetyRate: () => {
        const all = get().sessions;
        if (all.length === 0) return 0;
        const safe = all.filter((s) => s.failures.length === 0).length;
        return Math.round((safe / all.length) * 100);
      },

      getAverageScore: () => {
        const all = get().sessions;
        if (all.length === 0) return 0;
        return Math.round(
          all.reduce((sum, s) => sum + s.score, 0) / all.length,
        );
      },
    }),
    {
      name: "virtulab-sessions",
    },
  ),
);
