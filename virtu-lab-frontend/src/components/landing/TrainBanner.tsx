import React from 'react';
import { motion } from 'framer-motion';

export const TrainBanner: React.FC = () => {
    return (
        <div className="absolute top-[58px] md:top-[60px] left-0 right-0 h-[80px] pointer-events-none overflow-x-hidden overflow-y-visible z-[45]">

            <motion.div
                className="absolute top-0 flex items-center gap-1 h-full z-10"
                initial={{ x: "-50vw" }}
                animate={{ x: "120vw" }}
                transition={{
                    repeat: Infinity,
                    duration: 18,
                    ease: "linear",
                }}
            >
                <div className="relative flex items-center pr-6 h-full">
                    <div className="bg-gradient-to-r from-orange-600 to-amber-500 px-3 py-1 rounded-l text-white border border-white/20 shadow-md shadow-orange-500/20 flex items-center gap-1.5 relative pointer-events-auto">

                        <svg className="absolute -left-2 top-0 h-full w-2 text-orange-600 drop-shadow-md -scale-x-100" preserveAspectRatio="none" viewBox="0 0 10 100" fill="currentColor">
                            <path d="M0,0 L10,25 L0,50 L10,75 L0,100 Z" />
                        </svg>

                        <span className="text-[10px] sm:text-xs font-black whitespace-nowrap tracking-wider uppercase flex items-center gap-2">
                            <img src="/icon_train.png" alt="Train" className="w-5 h-5 object-contain" />
                            SPECIAL OFFERS INSIDE!
                        </span>
                    </div>

                    <div className="w-6 h-[1px] bg-white/50 absolute right-0 top-1/2 -translate-y-1/2"></div>
                </div>

                <div className="w-24 h-12 sm:w-32 sm:h-16 relative z-10 drop-shadow-[0_4px_6px_rgba(239,68,68,0.4)] flex items-center">

                    <div className="absolute top-1/2 -translate-y-1/2 -right-24 w-28 h-8 bg-gradient-to-r from-yellow-100/60 via-yellow-200/20 to-transparent blur-md rounded-full pointer-events-none z-0 transform origin-left" style={{ clipPath: 'polygon(0 40%, 100% 0, 100% 100%, 0 60%)' }}></div>

                    <img
                        src="/red_train_top_nobg.png"
                        alt="Red Toy Train (Top View)"
                        className="w-full h-full object-contain relative z-10"
                    />

                    <div className="absolute top-1/2 -translate-y-1/2 -right-0.5 w-2 h-2 bg-yellow-100 rounded-full animate-pulse blur-[1px] shadow-[0_0_12px_rgba(253,224,71,1)] z-20"></div>
                </div>
            </motion.div>
        </div >
    );
};
