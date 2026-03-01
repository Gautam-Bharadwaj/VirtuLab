import React, { useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLabStore, LabType } from '../../store/useLabStore';
import { useNavigate } from 'react-router-dom';

const AIMS: Record<string, string> = {
    'ohm-law': 'To verify Ohm\'s Law by studying the relationship between voltage, current, and resistance in a simple DC circuit.',
    'projectile-motion': 'To investigate the effect of launch angle and initial velocity on the range and maximum height of a projectile.',
    'titration': 'To determine the equivalence point of an acid-base titration by gradually adding NaOH to HCl and recording pH changes.',
    'optics-bench': 'To verify the thin lens equation by measuring image distance for various object distances and focal lengths.',
    'reaction-rate': 'To study the effect of temperature and concentration on the rate of a chemical reaction using collision theory.',
    'logic-gates': 'To study the truth tables of basic logic gates (AND, OR, NOT, NAND, NOR, XOR) and verify their Boolean expressions.',
    'flame-test': 'To identify metal ions by observing the characteristic flame colours produced when their salts are heated.',
    'periodic-table': 'To explore trends in atomic radius, ionization energy, and electronegativity across periods and groups.',
    'mitosis': 'To observe and identify the stages of mitotic cell division (prophase, metaphase, anaphase, telophase).',
};

const TABLE_HEADERS: Record<string, { key: string; label: string; unit: string }[]> = {
    'ohm-law': [
        { key: 'voltage', label: 'Voltage', unit: 'V' },
        { key: 'resistance', label: 'Resistance', unit: 'Ω' },
        { key: 'current', label: 'Current', unit: 'mA' },
        { key: 'power', label: 'Power', unit: 'W' },
    ],
    'projectile-motion': [
        { key: 'angle', label: 'Angle', unit: '°' },
        { key: 'velocity', label: 'Velocity', unit: 'm/s' },
        { key: 'range', label: 'Range', unit: 'm' },
        { key: 'maxHeight', label: 'Max Height', unit: 'm' },
    ],
    'titration': [
        { key: 'baseVolume', label: 'Volume Added', unit: 'mL' },
        { key: 'ph', label: 'pH', unit: '' },
        { key: 'color', label: 'Color', unit: '' },
    ],
    'optics-bench': [
        { key: 'focalLength', label: 'Focal Length', unit: 'cm' },
        { key: 'objectDistance', label: 'Object Dist.', unit: 'cm' },
        { key: 'imageDistance', label: 'Image Dist.', unit: 'cm' },
        { key: 'magnification', label: 'Magnification', unit: '×' },
    ],
    'reaction-rate': [
        { key: 'temperature', label: 'Temperature', unit: '°C' },
        { key: 'concentration', label: 'Concentration', unit: 'M' },
        { key: 'rate', label: 'Rate', unit: 'units' },
    ],
    'logic-gates': [
        { key: 'gateType', label: 'Gate', unit: '' },
        { key: 'inputA', label: 'Input A', unit: '' },
        { key: 'inputB', label: 'Input B', unit: '' },
        { key: 'output', label: 'Output', unit: '' },
    ],
    'flame-test': [
        { key: 'elementIdx', label: 'Element', unit: '' },
        { key: 'flameColor', label: 'Flame Color', unit: '' },
        { key: 'wavelength', label: 'Wavelength', unit: 'nm' },
    ],
    'periodic-table': [
        { key: 'elementIdx', label: 'Element', unit: '' },
        { key: 'atomicNumber', label: 'Atomic No.', unit: '' },
        { key: 'atomicMass', label: 'Atomic Mass', unit: 'u' },
        { key: 'electronegativity', label: 'EN', unit: '' },
    ],
    'mitosis': [
        { key: 'stage', label: 'Stage', unit: '' },
        { key: 'duration', label: 'Duration', unit: 'min' },
        { key: 'chromosomeState', label: 'Chromosome State', unit: '' },
    ],
};

