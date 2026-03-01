import React from 'react';
import { useLabStore, LabType } from '../../store/useLabStore';

const procedureData: Record<LabType, string[]> = {
    "ohm-law": [
        "Navigate to the 'Simulator' tab.",
        "Use the sliders in the left panel to set Voltage and Resistance.",
        "Observe the real-time Current (I) values in the stats display.",
        "Record multiple readings and verify the linear relationship (V=IR).",
        "Generate a Lab Report to analyze your findings."
    ],
    "projectile-motion": [
        "Open the simulator and set your launch variables (Angle, Velocity).",
        "Enable 'Air Resistance' if you wish to study real-world drag.",
        "Click the 'Run' button to initiate the launch.",
        "Analyze the 'Flight Summary' for range, peak height, and duration.",
        "Reset the experiment to try different launch parameters."
    ],
    "optics-bench": [
        "Select between Concave or Convex lens from the settings.",
        "Set the Focal Length (f) of the lens.",
        "Drag the virtual Object (O) along the principal axis.",
        "Observe how the Image (I) position and magnification changes instantly.",
        "Verify the lens formula: 1/f = 1/v - 1/u."
    ],
    "logic-gates": [
        "Select your desired gate (AND, OR, NOT, NAND, NOR) from the controls.",
        "Interact with Node Alpha and Node Bravo (Input Switches) to toggle them ON/OFF.",
        "Observe the real-time Signal Flow through the animated wires.",
        "Check the 'Signal Yield' output and compare it with the displayed Truth Table.",
        "Note the Boolean Expression for the active gate configuration."
    ],
    "titration": [
        "Fill the virtual burette with the base solution.",
        "Carefully slide the volume control to drop base into the conical flask.",
        "Monitor the solution color; stop exactly at the faint pink endpoint.",
        "Record the volume of base used and calculate the unknown concentration.",
        "Perform multiple trials for better accuracy."
    ],
    "flame-test": [
        "Select a metallic salt from the list of samples.",
        "Click and drag the virtual platinum loop into the Bunsen flame.",
        "Observe the characteristic color of the flame (e.g., Brick Red for Calcium).",
        "Identify the metal ion based on the emission light color.",
        "Clean the loop and repeat with other samples."
    ],
    "periodic-table": [
        "Browse the interactive periodic table elements.",
        "Click on any element to open its detailed property panel.",
        "Analyze electron configurations, ionization energy, and electronegativity.",
        "Compare different families like Alkali Metals or Noble Gases.",
        "Identify periodic trends across periods and down groups."
    ],
    "reaction-rate": [
        "Set the initial temperature and molarity of the substrates.",
        "Use the 'Add Catalyst' toggle to see its effect on activation energy.",
        "Start the clock and watch the Concentration-Time graph form.",
        "Calculate the Rate Constant (k) based on the slope of the curve.",
        "Test how higher temperature speeds up molecular collisions."
    ],
    "mitosis": [
        "Start the cell cycle animation.",
        "Pause at any moment to identify the current phase (Prophase to Cytokinesis).",
        "Observe the alignment of chromatids along the metaphase plate.",
        "Follow the spindle fibers as they pull chromosomes apart.",
        "Compare the parent cell with the resulting daughter cells."
    ]
};

export const ProcedurePart: React.FC = () => {
    const { activeLab } = useLabStore();
    const steps = procedureData[activeLab] || procedureData["ohm-law"];

    return (
        <div className="p-8 max-w-4xl mx-auto text-white/80 leading-relaxed overflow-y-auto max-h-full scrollbar-none">
            <h2 className="text-3xl font-black mb-10 text-blue-500 uppercase tracking-tighter">Practical Procedure</h2>
            <div className="space-y-6">
                {steps.map((step, i) => (
                    <div key={i} className="flex gap-6 items-start bg-white/[0.03] border border-white/[0.05] p-6 rounded-3xl group hover:bg-blue-500/10 hover:border-blue-500/20 transition-all duration-300">
                        <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-black shrink-0 shadow-lg group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-black transition-all">
                            {i + 1}
                        </div>
                        <p className="pt-2 text-white/60 group-hover:text-white transition-colors">{step}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};
