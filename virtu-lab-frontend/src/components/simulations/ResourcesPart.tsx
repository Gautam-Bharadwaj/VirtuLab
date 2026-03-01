import React from 'react';

export const ResourcesPart: React.FC = () => {
    return (
        <div className="p-8 max-w-4xl mx-auto text-white/80 leading-relaxed overflow-y-auto max-h-full">
            <h2 className="text-3xl font-bold mb-6 text-orange-500">References & Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <a
                    href="https://ncert.nic.in/laboratory-manuals.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-panel p-6 border-white/10 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer group transition-all block"
                >
                    <h4 className="text-white font-bold mb-2 group-hover:text-orange-400 transition-colors">NCERT Lab Manual</h4>
                    <p className="text-xs text-white/40 mb-4">Official practical documentation for senior secondary classes.</p>
                    <div className="text-orange-500 text-xs font-bold uppercase tracking-widest">View Official Manuals →</div>
                </a>

                <a
                    href="https://diksha.gov.in/explore"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-panel p-6 border-white/10 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer group transition-all block"
                >
                    <h4 className="text-white font-bold mb-2 group-hover:text-orange-400 transition-colors">Simulation Workbook</h4>
                    <p className="text-xs text-white/40 mb-4">Interactive worksheet for recording observations and calculations.</p>
                    <div className="text-orange-500 text-xs font-bold uppercase tracking-widest">Open DIKSHA Portal →</div>
                </a>

                <a
                    href="https://ncert.nic.in/pdf/publication/sciencelaboratorymanuals/classXII/chemistry/lech101.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-panel p-6 border-white/10 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer group transition-all block"
                >
                    <h4 className="text-white font-bold mb-2 group-hover:text-orange-400 transition-colors">Safety Guidelines</h4>
                    <p className="text-xs text-white/40 mb-4">Critical safety measures for physical laboratory environments.</p>
                    <div className="text-orange-500 text-xs font-bold uppercase tracking-widest">View Lab Safety →</div>
                </a>

                <a
                    href="https://www.vedantu.com/cbse/cbse-formula-sheet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-panel p-6 border-white/10 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer group transition-all block"
                >
                    <h4 className="text-white font-bold mb-2 group-hover:text-orange-400 transition-colors">Formula Cheat Sheet</h4>
                    <p className="text-xs text-white/40 mb-4">Quick reference for all relevant formulas for this experiment.</p>
                    <div className="text-orange-500 text-xs font-bold uppercase tracking-widest">View Online Sheet →</div>
                </a>
            </div>
        </div>
    );
};