const TEMPLATE_RESULTS: Record<string, string> = {
    'ohm-law': 'The experiment confirms Ohm\'s Law: current is directly proportional to voltage and inversely proportional to resistance (I = V/R). As voltage was increased while keeping resistance constant, the current increased linearly. This verifies the linear V-I characteristic of an ohmic conductor.',
    'projectile-motion': 'The experiment demonstrates that projectile range depends on both launch angle and initial velocity. Maximum range was achieved near 45°, consistent with the formula R = v²sin(2θ)/g. Complementary angles produced similar ranges, confirming the sin(2θ) symmetry.',
    'titration': 'The titration curve shows a sharp pH change near the equivalence point (25 mL of NaOH for 25 mL of 0.1M HCl). Before the equivalence point, pH increases gradually. At the equivalence point, a near-vertical jump occurs. After, pH rises slowly toward 14.',
    'optics-bench': 'The observations verify the thin lens equation (1/f = 1/v - 1/u). As object distance decreased toward the focal length, image distance increased toward infinity. At u = 2f, magnification was unity. Below the focal length, virtual and magnified images formed.',
    'reaction-rate': 'The data shows reaction rate increases with both temperature and concentration, consistent with collision theory. Higher temperature increases molecular kinetic energy, leading to more effective collisions. Higher concentration increases collision frequency.',
    'logic-gates': 'The truth tables for all basic gates (AND, OR, NOT, NAND, NOR, XOR) were verified experimentally. AND gate outputs HIGH only when both inputs are HIGH. OR gate outputs HIGH when any input is HIGH. NOT gate inverts the input. NAND and NOR produce the complement of AND and OR respectively. These gates form the building blocks of all digital circuits.',
    'flame-test': 'Different metal salts produced distinct flame colours when heated in a Bunsen burner flame. Sodium produced a persistent bright yellow flame, potassium a lilac/violet flame, copper a blue-green flame, lithium a crimson red flame, and calcium an orange-red flame. Each element emits characteristic wavelengths when electrons return to ground state after excitation.',
    'periodic-table': 'Trends in atomic properties were confirmed: atomic radius decreases across a period (left to right) due to increasing nuclear charge, and increases down a group due to additional electron shells. Ionization energy increases across a period and decreases down a group. Electronegativity follows a similar trend to ionization energy.',
    'mitosis': 'The stages of mitotic cell division were observed in sequence: Prophase (chromatin condenses into visible chromosomes, nuclear envelope breaks down), Metaphase (chromosomes align at the cell equator), Anaphase (sister chromatids separate and move to opposite poles), and Telophase (nuclear envelopes reform, chromosomes decondense). Cytokinesis follows, dividing the cytoplasm.',
};

