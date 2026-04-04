"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const sections = [
    {
        title: "Il Concept",
        id: "concept",
        content: "VŌLTA non è solo un club. È un'esperienza sensoriale dove l'esclusività incontra il ritmo. Curiamo ogni dettaglio, dalla selezione musicale all'atmosfera, per garantire che ogni notte sia la VŌLTA della tua vita.",
        image: "/assets/DSC_0036.JPG"
    },
    {
        title: "Digital Partner",
        id: "partner",
        content: "Sotto la guida tecnologica di Marco Finocchio (P.IVA 03836020838), VŌLTA opera come una piattaforma digitale d'avanguardia. Connettiamo l'elite del clubbing con i migliori locali d'Italia attraverso soluzioni di gestione eventi e hospitality digitale.",
        image: "/assets/DSC_0175.JPG"
    },
    {
        title: "Collabora con noi",
        id: "collaborate",
        content: "Sei il proprietario di un club che punta all'eccellenza? Entra nel circuito VŌLTA per elevare il tuo brand e digitalizzare l'esperienza dei tuoi ospiti.",
        image: "/assets/DSC_0467.JPG"
    }
];

export default function About() {
    return (
        <div className="pt-32 pb-24 px-6 bg-black min-h-screen">
            <div className="max-w-7xl mx-auto flex flex-col gap-32">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-4"
                >
                    <span className="text-gold uppercase tracking-widest font-bold">Brand & Vision</span>
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter uppercase whitespace-pre-line">
                        Più di un evento,{"\n"}un movimento.
                    </h1>
                </motion.div>

                {/* Sections */}
                {sections.map((section, index) => (
                    <motion.section
                        key={section.id}
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className={`flex flex-col md:flex-row gap-12 items-center ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
                    >
                        <div className="flex-1 flex flex-col gap-6">
                            <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tight">{section.title}</h2>
                            <p className="text-lg md:text-xl text-white/70 leading-relaxed font-thin">
                                {section.content}
                            </p>
                            {section.id === 'collaborate' && (
                                <div className="mt-4">
                                    <button className="brutalist-button">Richiedi Consulenza</button>
                                </div>
                            )}
                        </div>
                        <div className="flex-1 w-full aspect-[4/3] relative brutalist-border overflow-hidden">
                            <Image
                                src={section.image}
                                alt={section.title}
                                fill
                                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
                            />
                        </div>
                    </motion.section>
                ))}
            </div>
        </div>
    );
}
