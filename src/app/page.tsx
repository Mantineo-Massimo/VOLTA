"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden px-6">
            {/* Background Ambience */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon blur-[120px] rounded-full animate-pulse" />
            </div>

            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="z-10 flex flex-col items-center text-center gap-8"
            >
                {/* Pulsing Logo */}
                <motion.div
                    animate={{
                        scale: [1, 1.05, 1],
                        opacity: [0.8, 1, 0.8]
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative w-64 md:w-96 aspect-square"
                >
                    <Image
                        src="/assets/Logo.png"
                        alt="VŌLTA"
                        fill
                        className="object-contain"
                        priority
                    />
                </motion.div>

                {/* Motto */}
                <div className="flex flex-col gap-2">
                    <h1 className="text-4xl md:text-7xl font-thin tracking-[0.2em] uppercase text-white">
                        La <span className="font-bold">sVŌLTA</span> della settimana
                    </h1>
                </div>

                {/* Quick Action */}
                <div className="mt-8">
                    <Link href="/events" className="brutalist-button text-lg">
                        Registrati all&apos;evento di stasera
                    </Link>
                </div>
            </motion.div>

            {/* Decorative Branding */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4 opacity-50">
                <span className="w-12 h-[1px] bg-white"></span>
                <span className="text-[10px] uppercase tracking-[0.5em]">Experience Elite Clubbing</span>
                <span className="w-12 h-[1px] bg-white"></span>
            </div>
        </div>
    );
}
