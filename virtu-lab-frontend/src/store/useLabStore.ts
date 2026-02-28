import { create } from "zustand";

interface LabState {
  activeLab: string;
}

export const useLabStore = create<LabState>((set) => ({
  activeLab: "circuit",
  // Basic stub
}));
