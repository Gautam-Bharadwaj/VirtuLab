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

/** Map failure names to hint keys */
function failureToHintKey(failureName: string): string {
  const lower = failureName.toLowerCase();
  if (lower.includes('overvoltage')) return 'overvoltage';
  if (lower.includes('short circuit') || lower.includes('short_circuit')) return 'short_circuit';
  if (lower.includes('denaturation') || lower.includes('enzyme')) return 'enzyme_denaturation';
  if (lower.includes('ph') || lower.includes('overshoot')) return 'ph_extreme';
  if (lower.includes('angle')) return 'large_angle';
  return 'general';
}

/* ─── Hints cache with 3-level structure ─── */
interface HintLevels {
  level1: string[];
  level2: string[];
  level3: string[];
}

let hintsCache: Record<string, HintLevels> | null = null;

async function loadHints(): Promise<Record<string, HintLevels>> {
  if (hintsCache) return hintsCache;
  try {
    const res = await fetch('/hints.json');
    hintsCache = await res.json();
    return hintsCache!;
  } catch {
    return {
      general: {
        level1: ['🔍 Try resetting to default values and adjusting one parameter at a time.'],
        level2: ['Look at the bottom bar readings carefully. Which value seems unusual?'],
        level3: ['Reset to defaults, then change only one slider while keeping everything else constant.'],
      },
    };
  }
}

function pickHintAtLevel(
  hints: Record<string, HintLevels>,
  key: string,
  level: number,
  inputs: Record<string, number>
): string {
  const hintSet = hints[key] ?? hints['general'];
  if (!hintSet) return 'Check your parameters!';
  const levelKey = `level${Math.min(level, 3)}` as keyof HintLevels;
  const pool = hintSet[levelKey] ?? hintSet.level1 ?? ['Check your parameters!'];
  let hint = pool[Math.floor(Math.random() * pool.length)];
  // Replace template variables
  for (const [k, v] of Object.entries(inputs)) {
    hint = hint.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
  }
  // Compute current for circuit
  if (inputs.voltage !== undefined && inputs.resistance !== undefined) {
    hint = hint.replace(/\{current\}/g, (inputs.voltage / inputs.resistance).toFixed(3));
  }
  return hint;
}

/* ─── Danger zone thresholds ─── */
function isInDangerZone(lab: string, inputs: Record<string, number>): boolean {
  switch (lab) {
    case 'circuit': {
      const current = (inputs.voltage ?? 0) / Math.max(inputs.resistance ?? 1, 0.01);
      return current > 0.04; // 80% of 0.05A max
    }
    case 'titration':
      return (inputs.baseVolume ?? 0) > 40;
    case 'enzyme':
      return (inputs.temperature ?? 0) > 55;
    case 'pendulum':
      return (inputs.angle ?? 0) > 70;
    default:
      return false;
  }
}

const COOLDOWN_MS = 30000; // 30 seconds

