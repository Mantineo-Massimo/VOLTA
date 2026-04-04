"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Play, Maximize2, ExternalLink } from "lucide-react";

const galleryItems = [
    { id: 1, src: "/assets/DSC_0036.JPG", span: "md:col-span-2 md:row-span-2", category: "Life" },
    { id: 2, src: "/assets/DSC_0075.JPG", span: "col-span-1 row-span-1", category: "Vibe" },
    { id: 3, src: "/assets/DSC_0175.JPG", span: "col-span-1 row-span-1", category: "People" },
    { id: 4, src: "/assets/DSC_0395.JPG", span: "md:col-span-1 md:row-span-2 shadow-[20px_20px_0_rgba(255,184,0,0.1)]", category: "Sonic" },
    { id: 5, src: "/assets/DSC_0467.JPG", span: "md:col-span-2 md:row-span-1", category: "Nexus" },
];

export default function Gallery() {
    return (
        <div className="pt-32 pb-24 px-6 bg-black min-h-screen text-white">
            <div className="max-w-7xl mx-auto flex flex-col gap-24">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/10 pb-16"
                >
                    <div className="space-y-4">
                        <span className="text-gold font-bold uppercase text-xs tracking-[0.5em]">Visual Archive</span>
                        <h1 className="text-6xl md:text-9xl font-bold uppercase tracking-tighter leading-none italic">
                            Momenti<br /><span className="text-white/20">VŌLTA.</span>
                        </h1>
                    </div>
                    <div className="max-w-xs space-y-4 text-right">
                        <div className="flex items-center gap-2 text-white/40 justify-end">
                            <Maximize2 size={14} />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Immersive View</span>
                        </div>
                        <p className="text-xs uppercase font-bold tracking-widest text-white/60 leading-relaxed text-justify">
                            Documentazione visiva dell'esperienza clubbing firmata VŌLTA. Dove il suono incontra la materia e l'identità si dissolve nell'ombra.
                        </p>
                    </div>
                </motion.div>

                {/* Brutalist Masonry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-[300px]">
                    {galleryItems.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className={`group relative overflow-hidden bg-zinc-900 border border-white/5 rounded-3xl ${item.span}`}
                        >
                            <Image
                                src={item.src}
                                alt={`VŌLTA Experience ${item.id}`}
                                fill
                                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                            />

                            {/* Overlay info */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold text-gold uppercase tracking-[0.3em]">Concept</p>
                                        <h3 className="text-2xl font-bold uppercase italic tracking-tighter">{item.category}</h3>
                                    </div>
                                    <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">
                                        <Maximize2 size={16} />
                                    </div>
                                </div>
                            </div>

                            {/* Brutalist number tag */}
                            <div className="absolute top-6 left-6 z-10">
                                <span className="bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-mono px-3 py-1 rounded-full text-white/40">
                                    EXP_{item.id.toString().padStart(2, '0')}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Reels Recap Section */}
                <div className="space-y-12">
                    <div className="flex items-center gap-6">
                        <h2 className="text-2xl font-extrabold uppercase tracking-[0.2em] italic">Digital Recap</h2>
                        <div className="h-[1px] flex-grow bg-white/10" />
                        <ExternalLink size={20} className="text-gold cursor-pointer" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10 }}
                                className="relative aspect-[9/16] rounded-[2.5rem] overflow-hidden border border-white/5 group bg-zinc-900"
                            >
                                <Image
                                    src={`/assets/claim${i}rig.png`}
                                    alt="Recap"
                                    fill
                                    className="object-cover opacity-40 group-hover:opacity-80 transition-all duration-700 grayscale group-hover:grayscale-0"
                                />

                                {/* Video Interaction UI */}
                                <div className="absolute inset-0 flex flex-col justify-between p-10">
                                    <div className="flex justify-between items-start">
                                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Recap_{i}</span>
                                    </div>

                                    <div className="flex flex-col items-center gap-6">
                                        <motion.div
                                            whileHover={{ scale: 1.1 }}
                                            className="w-20 h-20 rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all"
                                        >
                                            <Play size={24} className="group-hover:text-black ml-1 fill-current" />
                                        </motion.div>
                                        <span className="text-[10px] font-extrabold uppercase tracking-[0.5em] text-white/60">Watch Reel</span>
                                    </div>

                                    <div className="space-y-2 text-center">
                                        <h4 className="text-lg font-bold uppercase italic tracking-tighter">VŌLTA #00{i}</h4>
                                        <div className="flex gap-2 justify-center">
                                            <div className="w-8 h-[1px] bg-gold" />
                                            <div className="w-2 h-[1px] bg-white/20" />
                                            <div className="w-2 h-[1px] bg-white/20" />
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none" />
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Final Quote */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-center py-24 border-t border-white/5"
                >
                    <p className="text-[10px] md:text-sm uppercase font-bold tracking-[1em] text-white/10 leading-loose">
                        L'estetica è l'unica morale <br /> che ci è rimasta. VŌLTA Archive © 2024
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