const VIVA_QUESTIONS: Record<string, string[]> = {
    'ohm-law': [
        'What is the physical significance of the slope of a V-I graph? How does it relate to resistance?',
        'A wire has resistance 50Ω at 20°C. If current through it is 0.2A, calculate the voltage across it and the power dissipated.',
        'Explain why Ohm\'s Law is not applicable to semiconductor devices like diodes and transistors.',
    ],
    'projectile-motion': [
        'Derive the expression for maximum range of a projectile and prove that it occurs at 45°.',
        'Two balls are thrown at 30° and 60° with the same speed. Compare their ranges, max heights, and time of flight.',
        'How would the trajectory change if the same experiment were conducted on the Moon (g = 1.62 m/s²)?',
    ],
    'titration': [
        'What is the Henderson-Hasselbalch equation? How is it used to calculate pH in the buffer region?',
        'Why is phenolphthalein a suitable indicator for strong acid–strong base titrations? What is its pH range?',
        'Calculate the pH when 20mL of 0.1M NaOH is added to 25mL of 0.1M HCl.',
    ],
    'optics-bench': [
        'Derive the magnification formula m = v/u for a thin convex lens. When is the image inverted vs erect?',
        'An object is placed 12 cm from a convex lens of focal length 15 cm. Find image position and nature.',
        'Explain the concept of lens power (in dioptres) and how it relates to focal length.',
    ],
    'reaction-rate': [
        'State the Arrhenius equation and explain the significance of activation energy (Ea).',
        'If the rate constant doubles when temperature rises from 25°C to 35°C, calculate the activation energy.',
        'Distinguish between zero-order, first-order, and second-order reactions with examples.',
    ],
    'logic-gates': [
        'Prove using Boolean algebra that NAND gate is a universal gate by constructing AND, OR, and NOT from NAND gates only.',
        'Simplify the Boolean expression: Y = A\'B + AB\' + AB using a Karnaugh map.',
        'Design a half-adder circuit using only XOR and AND gates. Write its truth table.',
    ],
    'flame-test': [
        'Explain the atomic theory behind flame test colours. Why do different elements produce different flame colours?',
        'Why must the nichrome wire be cleaned with concentrated HCl before each flame test?',
        'Sodium flame colour often masks other elements. How can you use a cobalt blue glass to identify potassium in the presence of sodium?',
    ],
    'periodic-table': [
        'Explain the anomalous behavior of Boron and Silicon in the periodic table. Why are they called metalloids?',
        'Why does ionization energy decrease from Nitrogen (N) to Oxygen (O) despite being in the same period?',
        'Explain the concept of diagonal relationship with examples of Lithium-Magnesium and Beryllium-Aluminium.',
    ],
    'mitosis': [
        'Compare mitosis and meiosis. List at least 5 key differences between the two types of cell division.',
        'What is the significance of the mitotic spindle? What happens if spindle formation is inhibited by colchicine?',
        'Explain why the cells at the root tip of an onion are ideal for observing mitosis in the laboratory.',
    ],
};

function computeDerived(lab: LabType, row: Record<string, number>): Record<string, number> {
    const out: Record<string, number> = { ...row };
    switch (lab) {
        case 'ohm-law': {
            const v = row.voltage ?? 5;
            const r = row.resistance ?? 100;
            out.current = parseFloat(((v / r) * 1000).toFixed(1));
            out.power = parseFloat((v * v / r).toFixed(3));
            break;
        }
        case 'projectile-motion': {
            const a = (row.angle ?? 45) * Math.PI / 180;
            const vel = row.velocity ?? 20;
            out.range = parseFloat(((vel ** 2 * Math.sin(2 * a)) / 9.81).toFixed(2));
            out.maxHeight = parseFloat(((vel ** 2 * Math.sin(a) ** 2) / (2 * 9.81)).toFixed(2));
            break;
        }
        case 'titration': {
            const vol = row.baseVolume ?? 0;
            const nv = 25;
            let ph: number;
            if (vol < nv) {
                const h = (0.1 * (nv - vol)) / (25 + vol);
                ph = h > 0 ? -Math.log10(h) : 7;
            } else if (vol === nv) {
                ph = 7;
            } else {
                const oh = (0.1 * (vol - nv)) / (25 + vol);
                ph = oh > 0 ? 14 + Math.log10(oh) : 7;
            }
            out.ph = parseFloat(ph.toFixed(2));
            out.color = ph < 7 ? 0 : ph === 7 ? 1 : 2; // 0=Red, 1=Green, 2=Pink
            break;
        }
        case 'optics-bench': {
            const f = row.focalLength ?? 15;
            const u = row.objectDistance ?? 30;
            const v = (u * f) / (u - f);
            out.imageDistance = parseFloat(v.toFixed(1));
            out.magnification = parseFloat(Math.abs(v / u).toFixed(2));
            break;
        }
        case 'reaction-rate': {
            const t = row.temperature ?? 25;
            const c = row.concentration ?? 1;
            out.rate = parseFloat((c * Math.exp((t - 25) / 10) * 2).toFixed(2));
            break;
        }
        case 'logic-gates': {
            const gIdx = Math.min(Math.floor(row.gateType ?? 0), GATE_NAMES.length - 1);
            out.gateType = gIdx;
            out.inputA = Math.round(Math.random());
            out.inputB = Math.round(Math.random());
            const a = out.inputA, b = out.inputB;
            const ops = [a & b, a | b, 1 - a, 1 - (a & b), 1 - (a | b), a ^ b];
            out.output = ops[gIdx] ?? 0;
            break;
        }
        case 'flame-test': {
            const eIdx = Math.min(Math.floor(row.elementIdx ?? 0), ELEMENT_NAMES.length - 1);
            out.elementIdx = eIdx;
            out.flameColor = eIdx;
            out.wavelength = FLAME_WAVELENGTHS[eIdx] ?? 500;
            break;
        }
        case 'periodic-table': {
            const pIdx = Math.min(Math.floor(row.elementIdx ?? 0), PERIODIC_ELEMENTS.length - 1);
            out.elementIdx = pIdx;
            out.atomicNumber = pIdx + 1;
            out.atomicMass = PERIODIC_MASS[pIdx] ?? 0;
            out.electronegativity = PERIODIC_EN[pIdx] ?? 0;
            break;
        }
        case 'mitosis': {
            const s = Math.min(Math.floor(row.stage ?? 0), MITOSIS_STAGES.length - 1);
            out.stage = s;
            out.duration = MITOSIS_DURATIONS[s] ?? 0;
            out.chromosomeState = s;
            break;
        }
    }
    return out;
}