/* ─────────────────────────────────────────── */
/* ─── AITutorPanel Component ─────────────── */
/* ─────────────────────────────────────────── */
const AITutorPanel: React.FC = () => {
  const {
    tutorOpen,
    running,
    failureState,
    lastAIMessageTime,
    setLastAIMessageTime,
    misconceptionLevel,
    incrementMisconceptionLevel,
    setDangerStartTime,
  } = useLabStore();
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
  const prevFailureRef = useRef<string | null>(null);

  /* ── Auto-scroll on new messages ── */
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isLoading]);

  /* ── Add message helper (respects cooldown) ── */
  const addMsg = useCallback(
    (role: 'ai' | 'student', text: string, forceSend = false) => {
      if (role === 'ai' && !forceSend) {
        const now = Date.now();
        if (now - lastAIMessageTime < COOLDOWN_MS) return; // cooldown active
        setLastAIMessageTime(now);
      }
      setMessages((prev) => [
        ...prev,
        { id: genId(), role, text, timestamp: Date.now() },
      ]);
    },
    [lastAIMessageTime, setLastAIMessageTime]
  );

  /* ── TRIGGER 1: Failure happens ── */
  useEffect(() => {
    if (!failureState) {
      prevFailureRef.current = null;
      return;
    }
    // Don't repeat for same failure
    if (prevFailureRef.current === failureState.name) return;
    prevFailureRef.current = failureState.name;

    const key = failureToHintKey(failureState.name);
    const level = (misconceptionLevel[key] ?? 0) + 1;
    incrementMisconceptionLevel(key);

    (async () => {
      const hints = await loadHints();
      const storeInputs = useLabStore.getState().inputs;
      const hint = pickHintAtLevel(hints, key, level, storeInputs);
      addMsg('ai', `⚠️ **${failureState.name}**\n\n${hint}`);
    })();
  }, [failureState]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── TRIGGER 2: Danger zone for 5 seconds ── */
  useEffect(() => {
    if (!running) {
      setDangerStartTime(null);
      return;
    }

    const interval = setInterval(() => {
      const state = useLabStore.getState();
      const inDanger = isInDangerZone(state.activeLab, state.inputs);

      if (inDanger) {
        if (!state.dangerStartTime) {
          setDangerStartTime(Date.now());
        } else if (Date.now() - state.dangerStartTime >= 5000) {
          // 5 seconds in danger zone — send gentle warning
          const key = state.activeLab === 'circuit' ? 'overvoltage'
            : state.activeLab === 'titration' ? 'ph_extreme'
            : state.activeLab === 'enzyme' ? 'enzyme_denaturation'
            : state.activeLab === 'pendulum' ? 'large_angle'
            : 'general';
          const level = (state.misconceptionLevel[key] ?? 0) + 1;

          (async () => {
            const hints = await loadHints();
            const hint = pickHintAtLevel(hints, key, level, state.inputs);
            addMsg('ai', `🔔 Gentle warning: You've been in the danger zone for a while.\n\n${hint}`);
          })();
          setDangerStartTime(null); // Reset so it doesn't fire continuously
        }
      } else {
        setDangerStartTime(null);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [running]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── TRIGGER 3: Student clicks "Ask AI" or types message ── */
  const handleAskAI = useCallback(async () => {
    const state = useLabStore.getState();
    addMsg('student', '💡 Help me understand what\'s happening', true);
    setIsLoading(true);

    try {
      const res = await fetch(`${backendUrl}/api/tutor/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: 'Help me understand the current experiment state',
          activeLab: state.activeLab,
          inputs: state.inputs,
          failureState: state.failureState,
        }),
      });
      if (!res.ok) throw new Error('API unavailable');
      const data = await res.json();
      addMsg('ai', data.reply || data.message, true);
    } catch {
      const hints = await loadHints();
      const key = state.failureState ? failureToHintKey(state.failureState.name) : 'general';
      const hint = pickHintAtLevel(hints, key, 1, state.inputs);
      addMsg('ai', hint, true);
    }
    setIsLoading(false);
  }, [addMsg, backendUrl]);

  /* ── Student sends a message ── */
  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    addMsg('student', text, true);
    setInput('');
    inputRef.current?.focus();

    setIsLoading(true);
    (async () => {
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
        addMsg('ai', data.reply || data.message, true);
      } catch {
        const replies: Record<string, string> = {
          circuit: "Great question! In circuits, Ohm's Law (V = IR) is fundamental. Try adjusting resistance and observe how current changes proportionally. 🔬",
          titration: "During titration, you're adding a known base to determine the unknown acid concentration. Watch the pH curve! 📊",
          enzyme: "Enzyme kinetics follow Michaelis-Menten: v = Vmax·[S]/(Km+[S]). Temperature affects the rate — but too high denatures the enzyme! 🧬",
          pendulum: "The simple pendulum follows T = 2π√(L/g). Period depends on length and gravity, not mass or amplitude (for small angles). ⏱️",
          gravity: "Newton's Law: F = GMm/r². Force increases with mass and decreases with the square of distance. 🌍",
        };
        addMsg('ai', replies[state.activeLab] || "That's an interesting question! Try experimenting with the controls. 🔍", true);
      }
      setIsLoading(false);
    })();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  /* ── Speak button handler ── */
  const handleSpeak = (id: string, text: string) => {
    const clean = text.replace(/\*\*/g, '').replace(/⚠️/g, 'Warning: ');
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
                {running ? 'Watching silently' : 'Online'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Ask AI Button — TRIGGER 3 */}
          <button
            id="ask-ai-btn"
            onClick={handleAskAI}
            disabled={isLoading}
            className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-600/80 to-indigo-600/80 text-[10px] font-bold text-white hover:shadow-lg hover:shadow-blue-500/20 transition-all disabled:opacity-40"
            title="Ask AI for guidance"
          >
            💡 Ask AI
          </button>
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

      {/* ── Event-Driven Notice ── */}
      <div className="px-3 py-2 bg-blue-500/[0.04] border-b border-blue-500/10">
        <span className="text-[10px] text-blue-400/60">
          🧠 I only speak when something important happens — or when you ask.
        </span>
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
                  className={`block text-[9px] mt-1 ${msg.role === 'student' ? 'text-white/40 text-right' : 'text-white/20'}`}
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
