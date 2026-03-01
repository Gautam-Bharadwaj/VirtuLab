import React from 'react';
import { useLabStore, LabType } from '../../store/useLabStore';

const procedureData: Record<LabType, string[]> = {
    pendulum: [
        "Navigate to the 'Simulator' tab.",
        "Adjust the 'String Length' using the slider in the left sidebar.",
        "Set the desired 'Initial Angle' of displacement.",
        "Click the 'Play' button to release the pendulum.",
        "Observe the 'Time Period' and 'Oscillations' in the stats panel.",
        "Repeat the experiment for different lengths to verify T ∝ √L."
    ],
    circuit: [
        "Select the 'Simulator' tab.",
        "Input the 'Voltage' (V) and 'Resistance' (R) from the sidebar.",
        "Click 'Start Experiment' to energize the circuit.",
        "Observe the 'Current' (I) reading in the bottom bar.",
        "Verify that I = V/R accurately reflects Ohm's Law.",
        "Caution: Setting voltage too high will trigger an 'Overvoltage' failure."
    ],
    gravity: [
        "Open the 'Simulator'.",
        "Change the mass of the central planet and the starting distance of the satellite.",
        "Click 'Launch' to see the orbital path.",
        "Observe how the orbital velocity and gravitational force change in real-time.",
        "Try to achieve a perfectly stable circular orbit."
    ],
    titration: [
        "In the Simulator, use the 'Base Volume' slider to drip NaOH into the HCl solution.",
        "Observe the 'pH Level' reading carefully.",
        "Slowly add base as you approach pH 7.0 (End point).",
        "Observe the color change indicator in the virtual beaker."
    ],
    enzyme: [
        "Set the 'Temperature' and 'Substrate Concentration'.",
        "Observe the reaction 'Rate'.",
        "Increase temperature gradually and observe the peak efficiency.",
        "Notice how the reaction drops to zero if you exceed 70°C (Denaturation)."
    ]
};

export const ProcedurePart: React.FC = () => {
    const { activeLab } = useLabStore();
    const steps = procedureData[activeLab];

    return (
        <div className="p-8 max-w-4xl mx-auto text-white/80 leading-relaxed overflow-y-auto max-h-full">
            <h2 className="text-3xl font-bold mb-6 text-orange-500 uppercase tracking-tighter">Practical Procedure</h2>
            <div className="space-y-4">
                {steps.map((step, i) => (
                    <div key={i} className="flex gap-4 items-start bg-white/[0.02] border border-white/[0.05] p-5 rounded-2xl group hover:bg-white/[0.04] transition-colors">
                        <div className="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 font-bold shrink-0">
                            {i + 1}
                        </div>
                        <p className="pt-1 group-hover:text-white transition-colors">{step}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
