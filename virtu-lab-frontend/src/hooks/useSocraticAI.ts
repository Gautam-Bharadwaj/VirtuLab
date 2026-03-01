import { useCallback, useEffect, useRef, useState } from 'react';
import { useLabStore, LabType, LabInputs, FailureState } from '../store/useLabStore';

export interface SocraticMessage {
    id: string;
    role: 'ai' | 'student';
    text: string;
    timestamp: number;
    trigger?: 'failure' | 'danger' | 'ask' | 'welcome' | 'student';
}

interface HintsData {
    failures: Record<string, { levels: string[] }>;
    danger_zones: Record<string, { condition_description: string; levels: string[] }>;
    ask_ai: Record<string, string[]>;
}

const COOLDOWN_MS = 30_000; // 30 seconds
const DANGER_HOLD_MS = 5_000; // 5 seconds of danger before warning

const genId = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

function computeVars(_lab: LabType, inputs: LabInputs): Record<string, string> {
    const v: Record<string, string> = {};
    const voltage = inputs.voltage ?? 5;
    const resistance = inputs.resistance ?? 100;
    const current = (voltage / resistance) * 1000;
    const power = voltage * (voltage / resistance);
    const angle = inputs.angle ?? 45;
    const velocity = inputs.velocity ?? 20;
    const temperature = inputs.temperature ?? 25;
    const concentration = inputs.concentration ?? 1;
    const baseVolume = inputs.baseVolume ?? 0;
    const focalLength = inputs.focalLength ?? 15;
    const objectDistance = inputs.objectDistance ?? 30;

    v['voltage'] = voltage.toFixed(1);
    v['resistance'] = resistance.toFixed(0);
    v['current'] = current.toFixed(1);
    v['power'] = power.toFixed(2);
    v['angle'] = angle.toFixed(0);
    v['velocity'] = velocity.toFixed(0);
    v['temperature'] = temperature.toFixed(0);
    v['concentration'] = concentration.toFixed(1);
    v['baseVolume'] = baseVolume.toFixed(1);
    v['focalLength'] = focalLength.toFixed(0);
    v['objectDistance'] = objectDistance.toFixed(0);
    v['complementary'] = (90 - angle).toFixed(0);
    v['twoAngle'] = (2 * angle).toFixed(0);
    v['sinValue'] = Math.sin((2 * angle * Math.PI) / 180).toFixed(3);

    return v;
}

function interpolate(text: string, vars: Record<string, string>): string {
    return text.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? `{${key}}`);
}

function isDangerZone(lab: LabType, inputs: LabInputs): boolean {
    switch (lab) {
        case 'ohm-law': {
            const current = ((inputs.voltage ?? 5) / (inputs.resistance ?? 100)) * 1000;
            return current > 200; // above 200mA
        }
        case 'projectile-motion':
            return (inputs.velocity ?? 20) > 40 || (inputs.angle ?? 45) > 80;
        case 'titration': {
            const vol = inputs.baseVolume ?? 0;
            return vol >= 23 && vol <= 27; // near equivalence point
        }
        case 'optics-bench': {
            const f = inputs.focalLength ?? 15;
            const u = inputs.objectDistance ?? 30;
            return Math.abs(u - f) < 3; // object near focal point
        }
        case 'reaction-rate':
            return (inputs.temperature ?? 25) > 80;
        default:
            return false;
    }
}

function failureToKey(failure: FailureState): string {
    const n = failure.name.toUpperCase();
    if (n.includes('OVERLOAD') || n.includes('OVERVOLTAGE')) return 'OVERLOAD';
    if (n.includes('SHORT') || n.includes('SHORT_CIRCUIT')) return 'SHORT_CIRCUIT';
    if (n.includes('OVERSHOOT')) return 'OVERSHOOT';
    if (n.includes('ZERO') || n.includes('ZERO_RANGE')) return 'ZERO_RANGE';
    if (n.includes('LARGE_ANGLE') || n.includes('ANGLE')) return 'LARGE_ANGLE';
    if (n.includes('PH') || n.includes('EXTREME')) return 'PH_EXTREME';
    if (n.includes('ENZYME') || n.includes('DENAT')) return 'ENZYME_DENATURATION';
    return 'OVERLOAD'; // fallback
}

