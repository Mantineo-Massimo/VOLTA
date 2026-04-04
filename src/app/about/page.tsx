"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { ArrowRight, Code, Users, Zap } from "lucide-react";

const sections = [
    {
        title: "Il Concept",
        subtitle: "L'Anima di VŌLTA",
        id: "concept",
        content: "VŌLTA non è solo un club. È un'esperienza sensoriale dove l'esclusività incontra il ritmo. Curiamo ogni dettaglio, dalla selezione musicale all'atmosfera, per garantire che ogni notte sia la VŌLTA della tua vita.",
        image: "/assets/DSC_0036.JPG",
        icon: <Zap className="text-gold" size={24} />
    },
    {
        title: "Digital Partner",
        subtitle: "Il Motore Tecnologico",
        id: "partner",
        content: "Sotto la guida tecnologica di Marco Finocchio (P.IVA 03836020838), VŌLTA opera come una piattaforma digitale d'avanguardia. Connettiamo l'elite del clubbing con i migliori locali d'Italia attraverso soluzioni di gestione eventi e hospitality digitale.",
        image: "/assets/DSC_0175.JPG",
        icon: <Code className="text-gold" size={24} />
    },
    {
        title: "Collabora",
        subtitle: "Unisciti alla Visione",
        id: "collaborate",
        content: "Sei il proprietario di un club che punta all'eccellenza? Entra nel circuito VŌLTA per elevare il tuo brand e digitalizzare l'esperienza dei tuoi ospiti.",
        image: "/assets/DSC_0467.JPG",
        icon: <Users className="text-gold" size={24} />
    }
];

export default function About() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <div ref={containerRef} className="bg-black min-h-screen text-white">
            {/* Immersive Hero Section */}
            <section className="h-screen flex items-center justify-center relative overflow-hidden px-6">
                <motion.div
                    style={{ y: useTransform(scrollYProgress, [0, 0.2], [0, -100]) }}
                    className="z-10 text-center space-y-6"
                >
                    <motion.span
                        initial={{ opacity: 0, tracking: "0.5em" }}
                        animate={{ opacity: 1, tracking: "1em" }}
                        className="text-gold uppercase text-[10px] md:text-xs font-bold block"
                    >
                        VŌLTA / STORY
                    </motion.span>
                    <h1 className="text-6xl md:text-[10rem] font-bold uppercase tracking-tighter leading-none">
                        Il Cuore<br />del Clubbing.
                    </h1>
                </motion.div>

                {/* Background Parallax Image */}
                <motion.div
                    style={{
                        scale: useTransform(scrollYProgress, [0, 0.5], [1, 1.2]),
                        opacity: useTransform(scrollYProgress, [0, 0.3], [0.4, 0])
                    }}
                    className="absolute inset-0 z-0"
                >
                    <Image
                        src="/assets/DSC_0036.JPG"
                        alt="Background"
                        fill
                        className="object-cover grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/40 to-black" />
                </motion.div>
            </section>

            {/* Narrative Sections */}
            <div className="max-w-7xl mx-auto px-6 py-24 space-y-64">
                {sections.map((section, index) => (
                    <div key={section.id} className={`flex flex-col lg:flex-row gap-16 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="flex-1 space-y-8"
                        >
                            <div className="flex items-center gap-4">
                                {section.icon}
                                <span className="text-gold font-bold uppercase text-xs tracking-widest">{section.subtitle}</span>
                            </div>
                            <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none italic">{section.title}</h2>
                            <p className="text-xl md:text-2xl font-thin text-white/60 leading-relaxed uppercase">
                                {section.content}
                            </p>
                            {section.id === 'collaborate' && (
                                <button className="group mt-8 flex items-center gap-4 bg-white text-black px-8 py-4 rounded-full font-bold uppercase text-sm hover:bg-gold transition-colors">
                                    Richiedi Consulenza <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                                </button>
                            )}
                        </motion.div>

                        {/* Image Parallax Container */}
                        <div className="flex-1 w-full aspect-square md:aspect-[4/5] relative rounded-3xl overflow-hidden shadow-2xl group">
                            <motion.div
                                initial={{ scale: 1.2 }}
                                whileInView={{ scale: 1 }}
                                transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
                                className="w-full h-full"
                            >
                                <Image
                                    src={section.image}
                                    alt={section.title}
                                    fill
                                    className="object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-gold mix-blend-color opacity-30 z-10 group-hover:opacity-10 transition-opacity" />
                            </motion.div>
                        </div>
                    </div>
                ))}

                {/* Modern Quote / Closing Section */}
                <motion.section
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="py-32 border-y border-white/10 text-center space-y-12"
                >
                    <p className="text-2xl md:text-5xl font-thin uppercase tracking-tight max-w-4xl mx-auto leading-tight italic">
                        &quot;VŌLTA è il punto di rottura tra la notte tradizionale e il <span className="text-gold font-bold not-italic">futuro digitale</span> del divertimento.&quot;
                    </p>
                    <div className="flex flex-col md:flex-row justify-center items-center gap-8 text-[10px] uppercase font-bold tracking-[0.5em] text-white/40">
                        <span>Messina</span>
                        <div className="w-2 h-2 rounded-full bg-gold" />
                        <span>Milano</span>
                        <div className="w-2 h-2 rounded-full bg-gold" />
                        <span>Ibiza</span>
                    </div>
                </motion.section>
            </div>
        </div>
    );
}
