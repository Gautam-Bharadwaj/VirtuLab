import type { LabType } from "../store/useLabStore";

export const vivaQuestions: Record<LabType, string[]> = {
  circuit: [
    "Explain Ohm's Law and how changing resistance affects current in a circuit.",
    "What is the relationship between voltage, current, and power? Derive P = V²/R.",
    "Why do we use fuses and circuit breakers in real electrical circuits?",
  ],
  titration: [
    "What is the equivalence point in a titration and how do you identify it?",
    "Explain why pH changes slowly at first, then rapidly near the equivalence point.",
    "What role does an indicator like phenolphthalein play in acid-base titrations?",
  ],
  enzyme: [
    "Describe the Michaelis-Menten model and explain what Km represents.",
    "Why does enzyme activity decrease above the optimal temperature?",
    "How does substrate concentration affect reaction rate at low vs high concentrations?",
  ],
  pendulum: [
    "Derive the period formula T = 2π√(L/g) from first principles.",
    "Why does the simple pendulum formula become inaccurate at large angles?",
    "How would the period change if you took this pendulum to the Moon (g = 1.6 m/s²)?",
  ],
  gravity: [
    "State Newton's Law of Universal Gravitation and explain each variable.",
    "How does doubling the distance between two objects affect gravitational force?",
    "What is orbital velocity and how does it relate to gravitational force?",
  ],
};
