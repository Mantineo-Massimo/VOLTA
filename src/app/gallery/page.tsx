"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const galleryItems = [
    { id: 1, type: "image", src: "/assets/DSC_0036.JPG", span: "row-span-2 col-span-2" },
    { id: 2, type: "image", src: "/assets/DSC_0075.JPG", span: "row-span-1 col-span-1" },
    { id: 3, type: "image", src: "/assets/DSC_0175.JPG", span: "row-span-1 col-span-1" },
    { id: 4, type: "video", src: "/assets/DSC_0395.JPG", span: "row-span-2 col-span-1" }, // Using image as placeholder for video
    { id: 5, type: "image", src: "/assets/DSC_0467.JPG", span: "row-span-1 col-span-2" },
];

export default function Gallery() {
    return (
        <div className="pt-32 pb-24 px-6 bg-black min-h-screen">
            <div className="max-w-7xl mx-auto flex flex-col gap-12">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="flex flex-col gap-4 text-center md:text-left"
                >
                    <span className="text-gold uppercase tracking-widest font-bold">Visual Experience</span>
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter uppercase">Galleria</h1>
                </motion.div>

                {/* Brutalist Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[300px]">
                    {galleryItems.map((item) => (
                        <motion.div
                            key={item.id}
                            whileHover={{ scale: 0.98 }}
                            className={`relative brutalist-border overflow-hidden bg-white/5 ${item.span}`}
                        >
                            <Image
                                src={item.src}
                                alt={`VŌLTA Moment ${item.id}`}
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                            />
                            {item.type === "video" && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <div className="w-12 h-12 border-2 border-white rounded-full flex items-center justify-center">
                                        <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Video Recap Section */}
                <div className="mt-24 border-t-4 border-gold pt-12 flex flex-col gap-8">
                    <h2 className="text-3xl font-bold uppercase tracking-tighter">Video Recap (TikTok Style)</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="aspect-[9/16] bg-white/5 brutalist-border relative flex items-center justify-center group overflow-hidden">
                                <Image
                                    src={`/assets/claim${i}rig.png`}
                                    alt="Recap"
                                    fill
                                    className="object-cover opacity-30 group-hover:opacity-100 transition-opacity"
                                />
                                <span className="z-10 font-bold uppercase tracking-widest border border-white px-4 py-2 bg-black group-hover:bg-gold group-hover:text-black transition-colors">
                                    Guarda Reel {i}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