const GATE_NAMES = ['AND', 'OR', 'NOT', 'NAND', 'NOR', 'XOR'];
const ELEMENT_NAMES = ['Na (Sodium)', 'K (Potassium)', 'Cu (Copper)', 'Li (Lithium)', 'Ca (Calcium)', 'Ba (Barium)', 'Sr (Strontium)'];
const FLAME_COLORS = ['Bright Yellow', 'Lilac/Violet', 'Blue-Green', 'Crimson Red', 'Orange-Red', 'Pale Green', 'Crimson'];
const FLAME_WAVELENGTHS = [589, 766, 510, 670, 622, 524, 460];
const PERIODIC_ELEMENTS = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca'];
const PERIODIC_MASS = [1.008, 4.003, 6.941, 9.012, 10.81, 12.01, 14.01, 16.00, 19.00, 20.18, 22.99, 24.31, 26.98, 28.09, 30.97, 32.07, 35.45, 39.95, 39.098, 40.078];
const PERIODIC_EN = [2.20, 0, 0.98, 1.57, 2.04, 2.55, 3.04, 3.44, 3.98, 0, 0.93, 1.31, 1.61, 1.90, 2.19, 2.58, 3.16, 0, 0.82, 1.00];
const MITOSIS_STAGES = ['Interphase', 'Prophase', 'Metaphase', 'Anaphase', 'Telophase', 'Cytokinesis'];
const MITOSIS_DURATIONS = [720, 30, 20, 5, 15, 10];
const MITOSIS_CHROMO = ['Chromatin dispersed', 'Chromosomes condense', 'Aligned at equator', 'Chromatids separate', 'Decondensing', 'Two nuclei formed'];

const colorNames = ['Acidic (Red)', 'Neutral (Green)', 'Basic (Pink)'];

function formatCellValue(key: string, val: number): string {
    const lookups: Record<string, string[]> = {
        gateType: GATE_NAMES,
        flameColor: FLAME_COLORS,
        elementIdx: ELEMENT_NAMES,
        stage: MITOSIS_STAGES,
        chromosomeState: MITOSIS_CHROMO,
    };
    if (key === 'inputA' || key === 'inputB' || key === 'output') {
        return val === 1 ? 'HIGH' : 'LOW';
    }
    const arr = lookups[key];
    if (arr) {
        const idx = Math.min(Math.floor(val), arr.length - 1);
        return arr[Math.max(0, idx)] ?? String(val);
    }
    return String(val);
}

