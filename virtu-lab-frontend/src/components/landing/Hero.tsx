import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, MoveRight, BookX, Eye } from 'lucide-react';

export const Hero: React.FC = () => {
    const [frame, setFrame] = useState(1);
    const [imagesLoaded, setImagesLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        let loadedCount = 0;
        const totalFrames = 240;
        const imgs: HTMLImageElement[] = [];

        for (let i = 1; i <= totalFrames; i++) {
            const img = new Image();
            img.src = `/baba-transparent-clean/ezgif-frame-${i.toString().padStart(3, '0')}.png`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === totalFrames) {
                    setImagesLoaded(true);
                }
            };
            imgs.push(img);
        }
        imagesRef.current = imgs;
    }, []);

    useEffect(() => {
        if (!imagesLoaded || !isVisible) return;

        let animationFrameId: number;
        let lastTimestamp = 0;
        const fps = 25;
        const frameInterval = 1000 / fps;

        const renderFrame = (timestamp: number) => {
            if (timestamp - lastTimestamp >= frameInterval) {
                setFrame((prev) => (prev % 240) + 1);
                lastTimestamp = timestamp;
            }
            animationFrameId = requestAnimationFrame(renderFrame);
        };

        animationFrameId = requestAnimationFrame(renderFrame);

        return () => cancelAnimationFrame(animationFrameId);
    }, [imagesLoaded, isVisible]);

    useEffect(() => {
        if (!imagesLoaded || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;

        const imgWidth = 1280;
        const imgHeight = 720;

        canvas.width = imgWidth * dpr;
        canvas.height = imgHeight * dpr;

        ctx.scale(dpr, dpr);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const currentImg = imagesRef.current[frame - 1];
        if (currentImg) {
            ctx.clearRect(0, 0, imgWidth, imgHeight);
            ctx.drawImage(currentImg, 0, 0, imgWidth, imgHeight);
        }
    }, [frame, imagesLoaded]);

    const getThemeColor = () => {
        const colors = [
            'rgb(249, 115, 22)',   // Orange-500
            'rgb(234, 88, 12)',    // Orange-600
            'rgb(16, 185, 129)',   // Emerald-500
            'rgb(251, 146, 60)',   // Orange-400
        ];
        const colorIndex = Math.floor((frame / 60) % colors.length);
        return colors[colorIndex];
    };

    const currentThemeColor = getThemeColor();

    return (
        <section ref={sectionRef} className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden pt-32 pb-20">
            <div className="absolute inset-0 z-0 transition-colors duration-1000 ease-in-out"
                style={{ background: `radial-gradient(circle at center, ${currentThemeColor}05, transparent 70%)`, willChange: 'background' }}>
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[80px] animate-pulse transition-colors duration-1000"
                    style={{ backgroundColor: `${currentThemeColor}08`, willChange: 'background, opacity' }} />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full blur-[80px] animate-pulse transition-colors duration-1000"
                    style={{ backgroundColor: `${currentThemeColor}08`, willChange: 'background, opacity' }} />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="flex flex-col gap-8 md:-ml-6 lg:-ml-12 mt-12 md:mt-20"
                >
                    <div className="flex flex-col gap-3">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#171717] border border-orange-500/30 text-orange-500 text-xs font-semibold uppercase tracking-widest w-fit backdrop-blur-md">
                            <Sparkles size={14} />
                            Next-Gen Science Education
                        </div>

                        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1]">
                            Experience Science <br />
                            <span className="text-orange-500">
                                In Virtual Reality
                            </span>
                        </h1>
                    </div>

                    <p className="text-xl text-white/60 max-lg:max-w-md leading-relaxed">
                        Step into immersive laboratory environments. Conduct complex experiments in chemistry, physics, and biology with precision and safety from anywhere in the world.
                    </p>

                    <div className="flex flex-wrap items-center gap-5 mt-4">
                        <button
                            onClick={() => document.getElementById('explore-labs')?.scrollIntoView({ behavior: 'smooth' })}
                            className="group relative px-8 py-4 rounded-2xl bg-orange-500 text-white font-bold flex items-center gap-2 overflow-hidden shadow-[0_20px_40px_rgba(249,115,22,0.2)] transition-all duration-300 active:scale-95"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <span className="relative z-10 font-black tracking-tight uppercase text-sm">Get Started</span>
                            <MoveRight className="relative z-10 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <a
                            href="#simulations"
                            className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all uppercase text-sm tracking-tight shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                        >
                            Explore Labs
                        </a>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative flex items-center justify-center p-8 lg:p-12 mb-10"
                >
                    <div className="absolute inset-x-0 bottom-0 top-1/4 rounded-full blur-[120px] z-0 animate-pulse transition-colors duration-1000"
                        style={{ backgroundColor: `${currentThemeColor}20` }} />

                    <motion.div
                        className="relative z-10 flex items-center justify-center scale-110 md:scale-125 transition-transform duration-700"
                        style={{ filter: `drop-shadow(0 40px 60px ${currentThemeColor}50) contrast(1.05)` }}
                    >
                        {!imagesLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                <div className="w-10 h-10 border-4 border-orange-500/20 border-t-orange-500 rounded-full animate-spin" />
                            </div>
                        )}
                        <canvas
                            ref={canvasRef}
                            className={`w-full max-w-[650px] h-auto transition-opacity duration-500 ${imagesLoaded ? 'opacity-100' : 'opacity-0'}`}
                            style={{ willChange: 'transform' }}
                        />
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-10 right-0 z-20 p-4 rounded-2xl glass-panel bg-[#171717]/80 border border-white/10 shadow-xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-red-500/20 shadow-lg shadow-red-500/10">
                                <BookX size={20} className="text-red-500" />
                            </div>
                            <div>
                                <div className="text-[10px] text-white/50 uppercase font-black">Old Way</div>
                                <div className="text-sm text-white font-bold">Say No to ratna</div>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        animate={{ y: [0, 15, 0], x: [0, -5, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        className="absolute bottom-10 left-0 z-20 p-4 rounded-2xl glass-panel bg-[#171717]/80 border border-white/10 shadow-xl"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-orange-500/20 shadow-lg shadow-orange-500/10">
                                <Eye size={20} className="text-orange-500" />
                            </div>
                            <div>
                                <div className="text-[10px] text-white/50 uppercase font-black">New Way</div>
                                <div className="text-sm text-white font-bold">Ab Visualise Karke Padho</div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40"
            >
                <span className="text-[10px] uppercase font-bold tracking-widest">Scroll to explore</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white/30 to-transparent" />
            </motion.div>
        </section>
    );
};
