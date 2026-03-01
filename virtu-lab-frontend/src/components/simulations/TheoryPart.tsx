import React from 'react';
import { useLabStore, LabType } from '../../store/useLabStore';

const theoryData: Record<LabType, { context: string, formula?: string }> = {
    "ohm-law": {
        context: "Ohm's Law states that the current through a conductor between two points is directly proportional to the voltage across the two points and inversely proportional to the resistance.",
        formula: "V = I × R"
    },
    "projectile-motion": {
        context: "Projectile motion is the motion of an object thrown or projected into the air, subject only to acceleration as a result of gravity.",
        formula: "y = x·tan(θ) - (g·x²) / (2·v²·cos²(θ))"
    },
    "optics-bench": {
        context: "The lens formula relates the focal length of a lens to the distances of the object and the image from the lens.",
        formula: "1/f = 1/v - 1/u"
    },
    "logic-gates": {
        context: `Logic gates are the fundamental building blocks of any digital circuit. They operate on binary logic where signals are either 0 (LOW) or 1 (HIGH).

• AND GATE: Produces a HIGH output only when all its inputs are HIGH. It represents numerical multiplication.
• OR GATE: Produces a HIGH output if at least one of its inputs is HIGH. It represents numerical addition.
• NOT GATE: Also known as an inverter, it produces the opposite of its input signal.
• NAND GATE: A universal gate that acts as an AND gate followed by a NOT gate. It is HIGH unless all inputs are HIGH.
• NOR GATE: A universal gate that acts as an OR gate followed by a NOT gate. It is HIGH only when all inputs are LOW.`,
        formula: "Boolean Logic: Y = f(A, B)"
    },
    "titration": {
        context: "Acid-base titration is a laboratory method used to determine the unknown concentration of an acid or a base by neutralizing it with a known concentration.",
        formula: "M1V1 = M2V2"
    },
    "flame-test": {
        context: "The flame test is used to detect the presence of certain metal ions based on each element's characteristic emission spectrum.",
    },
    "periodic-table": {
        context: "Periodic trends are specific patterns in the properties of chemical elements that are revealed in the periodic table.",
    },
    "reaction-rate": {
        context: "Chemical kinetics is the study of rates of chemical processes and how various factors like temperature and concentration affect them.",
        formula: "Rate = k[A]^n[B]^m"
    },
    "mitosis": {
        context: "Mitosis is a type of cell division that results in two daughter cells each having the same number and kind of chromosomes as the parent nucleus.",
    }
};

export const TheoryPart: React.FC = () => {
    const { activeLab } = useLabStore();
    const data = theoryData[activeLab] || theoryData["ohm-law"];

    return (
        <div className="p-8 max-w-4xl mx-auto text-white/80 leading-relaxed overflow-y-auto max-h-full scrollbar-thin scrollbar-thumb-white/10">
            <h2 className="text-3xl font-black mb-6 text-blue-500 uppercase tracking-tighter">Theoretical Background</h2>
            <div className="bg-white/[0.03] border border-white/[0.05] p-10 rounded-[2.5rem] shadow-2xl backdrop-blur-md">
                <div className="text-lg leading-relaxed space-y-4">
                    {data.context.split('\n').map((line, i) => (
                        <p key={i} className={line.startsWith('•') ? "pl-4 text-white/90" : "italic text-white/60"}>
                            {line}
                        </p>
                    ))}
                </div>
                {data.formula && (
                    <div className="mt-12 p-8 bg-blue-500/10 border border-blue-500/20 rounded-3xl text-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-[10px] uppercase tracking-[0.3em] text-blue-400 font-black block mb-4">Core Mathematical Principle</span>
                        <div className="text-3xl font-black text-white tracking-widest font-mono drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">{data.formula}</div>
                    </div>
                )}
            </div>
        </div>
    );
};
