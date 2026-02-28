import React from 'react';
import { useLabStore } from '../store/labStore';

export const LabSliders = () => {
    const { voltage, setVoltage } = useLabStore();

    return (
        <div className="p-6 bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl">
            <h3 className="text-lg font-semibold mb-4 text-blue-400">Experiment Controls</h3>
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-sm text-gray-400">Voltage (V)</label>
                        <span className="text-sm font-mono text-white">{voltage}V</span>
                    </div>
                    <input
                        type="range"
                        min="0"
                        max="12"
                        step="0.1"
                        value={voltage}
                        onChange={(e) => setVoltage(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>
            </div>
        </div>
    );
};
