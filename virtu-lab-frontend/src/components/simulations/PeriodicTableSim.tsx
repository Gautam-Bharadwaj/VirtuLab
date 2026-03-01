import React, { useMemo } from 'react';
import { useLabStore } from '../../store/useLabStore';
import { motion } from 'framer-motion';

interface Element {
    z: number;
    sym: string;
    name: string;
    type: string;
    mass: number;
    conf: string;
    radius: number;
    en: number | null;
    phase: string;
}

const ELEMENT_DATA: Record<number, Partial<Element>> = {
    1: { sym: 'H', name: 'Hydrogen', type: 'non-metal', mass: 1.008, conf: '1s1', radius: 37, en: 2.20, phase: 'Gas' },
    2: { sym: 'He', name: 'Helium', type: 'noble-gas', mass: 4.002, conf: '1s2', radius: 32, en: null, phase: 'Gas' },
    3: { sym: 'Li', name: 'Lithium', type: 'alkali-metal', mass: 6.94, conf: '[He] 2s1', radius: 134, en: 0.98, phase: 'Solid' },
    4: { sym: 'Be', name: 'Beryllium', type: 'alkaline-earth', mass: 9.012, conf: '[He] 2s2', radius: 90, en: 1.57, phase: 'Solid' },
    5: { sym: 'B', name: 'Boron', type: 'metalloid', mass: 10.81, conf: '[He] 2s2 2p1', radius: 82, en: 2.04, phase: 'Solid' },
    6: { sym: 'C', name: 'Carbon', type: 'non-metal', mass: 12.011, conf: '[He] 2s2 2p2', radius: 77, en: 2.55, phase: 'Solid' },
    7: { sym: 'N', name: 'Nitrogen', type: 'non-metal', mass: 14.007, conf: '[He] 2s2 2p3', radius: 75, en: 3.04, phase: 'Gas' },
    8: { sym: 'O', name: 'Oxygen', type: 'non-metal', mass: 15.999, conf: '[He] 2s2 2p4', radius: 73, en: 3.44, phase: 'Gas' },
    9: { sym: 'F', name: 'Fluorine', type: 'halogen', mass: 18.998, conf: '[He] 2s2 2p5', radius: 71, en: 3.98, phase: 'Gas' },
    10: { sym: 'Ne', name: 'Neon', type: 'noble-gas', mass: 20.180, conf: '[He] 2s2 2p6', radius: 69, en: null, phase: 'Gas' },
    11: { sym: 'Na', name: 'Sodium', type: 'alkali-metal', mass: 22.990, conf: '[Ne] 3s1', radius: 154, en: 0.93, phase: 'Solid' },
    12: { sym: 'Mg', name: 'Magnesium', type: 'alkaline-earth', mass: 24.305, conf: '[Ne] 3s2', radius: 130, en: 1.31, phase: 'Solid' },
    13: { sym: 'Al', name: 'Aluminum', type: 'post-transition', mass: 26.982, conf: '[Ne] 3s2 3p1', radius: 118, en: 1.61, phase: 'Solid' },
    14: { sym: 'Si', name: 'Silicon', type: 'metalloid', mass: 28.085, conf: '[Ne] 3s2 3p2', radius: 111, en: 1.90, phase: 'Solid' },
    15: { sym: 'P', name: 'Phosphorus', type: 'non-metal', mass: 30.974, conf: '[Ne] 3s2 3p3', radius: 106, en: 2.19, phase: 'Solid' },
    16: { sym: 'S', name: 'Sulfur', type: 'non-metal', mass: 32.06, conf: '[Ne] 3s2 3p4', radius: 102, en: 2.58, phase: 'Solid' },
    17: { sym: 'Cl', name: 'Chlorine', type: 'halogen', mass: 35.45, conf: '[Ne] 3s2 3p5', radius: 99, en: 3.16, phase: 'Gas' },
    18: { sym: 'Ar', name: 'Argon', type: 'noble-gas', mass: 39.948, conf: '[Ne] 3s2 3p6', radius: 97, en: null, phase: 'Gas' },
    19: { sym: 'K', name: 'Potassium', type: 'alkali-metal', mass: 39.098, conf: '[Ar] 4s1', radius: 196, en: 0.82, phase: 'Solid' },
    20: { sym: 'Ca', name: 'Calcium', type: 'alkaline-earth', mass: 40.078, conf: '[Ar] 4s2', radius: 174, en: 1.00, phase: 'Solid' },
    21: { sym: 'Sc', name: 'Scandium', type: 'transition-metal', mass: 44.956, conf: '[Ar] 3d1 4s2', radius: 144, en: 1.36, phase: 'Solid' },
    22: { sym: 'Ti', name: 'Titanium', type: 'transition-metal', mass: 47.867, conf: '[Ar] 3d2 4s2', radius: 132, en: 1.54, phase: 'Solid' },
    23: { sym: 'V', name: 'Vanadium', type: 'transition-metal', mass: 50.942, conf: '[Ar] 3d3 4s2', radius: 122, en: 1.63, phase: 'Solid' },
    24: { sym: 'Cr', name: 'Chromium', type: 'transition-metal', mass: 51.996, conf: '[Ar] 3d5 4s1', radius: 118, en: 1.66, phase: 'Solid' },
    25: { sym: 'Mn', name: 'Manganese', type: 'transition-metal', mass: 54.938, conf: '[Ar] 3d5 4s2', radius: 117, en: 1.55, phase: 'Solid' },
    26: { sym: 'Fe', name: 'Iron', type: 'transition-metal', mass: 55.845, conf: '[Ar] 3d6 4s2', radius: 117, en: 1.83, phase: 'Solid' },
    27: { sym: 'Co', name: 'Cobalt', type: 'transition-metal', mass: 58.933, conf: '[Ar] 3d7 4s2', radius: 116, en: 1.88, phase: 'Solid' },
    28: { sym: 'Ni', name: 'Nickel', type: 'transition-metal', mass: 58.693, conf: '[Ar] 3d8 4s2', radius: 115, en: 1.91, phase: 'Solid' },
    29: { sym: 'Cu', name: 'Copper', type: 'transition-metal', mass: 63.546, conf: '[Ar] 3d10 4s1', radius: 117, en: 1.90, phase: 'Solid' },
    30: { sym: 'Zn', name: 'Zinc', type: 'transition-metal', mass: 65.38, conf: '[Ar] 3d10 4s2', radius: 120, en: 1.65, phase: 'Solid' },
    31: { sym: 'Ga', name: 'Gallium', type: 'post-transition', mass: 69.723, conf: '[Ar] 3d10 4s2 4p1', radius: 122, en: 1.81, phase: 'Solid' },
    32: { sym: 'Ge', name: 'Germanium', type: 'metalloid', mass: 72.63, conf: '[Ar] 3d10 4s2 4p2', radius: 120, en: 2.01, phase: 'Solid' },
    33: { sym: 'As', name: 'Arsenic', type: 'metalloid', mass: 74.922, conf: '[Ar] 3d10 4s2 4p3', radius: 119, en: 2.18, phase: 'Solid' },
    34: { sym: 'Se', name: 'Selenium', type: 'non-metal', mass: 78.971, conf: '[Ar] 3d10 4s2 4p4', radius: 116, en: 2.55, phase: 'Solid' },
    35: { sym: 'Br', name: 'Bromine', type: 'halogen', mass: 79.904, conf: '[Ar] 3d10 4s2 4p5', radius: 114, en: 2.96, phase: 'Liquid' },
    36: { sym: 'Kr', name: 'Krypton', type: 'noble-gas', mass: 83.798, conf: '[Ar] 3d10 4s2 4p6', radius: 110, en: 3.00, phase: 'Gas' },
    37: { sym: 'Rb', name: 'Rubidium', type: 'alkali-metal', mass: 85.468, conf: '[Kr] 5s1', radius: 211, en: 0.82, phase: 'Solid' },
    38: { sym: 'Sr', name: 'Strontium', type: 'alkaline-earth', mass: 87.62, conf: '[Kr] 5s2', radius: 192, en: 0.95, phase: 'Solid' },
    39: { sym: 'Y', name: 'Yttrium', type: 'transition-metal', mass: 88.906, conf: '[Kr] 4d11 5s2', radius: 162, en: 1.22, phase: 'Solid' },
    40: { sym: 'Zr', name: 'Zirconium', type: 'transition-metal', mass: 91.224, conf: '[Kr] 4d2 5s2', radius: 148, en: 1.33, phase: 'Solid' },
    41: { sym: 'Nb', name: 'Niobium', type: 'transition-metal', mass: 92.906, conf: '[Kr] 4d4 5s1', radius: 137, en: 1.6, phase: 'Solid' },
    42: { sym: 'Mo', name: 'Molybdenum', type: 'transition-metal', mass: 95.95, conf: '[Kr] 4d5 5s1', radius: 130, en: 2.16, phase: 'Solid' },
    43: { sym: 'Tc', name: 'Technetium', type: 'transition-metal', mass: 98, conf: '[Kr] 4d5 5s2', radius: 127, en: 1.9, phase: 'Solid' },
    44: { sym: 'Ru', name: 'Ruthenium', type: 'transition-metal', mass: 101.07, conf: '[Kr] 4d7 5s1', radius: 125, en: 2.2, phase: 'Solid' },
    45: { sym: 'Rh', name: 'Rhodium', type: 'transition-metal', mass: 102.906, conf: '[Kr] 4d8 5s1', radius: 125, en: 2.28, phase: 'Solid' },
    46: { sym: 'Pd', name: 'Palladium', type: 'transition-metal', mass: 106.42, conf: '[Kr] 4d10', radius: 128, en: 2.20, phase: 'Solid' },
    47: { sym: 'Ag', name: 'Silver', type: 'transition-metal', mass: 107.868, conf: '[Kr] 4d10 5s1', radius: 134, en: 1.93, phase: 'Solid' },
    48: { sym: 'Cd', name: 'Cadmium', type: 'transition-metal', mass: 112.414, conf: '[Kr] 4d10 5s2', radius: 141, en: 1.69, phase: 'Solid' },
    49: { sym: 'In', name: 'Indium', type: 'post-transition', mass: 114.818, conf: '[Kr] 4d10 5s2 5p1', radius: 144, en: 1.78, phase: 'Solid' },
    50: { sym: 'Sn', name: 'Tin', type: 'post-transition', mass: 118.710, conf: '[Kr] 4d10 5s2 5p2', radius: 140, en: 1.96, phase: 'Solid' },
    51: { sym: 'Sb', name: 'Antimony', type: 'metalloid', mass: 121.760, conf: '[Kr] 4d10 5s2 5p3', radius: 138, en: 2.05, phase: 'Solid' },
    52: { sym: 'Te', name: 'Tellurium', type: 'metalloid', mass: 127.60, conf: '[Kr] 4d10 5s2 5p4', radius: 135, en: 2.1, phase: 'Solid' },
    53: { sym: 'I', name: 'Iodine', type: 'halogen', mass: 126.904, conf: '[Kr] 4d10 5s2 5p5', radius: 133, en: 2.66, phase: 'Solid' },
    54: { sym: 'Xe', name: 'Xenon', type: 'noble-gas', mass: 131.293, conf: '[Kr] 4d10 5s2 5p6', radius: 130, en: 2.6, phase: 'Gas' },
    55: { sym: 'Cs', name: 'Cesium', type: 'alkali-metal', mass: 132.905, conf: '[Xe] 6s1', radius: 225, en: 0.79, phase: 'Solid' },
    56: { sym: 'Ba', name: 'Barium', type: 'alkaline-earth', mass: 137.327, conf: '[Xe] 6s2', radius: 198, en: 0.89, phase: 'Solid' },
    57: { sym: 'La', name: 'Lanthanum', type: 'lanthanide', mass: 138.905, conf: '[Xe] 5d1 6s2', radius: 169, en: 1.1, phase: 'Solid' },
    58: { sym: 'Ce', name: 'Cerium', type: 'lanthanide', mass: 140.116, conf: '[Xe] 4f1 5d1 6s2', radius: 165, en: 1.12, phase: 'Solid' },
    59: { sym: 'Pr', name: 'Praseodymium', type: 'lanthanide', mass: 140.908, conf: '[Xe] 4f3 6s2', radius: 165, en: 1.13, phase: 'Solid' },
    60: { sym: 'Nd', name: 'Neodymium', type: 'lanthanide', mass: 144.242, conf: '[Xe] 4f4 6s2', radius: 164, en: 1.14, phase: 'Solid' },
    61: { sym: 'Pm', name: 'Promethium', type: 'lanthanide', mass: 145, conf: '[Xe] 4f5 6s2', radius: 163, en: null, phase: 'Solid' },
    62: { sym: 'Sm', name: 'Samarium', type: 'lanthanide', mass: 150.36, conf: '[Xe] 4f6 6s2', radius: 162, en: 1.17, phase: 'Solid' },
    63: { sym: 'Eu', name: 'Europium', type: 'lanthanide', mass: 151.964, conf: '[Xe] 4f7 6s2', radius: 185, en: null, phase: 'Solid' },
    64: { sym: 'Gd', name: 'Gadolinium', type: 'lanthanide', mass: 157.25, conf: '[Xe] 4f7 5d1 6s2', radius: 161, en: 1.2, phase: 'Solid' },
    65: { sym: 'Tb', name: 'Terbium', type: 'lanthanide', mass: 158.925, conf: '[Xe] 4f9 6s2', radius: 159, en: null, phase: 'Solid' },
    66: { sym: 'Dy', name: 'Dysprosium', type: 'lanthanide', mass: 162.5, conf: '[Xe] 4f10 6s2', radius: 159, en: 1.22, phase: 'Solid' },
    67: { sym: 'Ho', name: 'Holmium', type: 'lanthanide', mass: 164.93, conf: '[Xe] 4f11 6s2', radius: 158, en: 1.23, phase: 'Solid' },
    68: { sym: 'Er', name: 'Erbium', type: 'lanthanide', mass: 167.259, conf: '[Xe] 4f12 6s2', radius: 157, en: 1.24, phase: 'Solid' },
    69: { sym: 'Tm', name: 'Thulium', type: 'lanthanide', mass: 168.934, conf: '[Xe] 4f13 6s2', radius: 156, en: 1.25, phase: 'Solid' },
    70: { sym: 'Yb', name: 'Ytterbium', type: 'lanthanide', mass: 173.054, conf: '[Xe] 4f14 6s2', radius: 170, en: null, phase: 'Solid' },
    71: { sym: 'Lu', name: 'Lutetium', type: 'lanthanide', mass: 174.967, conf: '[Xe] 4f14 5d1 6s2', radius: 156, en: 1.27, phase: 'Solid' },
    72: { sym: 'Hf', name: 'Hafnium', type: 'transition-metal', mass: 178.49, conf: '[Xe] 4f14 5d2 6s2', radius: 144, en: 1.3, phase: 'Solid' },
    73: { sym: 'Ta', name: 'Tantalum', type: 'transition-metal', mass: 180.948, conf: '[Xe] 4f14 5d3 6s2', radius: 134, en: 1.5, phase: 'Solid' },
    74: { sym: 'W', name: 'Tungsten', type: 'transition-metal', mass: 183.84, conf: '[Xe] 4f14 5d4 6s2', radius: 130, en: 2.36, phase: 'Solid' },
    75: { sym: 'Re', name: 'Rhenium', type: 'transition-metal', mass: 186.207, conf: '[Xe] 4f14 5d5 6s2', radius: 128, en: 1.9, phase: 'Solid' },
    76: { sym: 'Os', name: 'Osmium', type: 'transition-metal', mass: 190.23, conf: '[Xe] 4f14 5d6 6s2', radius: 126, en: 2.2, phase: 'Solid' },
    77: { sym: 'Ir', name: 'Iridium', type: 'transition-metal', mass: 192.217, conf: '[Xe] 4f14 5d7 6s2', radius: 127, en: 2.2, phase: 'Solid' },
    78: { sym: 'Pt', name: 'Platinum', type: 'transition-metal', mass: 195.084, conf: '[Xe] 4f14 5d9 6s1', radius: 130, en: 2.28, phase: 'Solid' },
    79: { sym: 'Au', name: 'Gold', type: 'transition-metal', mass: 196.967, conf: '[Xe] 4f14 5d10 6s1', radius: 134, en: 2.54, phase: 'Solid' },
    80: { sym: 'Hg', name: 'Mercury', type: 'transition-metal', mass: 200.592, conf: '[Xe] 4f14 5d10 6s2', radius: 151, en: 2.00, phase: 'Liquid' },
    81: { sym: 'Tl', name: 'Thallium', type: 'post-transition', mass: 204.383, conf: '[Xe] 4f14 5d10 6s2 6p1', radius: 148, en: 1.62, phase: 'Solid' },
    82: { sym: 'Pb', name: 'Lead', type: 'post-transition', mass: 207.2, conf: '[Xe] 4f14 5d10 6s2 6p2', radius: 147, en: 2.33, phase: 'Solid' },
    83: { sym: 'Bi', name: 'Bismuth', type: 'post-transition', mass: 208.980, conf: '[Xe] 4f14 5d10 6s2 6p3', radius: 146, en: 2.02, phase: 'Solid' },
    84: { sym: 'Po', name: 'Polonium', type: 'metalloid', mass: 209, conf: '[Xe] 4f14 5d10 6s2 6p4', radius: 146, en: 2.0, phase: 'Solid' },
    85: { sym: 'At', name: 'Astatine', type: 'halogen', mass: 210, conf: '[Xe] 4f14 5d10 6s2 6p5', radius: 145, en: 2.2, phase: 'Solid' },
    86: { sym: 'Rn', name: 'Radon', type: 'noble-gas', mass: 222, conf: '[Xe] 4f14 5d10 6s2 6p6', radius: 140, en: null, phase: 'Gas' },
    87: { sym: 'Fr', name: 'Francium', type: 'alkali-metal', mass: 223, conf: '[Rn] 7s1', radius: null, en: 0.7, phase: 'Solid' },
    88: { sym: 'Ra', name: 'Radium', type: 'alkaline-earth', mass: 226, conf: '[Rn] 7s2', radius: 190, en: 0.9, phase: 'Solid' },
    89: { sym: 'Ac', name: 'Actinium', type: 'actinide', mass: 227, conf: '[Rn] 6d1 7s2', radius: 188, en: 1.1, phase: 'Solid' },
    90: { sym: 'Th', name: 'Thorium', type: 'actinide', mass: 232.038, conf: '[Rn] 6d2 7s2', radius: 179, en: 1.3, phase: 'Solid' },
    91: { sym: 'Pa', name: 'Protactinium', type: 'actinide', mass: 231.036, conf: '[Rn] 5f2 6d1 7s2', radius: 161, en: 1.5, phase: 'Solid' },
    92: { sym: 'U', name: 'Uranium', type: 'actinide', mass: 238.029, conf: '[Rn] 5f3 6d1 7s2', radius: 156, en: 1.38, phase: 'Solid' },
    93: { sym: 'Np', name: 'Neptunium', type: 'actinide', mass: 237, conf: '[Rn] 5f4 6d1 7s2', radius: 155, en: 1.36, phase: 'Solid' },
    94: { sym: 'Pu', name: 'Plutonium', type: 'actinide', mass: 244, conf: '[Rn] 5f6 7s2', radius: 159, en: 1.28, phase: 'Solid' },
    95: { sym: 'Am', name: 'Americium', type: 'actinide', mass: 243, conf: '[Rn] 5f7 7s2', radius: 173, en: 1.3, phase: 'Solid' },
    96: { sym: 'Cm', name: 'Curium', type: 'actinide', mass: 247, conf: '[Rn] 5f7 6d1 7s2', radius: 174, en: 1.3, phase: 'Solid' },
    97: { sym: 'Bk', name: 'Berkelium', type: 'actinide', mass: 247, conf: '[Rn] 5f9 7s2', radius: 170, en: 1.3, phase: 'Solid' },
    98: { sym: 'Cf', name: 'Californium', type: 'actinide', mass: 251, conf: '[Rn] 5f10 7s2', radius: 186, en: 1.3, phase: 'Solid' },
    99: { sym: 'Es', name: 'Einsteinium', type: 'actinide', mass: 252, conf: '[Rn] 5f11 7s2', radius: 186, en: 1.3, phase: 'Solid' },
    100: { sym: 'Fm', name: 'Fermium', type: 'actinide', mass: 257, conf: '[Rn] 5f12 7s2', radius: null, en: 1.3, phase: 'Solid' },
    101: { sym: 'Md', name: 'Mendelevium', type: 'actinide', mass: 258, conf: '[Rn] 5f13 7s2', radius: null, en: 1.3, phase: 'Solid' },
    102: { sym: 'No', name: 'Nobelium', type: 'actinide', mass: 259, conf: '[Rn] 5f14 7s2', radius: null, en: 1.3, phase: 'Solid' },
    103: { sym: 'Lr', name: 'Lawrencium', type: 'actinide', mass: 262, conf: '[Rn] 5f14 7s2 7p1', radius: null, en: null, phase: 'Solid' },
    104: { sym: 'Rf', name: 'Rutherfordium', type: 'transition-metal', mass: 267, conf: '[Rn] 5f14 6d2 7s2', radius: null, en: null, phase: 'Solid' },
    105: { sym: 'Db', name: 'Dubnium', type: 'transition-metal', mass: 268, conf: '[Rn] 5f14 6d3 7s2', radius: null, en: null, phase: 'Solid' },
    106: { sym: 'Sg', name: 'Seaborgium', type: 'transition-metal', mass: 271, conf: '[Rn] 5f14 6d4 7s2', radius: null, en: null, phase: 'Solid' },
    107: { sym: 'Bh', name: 'Bohrium', type: 'transition-metal', mass: 272, conf: '[Rn] 5f14 6d5 7s2', radius: null, en: null, phase: 'Solid' },
    108: { sym: 'Hs', name: 'Hassium', type: 'transition-metal', mass: 270, conf: '[Rn] 5f14 6d6 7s2', radius: null, en: null, phase: 'Solid' },
    109: { sym: 'Mt', name: 'Meitnerium', type: 'unknown', mass: 276, conf: '[Rn] 5f14 6d7 7s2', radius: null, en: null, phase: 'Solid' },
    110: { sym: 'Ds', name: 'Darmstadtium', type: 'unknown', mass: 281, conf: '[Rn] 5f14 6d8 7s2', radius: null, en: null, phase: 'Solid' },
    111: { sym: 'Rg', name: 'Roentgenium', type: 'unknown', mass: 280, conf: '[Rn] 5f14 6d9 7s2', radius: null, en: null, phase: 'Solid' },
    112: { sym: 'Cn', name: 'Copernicium', type: 'transition-metal', mass: 285, conf: '[Rn] 5f14 6d10 7s2', radius: null, en: null, phase: 'Solid' },
    113: { sym: 'Nh', name: 'Nihonium', type: 'unknown', mass: 284, conf: '[Rn] 5f14 6d10 7s2 7p1', radius: null, en: null, phase: 'Solid' },
    114: { sym: 'Fl', name: 'Flerovium', type: 'post-transition', mass: 289, conf: '[Rn] 5f14 6d10 7s2 7p2', radius: null, en: null, phase: 'Solid' },
    115: { sym: 'Mc', name: 'Moscovium', type: 'unknown', mass: 288, conf: '[Rn] 5f14 6d10 7s2 7p3', radius: null, en: null, phase: 'Solid' },
    116: { sym: 'Lv', name: 'Livermorium', type: 'unknown', mass: 293, conf: '[Rn] 5f14 6d10 7s2 7p4', radius: null, en: null, phase: 'Solid' },
    117: { sym: 'Ts', name: 'Tennessine', type: 'unknown', mass: 294, conf: '[Rn] 5f14 6d10 7s2 7p5', radius: null, en: null, phase: 'Solid' },
    118: { sym: 'Og', name: 'Oganesson', type: 'noble-gas', mass: 294, conf: '[Rn] 5f14 6d10 7s2 7p6', radius: null, en: null, phase: 'Solid' },
};

