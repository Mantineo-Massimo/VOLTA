"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Calendar, ArrowRight, Music, Zap } from "lucide-react";

const heroImages = [
    "/assets/DSC_0036.JPG",
    "/assets/DSC_0075.JPG",
    "/assets/DSC_0175.JPG",
    "/assets/DSC_0467.JPG",
];

export default function Home() {
    const [currentImg, setCurrentImg] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImg((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-black text-white selection:bg-gold selection:text-black">
            {/* Immersive Hero Section */}
            <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden px-6">
                {/* Background Image Slider */}
                <div className="absolute inset-0 z-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentImg}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 0.4, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                            className="relative w-full h-full"
                        >
                            <Image
                                src={heroImages[currentImg]}
                                alt="VŌLTA Atmosphere"
                                fill
                                className="object-cover grayscale brightness-50"
                                priority
                            />
                            <div className="absolute inset-0 bg-gold mix-blend-color opacity-30 z-10" />
                        </motion.div>
                    </AnimatePresence>
                    <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black" />
                </div>

                {/* Hero Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="z-10 flex flex-col items-center text-center gap-12"
                >
                    {/* Pulsing Logo */}
                    <motion.div
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="relative w-56 md:w-80 aspect-square"
                    >
                        <Image
                            src="/assets/Logo.png"
                            alt="VŌLTA"
                            fill
                            className="object-contain drop-shadow-[0_0_30px_rgba(255,184,0,0.3)]"
                            priority
                        />
                    </motion.div>

                    {/* Motto */}
                    <div className="flex flex-col gap-4">
                        <h1 className="text-2xl md:text-6xl font-thin tracking-[0.1em] uppercase leading-tight whitespace-nowrap">
                            La s<span className="font-bold text-gold">VŌLTA</span> della settimana
                        </h1>
                        <p className="text-xs md:text-sm uppercase tracking-[0.4em] text-gold/60">
                            The Digital Core of Clubbing Excellence
                        </p>
                    </div>

                    {/* Quick Action */}
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-4"
                    >
                        <Link href="/events" className="brutalist-button text-lg flex items-center gap-4">
                            Scopri gli eventi <ArrowRight size={20} />
                        </Link>
                    </motion.div>
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-30"
                >
                    <div className="w-[1px] h-12 bg-white" />
                </motion.div> section
            </section>

            {/* New Section: Next Event Highlight */}
            <section className="py-32 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="flex flex-col gap-8"
                    >
                        <div className="flex items-center gap-4">
                            <Zap className="text-gold" />
                            <span className="text-gold font-bold uppercase tracking-widest text-sm">Next Experience</span>
                        </div>
                        <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter">
                            VŌLTA Premiere<br /><span className="font-thin text-white/50 underline decoration-gold underline-offset-8">Messina</span>
                        </h2>
                        <p className="text-xl font-thin text-white/70 max-w-md">
                            Il lancio ufficiale della stagione. Un&apos;esperienza immersiva dove il digital incontra il brutalismo sonoro.
                        </p>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4 text-gold/60 uppercase text-sm font-bold tracking-widest">
                                <Calendar size={18} className="text-gold" /> 4 Aprile 2026
                            </div>
                            <div className="flex items-center gap-4 text-gold/60 uppercase text-sm font-bold tracking-widest">
                                <Music size={18} className="text-gold" /> Exclusive Guest DJ Set
                            </div>
                        </div>
                        <Link href="/events" className="text-gold border-b-2 border-gold self-start font-bold uppercase tracking-widest pb-1 hover:text-white hover:border-white transition-colors">
                            Vedi Tutti gli Eventi
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative aspect-square brutalist-border overflow-hidden"
                    >
                        <Image
                            src="/assets/DSC_0395.JPG"
                            alt="Live at VŌLTA"
                            fill
                            className="object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-700"
                        />
                        <div className="absolute inset-0 bg-gold mix-blend-color opacity-20" />
                        <div className="absolute top-4 right-4 bg-gold text-black px-4 py-2 font-bold uppercase text-xs">
                            Limited Capacity
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* New Section: Digital Partner Snippet (B2B focused for Marco) */}
            <section className="bg-white text-black py-32 px-6">
                <div className="max-w-7xl mx-auto flex flex-col items-center text-center gap-12">
                    <h2 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter">
                        Digital Partner for<br />Premium Venues.
                    </h2>
                    <p className="text-xl max-w-3xl font-thin uppercase tracking-tight">
                        VŌLTA è molto più di una serata. È una piattaforma tecnologica di gestione clubbing sviluppata da Marco Finocchio per connettere i locali all&apos;elite del pubblico.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-8">
                        <div className="border border-black p-8 flex flex-col gap-4 items-center">
                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold">01</div>
                            <h3 className="font-bold uppercase tracking-tighter">Event Management</h3>
                            <p className="text-sm font-thin">Ottimizzazione dei flussi e gestione liste nomi in tempo reale.</p>
                        </div>
                        <div className="border border-black p-8 flex flex-col gap-4 items-center">
                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold">02</div>
                            <h3 className="font-bold uppercase tracking-tighter">Venue Dashboard</h3>
                            <p className="text-sm font-thin">Accesso ai dati e monitoraggio check-in tramite QR Code.</p>
                        </div>
                        <div className="border border-black p-8 flex flex-col gap-4 items-center">
                            <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold">03</div>
                            <h3 className="font-bold uppercase tracking-tighter">B2B Solutions</h3>
                            <p className="text-sm font-thin">Consulenza strategica per club che puntano al top.</p>
                        </div>
                    </div>
                    <Link href="/about#partner" className="brutalist-button bg-black text-white border-black mt-8 hover:bg-gold hover:text-black">
                        Collabora con noi
                    </Link>
                </div>
            </section>

            {/* New Section: Vibe Teaser (Gallery Preview) */}
            <section className="py-32 px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto flex flex-col gap-12">
                    <div className="flex justify-between items-end">
                        <h2 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter">Vibe Teaser</h2>
                        <Link href="/gallery" className="text-gold/60 font-bold uppercase tracking-widest text-xs hover:text-gold">
                            Vedi Galleria <ArrowRight className="inline ml-1" size={14} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[400px]">
                        <div className="relative brutalist-border overflow-hidden">
                            <Image src="/assets/DSC_0036.JPG" alt="Vibe 1" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                            <div className="absolute inset-0 bg-gold mix-blend-color opacity-20 z-10" />
                        </div>
                        <div className="relative brutalist-border overflow-hidden md:mt-12">
                            <Image src="/assets/DSC_0075.JPG" alt="Vibe 2" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                            <div className="absolute inset-0 bg-gold mix-blend-color opacity-20 z-10" />
                        </div>
                        <div className="relative brutalist-border overflow-hidden">
                            <Image src="/assets/DSC_0175.JPG" alt="Vibe 3" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                            <div className="absolute inset-0 bg-gold mix-blend-color opacity-20 z-10" />
                        </div>
                        <div className="relative brutalist-border overflow-hidden md:mt-12">
                            <Image src="/assets/DSC_0467.JPG" alt="Vibe 4" fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                            <div className="absolute inset-0 bg-gold mix-blend-color opacity-20 z-10" />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
