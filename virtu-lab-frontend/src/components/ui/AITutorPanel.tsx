import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLabStore } from '../../store/useLabStore';
import { useSocraticAI } from '../../hooks/useSocraticAI';
import { motion, AnimatePresence } from 'framer-motion';

const speak = (text: string) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-IN';
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
};

const triggerStyle: Record<string, { bg: string; text: string; label: string }> = {
  failure: { bg: 'bg-rose-500/10 border-rose-500/20', text: 'text-rose-400', label: 'FAILURE DETECTED' },
  danger: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', label: 'DANGER ZONE' },
  ask: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', label: 'GUIDANCE' },
  welcome: { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400', label: 'WELCOME' },
};

const AITutorPanel: React.FC = () => {
  const { tutorOpen, running, activeLab } = useLabStore();
  const { messages, addStudentMsg, askAI, clearMessages, getCooldownRemaining } = useSocraticAI();

  const [input, setInput] = useState('');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [cooldownLeft, setCooldownLeft] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCooldownLeft(Math.ceil(getCooldownRemaining() / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [getCooldownRemaining]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    addStudentMsg(text);
    setInput('');
    inputRef.current?.focus();
  }, [input, addStudentMsg]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSpeak = (id: string, text: string) => {
    const clean = text.replace(/\*\*/g, '');
    speak(clean);
    setSpeakingId(id);
    setTimeout(() => setSpeakingId(null), Math.max(3000, clean.length * 60));
  };

  if (!tutorOpen) return null;

  return (
    <aside
      id="ai-tutor-panel"
      className="fixed right-0 top-16 bottom-0 w-80 flex flex-col glass-panel border-l border-white/[0.06] z-40"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <img src="/icon_ai_tutor.png" alt="AI" className="w-5 h-5 object-contain" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Lab Mentor</h3>
            <div className="flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${running ? 'bg-emerald-400 animate-pulse' : 'bg-white/30'}`} />
              <span className="text-[10px] text-white/50">
                {running ? 'Observing silently...' : 'Ready'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            id="clear-chat"
            onClick={clearMessages}
            className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors"
            title="Clear chat"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-3 py-3 space-y-3 scrollbar-thin"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 14, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'ai' && (
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mr-2 mt-1 shrink-0">
                  <img src="/icon_ai_tutor.png" alt="AI" className="w-4 h-4 object-contain" />
                </div>
              )}

              <div
                className={`relative max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'student'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm shadow-lg shadow-blue-500/10'
                  : 'bg-white/[0.05] text-white/90 rounded-bl-sm border border-white/[0.06]'
                  }`}
              >
                {msg.role === 'ai' && msg.trigger && msg.trigger !== 'welcome' && msg.trigger !== 'student' && (
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest mb-1.5 ${triggerStyle[msg.trigger]?.bg ?? ''} ${triggerStyle[msg.trigger]?.text ?? 'text-white/40'}`}>
                    <span className={`w-1 h-1 rounded-full ${msg.trigger === 'failure' ? 'bg-rose-400' : msg.trigger === 'danger' ? 'bg-amber-400' : 'bg-blue-400'}`} />
                    {triggerStyle[msg.trigger]?.label ?? 'AI'}
                  </div>
                )}

                <p className="whitespace-pre-wrap">{msg.text}</p>

                {msg.role === 'ai' && (
                  <button
                    onClick={() => handleSpeak(msg.id, msg.text)}
                    className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border flex items-center justify-center transition-all group ${speakingId === msg.id
                      ? 'bg-blue-500/20 border-blue-500/30 animate-pulse'
                      : 'bg-white/[0.06] border-white/[0.1] hover:bg-white/[0.12]'
                      }`}
                    title="Listen"
                  >
                    <svg
                      className={`w-3 h-3 ${speakingId === msg.id
                        ? 'text-blue-400'
                        : 'text-white/40 group-hover:text-white/70'
                        }`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                    </svg>
                  </button>
                )}

                <span
                  className={`block text-[9px] mt-1 ${msg.role === 'student' ? 'text-white/40 text-right' : 'text-white/20'
                    }`}
                >
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {running && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3 py-2 bg-emerald-500/[0.06] border-t border-emerald-500/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-emerald-400/80 flex-1">
                Observing {activeLab.replace('-', ' ')} silently...
              </span>
              {cooldownLeft > 0 && (
                <span className="text-[9px] text-white/20 font-mono">{cooldownLeft}s cooldown</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-3 py-2 border-t border-white/[0.04]">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={askAI}
          className="w-full h-9 rounded-xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest hover:from-emerald-500/20 hover:to-teal-500/20 transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Ask AI for Guidance
        </motion.button>
      </div>

      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-2 bg-white/[0.03] rounded-xl border border-white/[0.08] px-3 py-1.5 focus-within:border-blue-500/30 transition-colors">
          <input
            ref={inputRef}
            id="tutor-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your Lab Mentor..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none py-1.5"
          />
          <button
            id="send-message"
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white disabled:opacity-25 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export { AITutorPanel };
export default AITutorPanel;
