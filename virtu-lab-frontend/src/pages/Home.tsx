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
