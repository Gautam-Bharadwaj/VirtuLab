import React from 'react';
import { useLabStore, LabType } from '../../store/useLabStore';

const theoryData: Record<LabType, { title: string, content: string }> = {
    pendulum: {
        title: "Simple Pendulum Experiment",
        content: "The simple pendulum consists of a small metallic bob suspended by a light, inextensible string from a rigid support. When pulled to one side and released, the bob executes periodic motion. The time period (T) is given by T = 2π√(L/g). This experiment helps us verify the laws of simple pendulum and determine the acceleration due to gravity (g)."
    },
    circuit: {
        title: "Ohm's Law Verification",
        content: "Ohm's law states that the current (I) flowing through a conductor is directly proportional to the potential difference (V) across its ends, provided physical conditions remain constant. V = IR, where R is the resistance. In this practical, we build a circuit with a power source, resistor, and ammeter to verify this relationship."
    },
    gravity: {
        title: "Newton's Law of Universal Gravitation",
        content: "Every particle in the universe attracts every other particle with a force that is directly proportional to the product of their masses and inversely proportional to the square of the distance between their centers. F = G(m1*m2)/r². This sandbox allows you to visualize gravitational attraction and orbital mechanics."
    },
    titration: {
        title: "Neutralization Titration",
        content: "Titration is a technique where a solution of known concentration is used to determine the concentration of an unknown solution. In acid-base titration, we use a pH indicator to find the equivalence point where the moles of acid equal the moles of base. The formula M1V1 = M2V2 is used for calculation."
    },
    enzyme: {
        title: "Enzyme Kinetics (Michaelis-Menten)",
        content: "Enzymes are biological catalysts. The rate of an enzyme-catalyzed reaction depends on substrate concentration, temperature, and pH. The Michaelis-Menten equation describes the rate of enzymatic reactions: v = (Vmax * [S]) / (Km + [S]). In this reactivite lab, we observe how high temperature denatures the enzyme."
    }
};

export const TheoryPart: React.FC = () => {
    const { activeLab } = useLabStore();
    const data = theoryData[activeLab];

    return (
        <div className="p-8 max-w-4xl mx-auto text-white/80 leading-relaxed overflow-y-auto max-h-full">
            <h2 className="text-3xl font-bold mb-6 text-orange-500">{data.title}</h2>
            <div className="glass-panel p-6 border-white/10 rounded-2xl bg-white/[0.02]">
                <h3 className="text-xl font-bold mb-4 text-white">Objective</h3>
                <p className="mb-8 italic underline decoration-orange-500/30 underline-offset-4">To understand and verify the fundamental principles of {activeLab} through virtual experimentation.</p>

                <h3 className="text-xl font-bold mb-4 text-white">Theory</h3>
                <p>{data.content}</p>

                <div className="mt-8 p-4 bg-orange-500/5 border border-orange-500/20 rounded-xl">
                    <span className="text-orange-400 font-bold">Note:</span> Use the 'Simulator' tab to perform the experiment after reading the procedure.
                </div>
            </div>
        </div>
    );
};
