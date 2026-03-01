import type { LabType } from "../store/useLabStore";

export const reportAims: Record<LabType, string> = {
  circuit:
    "To investigate the relationship between voltage, resistance, and current in a simple electrical circuit using Ohm's Law.",
  titration:
    "To determine the equivalence point of an acid-base titration by monitoring pH changes as base is added.",
  enzyme:
    "To study the effect of temperature and substrate concentration on enzyme reaction rate using the Michaelis-Menten model.",
  pendulum:
    "To investigate the relationship between string length, gravitational acceleration, and the period of a simple pendulum.",
  gravity:
    "To explore Newton's Law of Universal Gravitation by varying mass and distance between objects.",
};

export const reportResults: Record<LabType, string> = {
  circuit:
    "The observations confirm Ohm's Law: current (I) is directly proportional to voltage (V) and inversely proportional to resistance (R). As voltage increased, current increased linearly. Higher resistance values resulted in lower current readings, demonstrating the fundamental relationship I = V/R. Power dissipation followed P = I²R, increasing quadratically with current.",
  titration:
    "The titration curve shows the characteristic sigmoidal pattern of a strong acid-base titration. The pH changed slowly during the initial additions of base, then underwent a rapid transition near the equivalence point (~25 mL), where the pH jumped from approximately 4 to 10 over a small volume change. Beyond the equivalence point, excess base caused the pH to level off at alkaline values.",
  enzyme:
    "The data demonstrates classical Michaelis-Menten kinetics. At low substrate concentrations, reaction rate increased approximately linearly. As substrate concentration increased further, the rate approached Vmax asymptotically, consistent with active site saturation. Temperature had a bell-shaped effect on Vmax, with the optimum near 37°C, reflecting the balance between increased kinetic energy and protein denaturation.",
  pendulum:
    "The period measurements confirm the theoretical relationship T = 2π√(L/g). Longer strings produced longer periods, following a square-root relationship. The period was independent of amplitude for small angles, validating the isochronous property. At larger angles, deviations from the simple formula became apparent as the small-angle approximation broke down.",
  gravity:
    "The gravitational force measurements followed Newton's inverse-square law: F = GMm/r². Doubling the distance reduced the force by a factor of four, while doubling the mass doubled the force proportionally. These results confirm that gravity is a long-range force that weakens rapidly with distance but scales linearly with mass.",
};

export const observationColumns: Record<
  LabType,
  { key: string; label: string; unit: string }[]
> = {
  circuit: [
    { key: "voltage", label: "Voltage", unit: "V" },
    { key: "resistance", label: "Resistance", unit: "Ω" },
    { key: "current", label: "Current", unit: "A" },
    { key: "power", label: "Power", unit: "W" },
  ],
  titration: [
    { key: "baseVolume", label: "Volume Added", unit: "mL" },
    { key: "pH", label: "pH", unit: "" },
    { key: "color", label: "Color", unit: "" },
  ],
  enzyme: [
    { key: "temperature", label: "Temperature", unit: "°C" },
    { key: "substrateConcentration", label: "Substrate", unit: "mmol/L" },
    { key: "reactionRate", label: "Rate", unit: "μM/s" },
  ],
  pendulum: [
    { key: "length", label: "Length", unit: "m" },
    { key: "gravity", label: "Gravity", unit: "m/s²" },
    { key: "angle", label: "Angle", unit: "°" },
    { key: "period", label: "Period", unit: "s" },
  ],
  gravity: [
    { key: "planetMass", label: "Planet Mass", unit: "Me" },
    { key: "objectDistance", label: "Distance", unit: "km" },
    { key: "force", label: "Force", unit: "N" },
  ],
};
