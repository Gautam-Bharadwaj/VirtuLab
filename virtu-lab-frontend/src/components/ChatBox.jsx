import React from 'react';
import { Send, User, Bot } from 'lucide-react';

export const ChatBox = () => {
    return (
        <div className="flex flex-col h-full bg-gray-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-2">
                <Bot className="text-blue-400" />
                <h3 className="font-semibold text-white">AI Lab Mentor</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                        <Bot size={18} className="text-blue-400" />
                    </div>
                    <div className="bg-white/5 rounded-2xl p-3 border border-white/10 max-w-[80%]">
                        <p className="text-sm text-gray-200">
                            Welcome to the Faraday's Law experiment! Try adjusting the voltage and observe the mass of the electrode. 🧪
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4 bg-black/20 border-t border-white/10">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Ask your mentor..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-blue-500 rounded-lg transition-colors group">
                        <Send size={18} className="text-gray-400 group-hover:text-white" />
                    </button>
                </div>
            </div>
        </div>
    );
};
