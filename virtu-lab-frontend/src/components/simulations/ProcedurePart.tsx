import React from 'react';
import { useLabStore, LabType } from '../../store/useLabStore';

const procedureData: Record<LabType, string[]> = {
    "ohm-law": [
        "Open the 'Simulator' tab.",
        "Adjust Voltage and Resistance sliders in the left panel.",
        "Observe the current reading in the stats bar.",
        "Plot the V-I graph to verify linearity."
    ],
    "projectile-motion": [
        "Set the launch angle and initial velocity.",
        "Click 'Run' to see the projectile trajectory.",
        "Analyze high point and range values."
    ],
    "optics-bench": [
        "Select lens type and focal length.",
        "Move the virtual object along the principal axis.",
        "Observe the position and nature of the image formed."
    ],
    "logic-gates": [
        "Select the logic gate type (AND/OR/NOT).",
        "Toggle input switches to observe binary output.",
        "Verify the truth table for the selected gate."
    ],
    "titration": [
        "Drip base into the acid solution using the volume slider.",
        "Watch for the color change at the neutralization point.",
        "Record the exact volume used for titration."
    ],
    "flame-test": [
        "Select a metal salt sample.",
        "Place the virtual loop in the flame.",
        "Identify the metal ion based on the resulting flame color."
    ],
    "periodic-table": [
        "Click on an element in the table.",
        "Explore its electron configuration and properties.",
        "Compare atomic radii and electronegativity trends."
    ],
    "reaction-rate": [
        "Adjust temperature and substrate concentration.",
        "Press 'Run' to start the virtual reaction.",
        "Observe how quickly products are formed in the graph."
    ],
    "microscope": [
        "Select onion peel or cheek cell slide.",
        "Adjust magnification (10x, 40x, 100x) using the slider.",
        "Use fine focus to get a clear view of cell boundaries."
    ],
    "cell-structure": [
        "Explore the 3D cell model.",
        "Click on organelles (Mitochondria, Nucleus) to see their functions.",
        "Identify differences between plant and animal cell structures."
    ],
    "mitosis": [
        "Watch the animation of cell division phases.",
        "Identify Prophase, Metaphase, Anaphase, and Telophase.",
        "Follow the chromosome movement at each step."
    ],
    "anatomy": [
        "Rotate the 3D heart or brain model.",
        "Explore different cross-sections.",
        "Identify major parts and their physiological roles."
    ]
};

export const ProcedurePart: React.FC = () => {
    const { activeLab } = useLabStore();
    const steps = procedureData[activeLab] || procedureData["ohm-law"];

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
