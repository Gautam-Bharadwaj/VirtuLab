export interface Simulation {
    name: string;
    subject: string;
    color: string;
    shadow: string;
    icon: string;
    labKey: string;
}

export const simulations: Simulation[] = [
    { name: "Ohm’s Law & Resistance", subject: 'Physics', color: 'bg-blue-500', shadow: 'shadow-blue-500/20', icon: '/icon_ohm_law.png', labKey: 'ohm-law' },
    { name: "Projectile Motion", subject: 'Physics', color: 'bg-indigo-500', shadow: 'shadow-indigo-500/20', icon: '/icon_projectile.png', labKey: 'projectile-motion' },
    { name: "Optics Bench", subject: 'Physics', color: 'bg-cyan-500', shadow: 'shadow-cyan-500/20', icon: '/icon_optics.png', labKey: 'optics-bench' },
    { name: "Logic Gates", subject: 'Physics', color: 'bg-blue-600', shadow: 'shadow-blue-600/20', icon: '/icon_logic_gates.png', labKey: 'logic-gates' },

    { name: "Acid-Base Titration", subject: 'Chemistry', color: 'bg-orange-500', shadow: 'shadow-orange-500/20', icon: '/icon_titration.png', labKey: 'titration' },
    { name: "Flame Test", subject: 'Chemistry', color: 'bg-rose-500', shadow: 'shadow-rose-500/20', icon: '/icon_flame_test.png', labKey: 'flame-test' },
    { name: "Periodic Table Trends", subject: 'Chemistry', color: 'bg-amber-500', shadow: 'shadow-amber-500/20', icon: '/icon_periodic_table.png', labKey: 'periodic-table' },
    { name: "Rate of Reaction", subject: 'Chemistry', color: 'bg-orange-600', shadow: 'shadow-orange-600/20', icon: '/icon_reaction_rate.png', labKey: 'reaction-rate' },

    { name: "Mitosis", subject: 'Biology', color: 'bg-green-600', shadow: 'shadow-green-600/20', icon: '/icon_mitosis.png', labKey: 'mitosis' },
];
