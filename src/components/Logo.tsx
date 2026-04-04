"use client";

import { motion } from "framer-motion";

export default function Logo() {
    return (
        <div className="flex flex-col items-center justify-center space-y-2">
            <motion.h1
                initial={{ scale: 1, opacity: 0 }}
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: 1
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="text-7xl md:text-9xl font-bold tracking-tighter text-white"
            >
                VŌLTA
            </motion.h1>
            <p className="text-xs md:text-sm font-thin tracking-widest text-white/60 uppercase">
                La sVŌLTA della settimana
            </p>
        </div>
    );
}