export function useSocraticAI() {
    const { running, activeLab, inputs, failureState } = useLabStore();

    const [messages, setMessages] = useState<SocraticMessage[]>([
        {
            id: genId(),
            role: 'ai',
            text: "Welcome to VirtuLab! I'm your Lab Mentor. I'll watch your experiment silently and only speak when something important happens. Start experimenting — I'm here when you need me.",
            timestamp: Date.now(),
            trigger: 'welcome',
        },
    ]);

    const hintsRef = useRef<HintsData | null>(null);
    const lastAIMsgTimeRef = useRef<number>(0); // cooldown tracker
    const misconceptionCountRef = useRef<Record<string, number>>({}); // escalation tracker
    const dangerStartRef = useRef<number | null>(null); // when danger zone entered
    const dangerWarnedRef = useRef<boolean>(false); // already warned for this danger session
    const prevFailureRef = useRef<FailureState | null>(null); // track failure changes

    useEffect(() => {
        fetch('/hints.json')
            .then(res => res.json())
            .then((data: HintsData) => {
                hintsRef.current = data;
            })
            .catch(() => {
                hintsRef.current = {
                    failures: {},
                    danger_zones: {},
                    ask_ai: {
                        general: [
                            "What variable do you think has the biggest effect? Try testing it.",
                            "Can you predict the result before pressing Run?",
                            "What surprised you about this experiment?"
                        ]
                    }
                };
            });
    }, []);

    useEffect(() => {
        dangerStartRef.current = null;
        dangerWarnedRef.current = false;
        misconceptionCountRef.current = {};
    }, [activeLab]);

    const isCooldownActive = useCallback(() => {
        return Date.now() - lastAIMsgTimeRef.current < COOLDOWN_MS;
    }, []);

    const addAIMsg = useCallback((text: string, trigger: SocraticMessage['trigger']) => {
        if (isCooldownActive()) return false;
        const msg: SocraticMessage = {
            id: genId(),
            role: 'ai',
            text,
            timestamp: Date.now(),
            trigger,
        };
        setMessages(prev => [...prev, msg]);
        lastAIMsgTimeRef.current = Date.now();
        return true;
    }, [isCooldownActive]);

    const addStudentMsg = useCallback((text: string) => {
        setMessages(prev => [
            ...prev,
            { id: genId(), role: 'student', text, timestamp: Date.now(), trigger: 'student' },
        ]);
    }, []);

    const getLevel = useCallback((key: string): number => {
        const count = misconceptionCountRef.current[key] ?? 0;
        misconceptionCountRef.current[key] = count + 1;
        return Math.min(count, 2); // 0, 1, 2 (3 levels)
    }, []);

    useEffect(() => {
        if (!failureState) {
            prevFailureRef.current = null;
            return;
        }

        if (prevFailureRef.current?.name === failureState.name) return;
        prevFailureRef.current = failureState;

        const hints = hintsRef.current;
        if (!hints) return;

        const key = failureToKey(failureState);
        const failureHints = hints.failures[key];
        if (!failureHints) return;

        const level = getLevel(key);
        const vars = computeVars(activeLab, inputs);
        const rawText = failureHints.levels[level] ?? failureHints.levels[0];
        const text = interpolate(rawText, vars);

        addAIMsg(text, 'failure');
    }, [failureState, activeLab, inputs, addAIMsg, getLevel]);

    useEffect(() => {
        if (!running) {
            dangerStartRef.current = null;
            dangerWarnedRef.current = false;
            return;
        }

        const interval = setInterval(() => {
            const state = useLabStore.getState();
            const inDanger = isDangerZone(state.activeLab, state.inputs);

            if (inDanger) {
                if (!dangerStartRef.current) {
                    dangerStartRef.current = Date.now();
                }

                const elapsed = Date.now() - dangerStartRef.current;
                if (elapsed >= DANGER_HOLD_MS && !dangerWarnedRef.current) {
                    dangerWarnedRef.current = true;
                    const hints = hintsRef.current;
                    if (!hints) return;

                    const dangerConf = hints.danger_zones[state.activeLab];
                    if (!dangerConf) return;

                    const key = `danger_${state.activeLab}`;
                    const level = getLevel(key);
                    const vars = computeVars(state.activeLab, state.inputs);
                    const rawText = dangerConf.levels[level] ?? dangerConf.levels[0];
                    const text = interpolate(rawText, vars);

                    addAIMsg(text, 'danger');
                }
            } else {
                dangerStartRef.current = null;
                dangerWarnedRef.current = false;
            }
        }, 1000); // check every second

        return () => clearInterval(interval);
    }, [running, addAIMsg, getLevel]);

    const askAI = useCallback(() => {
        const state = useLabStore.getState();
        const hints = hintsRef.current;
        if (!hints) return;

        const labHints = hints.ask_ai[state.activeLab] ?? hints.ask_ai['general'] ?? [];
        if (labHints.length === 0) return;

        const vars = computeVars(state.activeLab, state.inputs);
        const rawText = labHints[Math.floor(Math.random() * labHints.length)];
        const text = interpolate(rawText, vars);

        const msg: SocraticMessage = {
            id: genId(),
            role: 'ai',
            text,
            timestamp: Date.now(),
            trigger: 'ask',
        };
        setMessages(prev => [...prev, msg]);
        lastAIMsgTimeRef.current = Date.now();
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([
            {
                id: genId(),
                role: 'ai',
                text: "Chat cleared. I'm still watching your experiment — I'll speak when something important happens.",
                timestamp: Date.now(),
                trigger: 'welcome',
            },
        ]);
        misconceptionCountRef.current = {};
    }, []);

    const getCooldownRemaining = useCallback((): number => {
        const elapsed = Date.now() - lastAIMsgTimeRef.current;
        return Math.max(0, COOLDOWN_MS - elapsed);
    }, []);

    return {
        messages,
        addStudentMsg,
        askAI,
        clearMessages,
        isCooldownActive,
        getCooldownRemaining,
    };
}
