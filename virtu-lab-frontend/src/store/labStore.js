import { create } from 'zustand';

export const useLabStore = create((set) => ({
    voltage: 5,
    mass: 1.2,
    messages: [],

    setVoltage: (v) => set({ voltage: v }),
    setMass: (m) => set({ mass: m }),
    addMessage: (msg) => set((state) => ({
        messages: [...state.messages, msg]
    })),
}));
