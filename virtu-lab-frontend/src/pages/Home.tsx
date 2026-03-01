import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LandingNavbar } from '../components/landing/LandingNavbar';
import { TrainBanner } from '../components/landing/TrainBanner';
import { Hero } from '../components/landing/Hero';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

export const Home: React.FC = () => {
    const { scrollYProgress } = useScroll();
    const trainY = useTransform(scrollYProgress, [0, 1], ["12vh", "85vh"]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const simulations = [
        { name: 'Pendulum Motion', subject: 'Physics', color: 'bg-blue-500', labKey: 'pendulum' },
        { name: 'Gravity Sandbox', subject: 'Physics', color: 'bg-cyan-500', labKey: 'gravity' },
        { name: 'Organic Synthesis', subject: 'Chemistry', color: 'bg-rose-500', labKey: 'titration' },
    ];

    const filteredSimulations = selectedCategory
        ? simulations.filter(sim => sim.subject.toLowerCase() === selectedCategory.toLowerCase())
        : simulations;

    const scrollToSimulations = () => {
        document.getElementById('simulations')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="bg-[#0a0a1a] min-h-screen">
            {/* Global background effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/[0.04] rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/[0.04] rounded-full blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/[0.02] rounded-full blur-[120px]" />
            </div>

            {/* Scrolling side track indicator */}
            <div className="fixed right-6 md:right-12 top-0 bottom-0 w-2 flex flex-col items-center justify-start z-50 pointer-events-none mt-20 mb-10 hidden sm:flex">
                {/* Track line (Subtle orange line) */}
                <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-orange-500/20 via-orange-500/10 to-transparent" />

                {/* Scrolling Engine (The Face) */}
                <motion.div
                    className="absolute w-40 h-40 drop-shadow-[0_0_20px_rgba(249,115,22,0.6)] cursor-pointer pointer-events-auto group"
                    style={{ y: trainY }}
                    onClick={() => setIsChatOpen(true)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {/* Thought Bubble (Premium AI Badge) */}
                    <div className="absolute -top-6 -left-16 z-10 px-5 py-2.5 bg-[#171717]/90 border border-orange-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.2)] backdrop-blur-md transform -rotate-6 group-hover:rotate-0 group-hover:scale-110 transition-all duration-300">
                        <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-orange-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                            <span className="font-black bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent text-sm tracking-widest uppercase">
                                ASK AI
                            </span>
                        </div>
                        {/* Little circles below pointing to the character */}
                        <div className="absolute -bottom-3 right-6 w-3 h-3 border border-orange-500/30 bg-[#171717] rounded-full shadow-[0_0_10px_rgba(249,115,22,0.2)]" />
                        <div className="absolute -bottom-6 right-3 w-1.5 h-1.5 border border-orange-500/30 bg-[#171717] rounded-full shadow-[0_0_5px_rgba(249,115,22,0.2)]" />