export const PeriodicTableSim: React.FC = () => {
    const { inputs } = useLabStore();
    const activeZ = Math.min(118, Math.max(1, Math.floor(inputs.elementIdx || 1)));

    // Categories and their colors
    const colors: Record<string, string> = {
        'alkali-metal': '#ef4444',
        'alkaline-earth': '#f97316',
        'transition-metal': '#eab308',
        'post-transition': '#22c55e',
        'metalloid': '#10b981',
        'non-metal': '#3b82f6',
        'halogen': '#6366f1',
        'noble-gas': '#a855f7',
        'lanthanide': '#ec4899',
        'actinide': '#f43f5e',
        'unknown': '#64748b'
    };

    const activeEl = useMemo(() => {
        const data = ELEMENT_DATA[activeZ];
        return {
            z: activeZ,
            sym: data?.sym || '??',
            name: data?.name || `Element ${activeZ}`,
            type: data?.type || 'unknown',
            mass: data?.mass || activeZ * 2.5,
            conf: data?.conf || 'N/A',
            radius: data?.radius || 100,
            en: data?.en || null,
            phase: data?.phase || 'Unknown'
        };
    }, [activeZ]);

    return (
        <div className="w-full h-full flex flex-col p-6 bg-[#020617] rounded-[2.5rem] border border-white/5 relative overflow-hidden group/lab">
            {/* HUD Header */}
            <div className="relative z-30 flex items-center justify-between mb-6 px-4">
                <div className="flex flex-col gap-1">
                    <h2 className="text-2xl font-black text-amber-400 uppercase tracking-tighter flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center p-2 shadow-lg shadow-amber-500/5">
                            <img src="/icon_periodic_table.png" className="w-full h-full object-contain" alt="" />
                        </div>
                        Periodic Telemetry v4.0
                    </h2>
                    <div className="flex gap-4 items-center pl-1">
                        <span className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase">Atomic Structure Terminal</span>
                        <div className="w-1 h-1 rounded-full bg-white/10" />
                        <span className="text-[10px] font-black text-white/30 tracking-[0.3em] uppercase italic">System: <span className="text-amber-500/60">Quantum Link Sync</span></span>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <div className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">Active Signature</div>
                    <div className="text-xl font-black text-amber-500 font-mono tracking-tighter bg-amber-500/5 px-4 py-1 rounded-lg border border-amber-500/20 shadow-inner">
                        [{activeEl.sym}] <span className="opacity-30 text-sm ml-2">{activeEl.name}</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 h-full min-h-0">
                {/* Main Viewport: The "Core" Atomic Visualizer */}
                <div className="relative flex-1 rounded-[3rem] border border-amber-500/20 bg-[#0d0700]/90 overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(circle, #f59e0b 0.5px, transparent 0.5px)', backgroundSize: '40px 40px' }} />

                    {/* STILL 3D Shell Visualization */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                        {[...Array(5)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full border border-amber-400 opacity-10"
                                style={{
                                    width: 150 + (i * 100),
                                    height: 150 + (i * 100),
                                    transform: 'rotateX(60deg)',
                                    transformStyle: 'preserve-3d',
                                    perspective: '1000px'
                                }}
                            >
                                <div
                                    className="absolute top-1/2 left-0 w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_10px_#f59e0b]"
                                    style={{ transform: 'translate(-50%, -50%)' }}
                                />
                            </div>
                        ))}

                        {/* STILL Nucleus */}
                        <div
                            className="relative w-32 h-32 rounded-full flex items-center justify-center z-10"
                            style={{
                                background: 'radial-gradient(circle at center, #f59e0b, #92400e)',
                                boxShadow: '0 0 80px rgba(245, 158, 11, 0.4), inset 0 0 30px rgba(0,0,0,0.5)'
                            }}
                        >
                            <span className="text-5xl font-black text-black tracking-tighter drop-shadow-lg">{activeEl.sym}</span>
                        </div>
                    </div>

                    {/* Overlay Grid Elements for interaction */}
                    <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end backdrop-blur-md bg-black/40 p-6 rounded-[2.5rem] border border-white/5">
                        <div className="flex flex-col gap-2">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em]">Electron Configuration</span>
                            <div className="text-xl font-bold text-white tracking-widest bg-white/5 px-4 py-2 rounded-xl italic">
                                {activeEl.conf}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex flex-col items-end">
                                <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] mb-1">Atomic Mass</span>
                                <span className="text-2xl font-black text-amber-500 font-mono italic">{activeEl.mass}<span className="text-sm opacity-30 ml-1">u</span></span>
                            </div>
                        </div>
                    </div>

                    <div className="absolute top-8 left-8 bg-[#171717] px-6 py-3 rounded-2xl border border-white/10 flex items-center gap-4 shadow-2xl">
                        <div className="w-1 h-10 bg-amber-500 rounded-full" />
                        <div>
                            <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">Atomic Number</div>
                            <div className="text-2xl font-black text-white font-mono">{activeEl.z}</div>
                        </div>
                    </div>
                </div>

                {/* Info Console */}
                <div className="lg:w-[400px] flex flex-col gap-6">
                    {/* Periodicity Analysis */}
                    <div className="flex-1 glass-panel border border-white/5 bg-[#171717]/80 rounded-[3rem] p-8 flex flex-col gap-8 relative overflow-hidden">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px]" />

                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Properties Analysis</span>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-end group/stat border-b border-white/5 pb-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Electronegativity</span>
                                        <span className="text-xs text-amber-400 font-black uppercase tracking-widest italic">Pauling Scale</span>
                                    </div>
                                    <span className="text-4xl font-black text-white tracking-tighter">{activeEl.en || 'N/A'}</span>
                                </div>

                                <div className="flex justify-between items-end group/stat border-b border-white/5 pb-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">Atomic Radius</span>
                                        <span className="text-xs text-amber-400 font-black uppercase tracking-widest italic">Covalent Size</span>
                                    </div>
                                    <span className="text-4xl font-black text-white tracking-tighter">{activeEl.radius || 'N/A'}<span className="text-xs opacity-20 ml-1 italic font-mono uppercase tracking-tighter">{activeEl.radius ? 'pm' : ''}</span></span>
                                </div>

                                <div>
                                    <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] block mb-3">Material Category</span>
                                    <div className="flex items-center gap-4 bg-white/[0.02] border border-white/5 p-5 rounded-2xl group/cat">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg transition-transform duration-500 group-hover/cat:rotate-12"
                                            style={{ backgroundColor: `${colors[activeEl.type]}33`, border: `1px solid ${colors[activeEl.type]}66`, color: colors[activeEl.type] }}>
                                            {activeEl.phase === 'Gas' ? '☁️' : activeEl.phase === 'Liquid' ? '💧' : '💎'}
                                        </div>
                                        <div>
                                            <div className="text-sm font-black text-white uppercase tracking-tight italic">{activeEl.type.replace('-', ' ')}</div>
                                            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mt-1">Status: {activeEl.phase} phase</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Selection Grid Slider */}
                        <div className="mt-auto">
                            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.1em] block mb-4 italic text-center text-blue-400">Drag Primary Control Slider to scan other elements</span>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-amber-500"
                                    animate={{ width: `${(activeZ / 118) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
