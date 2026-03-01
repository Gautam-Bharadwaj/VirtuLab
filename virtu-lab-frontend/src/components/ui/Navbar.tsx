import React, { useState, useRef, useEffect } from 'react';
import { useLabStore, Language } from '../../store/useLabStore';
import { motion, AnimatePresence } from 'framer-motion';

const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
    { code: 'ta', label: 'தமிழ்', flag: '🇮🇳' },
];

export const Navbar: React.FC = () => {
    const { language, setLanguage } = useLabStore();
    const [langOpen, setLangOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setLangOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentLang = languages.find((l) => l.code === language)!;

    return (
        <nav className="relative z-50 flex items-center justify-between px-4 md:px-6 h-16 glass-navbar select-none">
            {/* Logo */}
            <a
                href="/"
                className="flex items-center gap-1 cursor-pointer transition-transform hover:scale-105 shrink-0"
            >
                <span className="text-2xl font-black tracking-tighter text-white">
                    VirtuLab<span className="text-orange-500">.ai</span>
                </span>
            </a>

            {/* Nav Links */}
            <div className="flex items-center gap-1">
                <a
                    href="/dashboard"
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all"
                >
                    📊 Dashboard
                </a>
                <a
                    href="/teacher"
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-white/50 hover:text-white/90 hover:bg-white/[0.05] transition-all"
                >
                    👩‍🏫 Teacher
                </a>
            </div>

            {/* Language Selector */}
            <div className="relative shrink-0" ref={dropdownRef}>
                <button
                    id="language-selector"
                    onClick={() => setLangOpen(!langOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.08] transition-all duration-200 text-sm"
                >
                    <span>{currentLang.flag}</span>
                    <span className="hidden sm:inline text-white/70">{currentLang.label}</span>
                    <svg
                        className={`w-3.5 h-3.5 text-white/40 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <AnimatePresence>
                    {langOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 w-44 rounded-xl glass-panel overflow-hidden shadow-2xl"
                        >
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    id={`lang-${lang.code}`}
                                    onClick={() => {
                                        setLanguage(lang.code);
                                        setLangOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150 ${language === lang.code
                                        ? 'bg-orange-500/20 text-orange-300'
                                        : 'text-white/70 hover:bg-white/[0.06] hover:text-white'
                                        }`}
                                >
                                    <span className="text-base">{lang.flag}</span>
                                    <span>{lang.label}</span>
                                    {language === lang.code && (
                                        <svg className="w-4 h-4 ml-auto text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
};
