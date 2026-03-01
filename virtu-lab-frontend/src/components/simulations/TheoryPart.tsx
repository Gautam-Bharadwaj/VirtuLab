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
        context: "Logic gates are the basic building blocks of any digital system. They take one or more binary inputs and produce a single binary output based on a logic rule.",
        formula: "Y = A · B (AND Gate)"
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
    "microscope": {
        context: "Microscopy is the technical field of using microscopes to view objects and areas of objects that cannot be seen with the naked eye.",
    },
    "cell-structure": {
        context: "Cells are the basic structural, functional, and biological units of all known living organisms.",
    },
    "mitosis": {
        context: "Mitosis is a type of cell division that results in two daughter cells each having the same number and kind of chromosomes as the parent nucleus.",
    },
    "anatomy": {
        context: "Human anatomy is the study of the structure of the human body, from the microscopic to the macroscopic level.",
    }
};

export const TheoryPart: React.FC = () => {
    const { activeLab } = useLabStore();
    const data = theoryData[activeLab] || theoryData["ohm-law"];

    return (
        <div className="p-8 max-w-4xl mx-auto text-white/80 leading-relaxed overflow-y-auto max-h-full">
            <h2 className="text-3xl font-bold mb-6 text-orange-500 uppercase tracking-tighter">Theoretical Background</h2>
            <div className="bg-white/[0.03] border border-white/[0.05] p-8 rounded-[2rem] shadow-xl">
                <p className="text-lg mb-8 leading-relaxed italic">"{data.context}"</p>
                {data.formula && (
                    <div className="mt-10 p-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-center">
                        <span className="text-[10px] uppercase tracking-widest text-orange-400 font-bold block mb-2">Mathematical Principle</span>
                        <div className="text-3xl font-black text-orange-500 tracking-tight font-mono">{data.formula}</div>
                    </div>
                )}
            </div>
        </div>
    );
};
