import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLabStore } from '../../store/useLabStore';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Types ─── */
interface Message {
  id: string;
  role: 'ai' | 'student';
  text: string;
  timestamp: number;
}

/* ─── Text-to-Speech ─── */
const speak = (text: string) => {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-IN';
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
};

/* ─── Helpers ─── */
const genId = () =>
  `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

/** Map failure names to hint keys in /hints.json */
function failureToHintKey(failureName: string): string {
  const lower = failureName.toLowerCase();
  if (lower.includes('overvoltage')) return 'overvoltage';
  if (lower.includes('short circuit') || lower.includes('short_circuit'))
    return 'short_circuit';
  if (lower.includes('denaturation') || lower.includes('enzyme'))
    return 'enzyme_denaturation';
  if (lower.includes('ph')) return 'ph_extreme';
  return 'general';
}

let hintsCache: Record<string, string[]> | null = null;

async function loadHints(): Promise<Record<string, string[]>> {
  if (hintsCache) return hintsCache;
  try {
    const res = await fetch('/hints.json');
    hintsCache = await res.json();
    return hintsCache!;
  } catch {
    return { general: ['🔍 Try resetting to default values and adjusting one parameter at a time.'] };
  }
}

function pickRandomHint(hints: Record<string, string[]>, key: string): string {
  const pool = hints[key] ?? hints['general'] ?? ['Check your parameters!'];
  return pool[Math.floor(Math.random() * pool.length)];
}

/* ─────────────────────────────────────────── */
/* ─── AITutorPanel Component ─────────────── */
/* ─────────────────────────────────────────── */
const AITutorPanel: React.FC = () => {
  const { tutorOpen, running, activeLab, failureState } = useLabStore();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

  /* ── Local state ── */
  const [messages, setMessages] = useState<Message[]>([
    {
      id: genId(),
      role: 'ai',
      text: 'Welcome to VirtuLab! Start an experiment and I will guide you through it. 🧪',
      timestamp: Date.now(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastAnalyzeRef = useRef<number>(0);

  /* ── Auto-scroll on new messages ── */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  /* ── Add message helper ── */
  const addMsg = useCallback((role: 'ai' | 'student', text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: genId(), role, text, timestamp: Date.now() },
    ]);
  }, []);

  /* ── Offline fallback: use hints.json ── */
  const offlineFallback = useCallback(async () => {
    const hints = await loadHints();
    const { failureState: fs } = useLabStore.getState();
    const key = fs ? failureToHintKey(fs) : 'general';
    const hint = pickRandomHint(hints, key);
    addMsg('ai', hint);
  }, [addMsg]);

  /* ── Poll: every 3 seconds while running, POST to /api/tutor/analyze ── */
  useEffect(() => {
    if (!running) return;

    const interval = setInterval(async () => {
      // Prevent overlapping requests
      const now = Date.now();
      if (now - lastAnalyzeRef.current < 2500) return;
      lastAnalyzeRef.current = now;

      const state = useLabStore.getState();
      const payload = {
        activeLab: state.activeLab,
        inputs: state.inputs,
        running: state.running,
        failureState: state.failureState,
      };

      try {
        const res = await fetch(`${backendUrl}/api/tutor/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (data.should_intervene && data.message) {
          addMsg('ai', data.message);
        }
      } catch {
        // Offline or API unavailable → use local hints
        await offlineFallback();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [running, addMsg, offlineFallback]);

  /* ── Also notify on failure state changes ── */
  useEffect(() => {
    if (failureState) {
      addMsg(
        'ai',
        `⚠️ **${failureState}** — ${"A failure condition was triggered"}\n\nLet me help you understand what went wrong...`
      );
    }
  }, [failureState, addMsg]);

  /* ── Student sends a message ── */
  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    addMsg('student', text);
    setInput('');
    inputRef.current?.focus();

    // Simulate AI reply (would be replaced with real API call)
    setIsLoading(true);
    setTimeout(async () => {
      const state = useLabStore.getState();
      try {
        const res = await fetch(`${backendUrl}/api/tutor/ask`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: text,
            activeLab: state.activeLab,
            inputs: state.inputs,
          }),
        });
        if (!res.ok) throw new Error('API unavailable');
        const data = await res.json();
        addMsg('ai', data.reply || data.message);
      } catch {
        // Offline fallback: local context-aware reply
        const replies: Record<string, string> = {
          circuit:
            "Great question! In circuits, Ohm's Law (V = IR) is fundamental. Try adjusting resistance and observe how current changes proportionally. The power dissipated is P = V²/R. 🔬",
          titration:
            "During titration, you're adding a known base to determine the unknown acid concentration. The equivalence point is where moles of acid = moles of base. Watch the pH curve! 📊",
          enzyme:
            "Enzyme kinetics follow Michaelis-Menten: v = Vmax·[S]/(Km+[S]). As substrate increases, rate approaches Vmax. Temperature affects the rate — but too high denatures the enzyme! 🧬",
        };
        addMsg('ai', replies[state.activeLab] || "That's an interesting question! Try experimenting with the controls — I'll help you understand what you observe. 🔍");
      }
      setIsLoading(false);
    }, 800 + Math.random() * 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ── Speak button handler ── */
  const handleSpeak = (id: string, text: string) => {
    // Strip markdown-like syntax for cleaner speech
    const clean = text.replace(/\*\*/g, '').replace(/⚠️/g, 'Warning: ');
    speak(clean);
    setSpeakingId(id);
    // Reset after estimated duration
    setTimeout(() => setSpeakingId(null), Math.max(3000, clean.length * 60));
  };

  if (!tutorOpen) return null;

  return (
    <aside
      id="ai-tutor-panel"
      className="fixed right-0 top-16 bottom-0 w-80 flex flex-col glass-panel border-l border-white/[0.06] z-40"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="text-base">🤖</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">Lab Mentor</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400/80">
                {running ? 'Monitoring experiment' : 'Online'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Clear chat */}
          <button
            id="clear-chat"
            onClick={() =>
              setMessages([
                {
                  id: genId(),
                  role: 'ai',
                  text: 'Chat cleared. How can I help you? 🧪',
                  timestamp: Date.now(),
                },
              ])
            }
            className="p-1.5 rounded-lg hover:bg-white/[0.06] text-white/30 hover:text-white/60 transition-colors"
            title="Clear chat"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Messages List ── */}
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
              {/* AI avatar */}
              {msg.role === 'ai' && (
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mr-2 mt-1 shrink-0">
                  <span className="text-xs">🤖</span>
                </div>
              )}

              <div
                className={`relative max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'student'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm shadow-lg shadow-blue-500/10'
                  : 'bg-white/[0.05] text-white/90 rounded-bl-sm border border-white/[0.06]'
                  }`}
              >
                <p className="whitespace-pre-wrap">{msg.text}</p>

                {/* Speaker button on AI messages */}
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

                {/* Timestamp */}
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

        {/* ── Typing indicator ── */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="flex justify-start"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center mr-2 mt-1 shrink-0">
                <span className="text-xs">🤖</span>
              </div>
              <div className="bg-white/[0.05] rounded-2xl rounded-bl-sm px-4 py-3 border border-white/[0.06]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-emerald-400/50 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-2 h-2 bg-emerald-400/50 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-2 h-2 bg-emerald-400/50 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Active Monitoring Banner ── */}
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
              <span className="text-[11px] text-emerald-400/80">
                Monitoring {activeLab === 'circuit' ? '⚡ Circuit' : activeLab === 'titration' ? '🧪 Titration' : '🧬 Enzyme'} experiment…
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Input Area ── */}
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
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/25 outline-none py-1.5 disabled:opacity-50"
          />
          <button
            id="send-message"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
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

/* ── Named + Default export ── */
export { AITutorPanel };
export default AITutorPanel;