export const LabReport: React.FC = () => {
    const {
        activeLab, observations, experimentDuration,
        failureHistory, showLabReport, setShowLabReport,
        resetExperiment,
    } = useLabStore();

    const navigate = useNavigate();

    const aim = AIMS[activeLab] ?? 'To study the properties and behavior of this system through experimental observation.';
    const headers = TABLE_HEADERS[activeLab] ?? [];
    const vivaQs = VIVA_QUESTIONS[activeLab] ?? [
        'What are the key variables in this experiment?',
        'How would you improve the accuracy of your measurements?',
        'What are the real-world applications of this concept?',
    ];

    const isNotRun = observations.length === 0;

    const result = isNotRun
        ? 'N/A - Please run the experiment to see results.'
        : (TEMPLATE_RESULTS[activeLab] ?? 'The observations are consistent with the expected theoretical values, confirming the underlying scientific principles.');

    const rows = useMemo(() => {
        if (isNotRun) {
            return [];
        }
        return observations.map(obs => computeDerived(activeLab, obs));
    }, [observations, activeLab, isNotRun]);

    const copyReport = useCallback(() => {
        let report = `LAB REPORT\n${'═'.repeat(50)}\n\n`;
        report += `Lab: ${activeLab.replace(/-/g, ' ').toUpperCase()}\n`;
        report += `Duration: ${experimentDuration}s\n`;
        report += `Date: ${new Date().toLocaleDateString()}\n\n`;

        report += `AIM\n${'-'.repeat(30)}\n${aim}\n\n`;

        report += `OBSERVATIONS\n${'-'.repeat(30)}\n`;
        if (headers.length > 0) {
            report += headers.map(h => h.label.padEnd(16)).join('') + '\n';
            if (isNotRun) {
                report += headers.map(() => 'N/A'.padEnd(16)).join('') + '\n';
            } else {
                rows.forEach(row => {
                    report += headers.map(h => {
                        const val = row[h.key];
                        if (h.key === 'color') return colorNames[val as number]?.padEnd(16) ?? '';
                        return (val !== undefined ? `${val} ${h.unit}` : 'N/A').padEnd(16);
                    }).join('') + '\n';
                });
            }
        }
        report += '\n';

        report += `RESULT\n${'-'.repeat(30)}\n${result}\n\n`;

        if (failureHistory.length > 0) {
            report += `WHERE YOU STRUGGLED\n${'-'.repeat(30)}\n`;
            failureHistory.forEach((f, i) => {
                report += `${i + 1}. ${f.name}: ${f.description}\n`;
            });
            report += '\n';
        }

        report += `VIVA QUESTIONS\n${'-'.repeat(30)}\n`;
        vivaQs.forEach((q, i) => {
            report += `${i + 1}. ${q}\n`;
        });

        navigator.clipboard.writeText(report).catch(() => { });
    }, [activeLab, aim, headers, rows, result, failureHistory, vivaQs, experimentDuration]);

    if (!showLabReport) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[120] flex items-center justify-center overflow-hidden"
            >
                <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" />

                <motion.div
                    initial={{ scale: 0.9, y: 40 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ type: 'spring', damping: 25 }}
                    className="relative w-full max-w-3xl mx-4 max-h-[90vh] rounded-3xl border border-white/[0.08] shadow-2xl overflow-hidden flex flex-col"
                >
                    <div className="absolute inset-0 bg-[#0c0c1e]/95" />
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

                    <div className="relative z-10 overflow-y-auto flex-1 p-8 scrollbar-thin">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-black text-white uppercase tracking-tight">Lab Report</h1>
                                <p className="text-xs text-white/30 mt-1">
                                    {activeLab.replace(/-/g, ' ').toUpperCase()} • {experimentDuration}s • {new Date().toLocaleDateString()}
                                </p>
                            </div>
                            <button
                                onClick={() => setShowLabReport(false)}
                                className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.08] transition-all"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <section className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-500/20 flex items-center justify-center">
                                    <span className="text-blue-400 text-xs font-black">1</span>
                                </div>
                                <h2 className="text-sm font-black text-blue-400 uppercase tracking-widest">Aim</h2>
                            </div>
                            <p className="text-sm text-white/70 leading-relaxed pl-8">{aim}</p>
                        </section>

                        {headers.length > 0 && (
                            <section className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center">
                                        <span className="text-emerald-400 text-xs font-black">2</span>
                                    </div>
                                    <h2 className="text-sm font-black text-emerald-400 uppercase tracking-widest">Observations</h2>
                                    <span className="text-[10px] text-white/20 ml-auto">{rows.length} reading{rows.length !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="pl-8 overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/[0.08]">
                                                <th className="text-left py-2 pr-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">#</th>
                                                {headers.map(h => (
                                                    <th key={h.key} className="text-left py-2 pr-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                                                        {h.label} {h.unit && <span className="text-white/15">({h.unit})</span>}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isNotRun ? (
                                                <tr className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                    <td className="py-2.5 pr-4 text-white/20 font-mono text-xs">-</td>
                                                    {headers.map(h => (
                                                        <td key={h.key} className="py-2.5 pr-4 text-white/40 font-mono text-xs italic">
                                                            N/A
                                                        </td>
                                                    ))}
                                                </tr>
                                            ) : (
                                                rows.map((row, i) => (
                                                    <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                                        <td className="py-2.5 pr-4 text-white/20 font-mono text-xs">{i + 1}</td>
                                                        {headers.map(h => (
                                                            <td key={h.key} className="py-2.5 pr-4 text-white/80 font-mono text-xs">
                                                                {h.key === 'color'
                                                                    ? <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${row[h.key] === 0 ? 'bg-red-500/20 text-red-400' :
                                                                        row[h.key] === 1 ? 'bg-green-500/20 text-green-400' :
                                                                            'bg-pink-500/20 text-pink-400'
                                                                        }`}>{colorNames[row[h.key] as number] ?? 'N/A'}</span>
                                                                    : (row[h.key] !== undefined ? formatCellValue(h.key, row[h.key]) : 'N/A')
                                                                }
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}

                        <section className="mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center">
                                    <span className="text-indigo-400 text-xs font-black">3</span>
                                </div>
                                <h2 className="text-sm font-black text-indigo-400 uppercase tracking-widest">Result</h2>
                            </div>
                            <p className="text-sm text-white/70 leading-relaxed pl-8">{result}</p>
                        </section>

                        {failureHistory.length > 0 && (
                            <section className="mb-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-6 h-6 rounded-lg bg-rose-500/20 border border-rose-500/20 flex items-center justify-center">
                                        <span className="text-rose-400 text-xs font-black">4</span>
                                    </div>
                                    <h2 className="text-sm font-black text-rose-400 uppercase tracking-widest">Where You Struggled</h2>
                                </div>
                                <div className="pl-8 space-y-2">
                                    {failureHistory.map((f, i) => (
                                        <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-rose-500/[0.05] border border-rose-500/[0.08]">
                                            <div className="w-5 h-5 rounded-full bg-rose-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                                <svg className="w-3 h-3 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-xs text-rose-400 font-bold uppercase tracking-wider">{f.name}</p>
                                                <p className="text-xs text-white/60 mt-0.5 leading-relaxed">{f.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        <section className="mb-2">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-500/20 flex items-center justify-center">
                                    <span className="text-amber-400 text-xs font-black">{failureHistory.length > 0 ? '5' : '4'}</span>
                                </div>
                                <h2 className="text-sm font-black text-amber-400 uppercase tracking-widest">Viva Questions</h2>
                            </div>
                            <div className="pl-8 space-y-3">
                                {vivaQs.map((q, i) => (
                                    <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-500/[0.04] border border-amber-500/[0.06]">
                                        <span className="text-amber-400 font-black text-sm shrink-0 mt-0.5">Q{i + 1}.</span>
                                        <p className="text-sm text-white/70 leading-relaxed">{q}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="relative z-10 px-8 py-5 border-t border-white/[0.06] bg-[#0c0c1e]/80 backdrop-blur-sm flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={copyReport}
                            className="flex-1 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08] text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                            Copy Report
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                setShowLabReport(false);
                                resetExperiment();
                            }}
                            className="flex-1 h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.08] text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            Try Again
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                setShowLabReport(false);
                                navigate('/');
                            }}
                            className="flex-1 h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
                        >
                            View Dashboard
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
