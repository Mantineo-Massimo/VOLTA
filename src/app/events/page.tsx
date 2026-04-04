"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Music } from "lucide-react";

const activeEvents = [
    {
        id: 1,
        title: "VŌLTA PREMIERE",
        date: "Stasera, 4 Aprile",
        location: "Teatro Metropolitan, Messina",
        dj: "Special Guest DJ",
        desc: "Il lancio ufficiale della stagione. Un'esperienza immersiva di suoni e luci."
    },
    {
        id: 2,
        title: "TECHNO BRUTALISM",
        date: "Venerdì, 10 Aprile",
        location: "The Bunker, Catania",
        dj: "Local Talents",
        desc: "Un viaggio sonoro nelle sonorità più industriali e pure del clubbing."
    }
];

export default function Events() {
    return (
        <div className="pt-32 pb-24 px-6 bg-black min-h-screen">
            <div className="max-w-7xl mx-auto flex flex-col gap-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    className="flex flex-col gap-4 border-l-4 border-neon pl-6"
                >
                    <span className="text-neon uppercase tracking-widest font-bold">Calendario Settimanale</span>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase">Il Core Business</h1>
                    <p className="text-xs text-white/40 uppercase tracking-widest">
                        Nota Fiscale: Il pagamento avviene esclusivamente al locale al momento dell'ingresso.
                    </p>
                </motion.div>

                {/* Event List */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
                    {activeEvents.map((event) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="brutalist-card flex flex-col gap-6"
                        >
                            <div className="flex justify-between items-start">
                                <h2 className="text-3xl font-bold uppercase">{event.title}</h2>
                                <span className="bg-neon text-black px-3 py-1 font-bold text-xs uppercase tracking-tighter">
                                    Sold Out Near
                                </span>
                            </div>

                            <div className="flex flex-col gap-3 text-white/70">
                                <div className="flex items-center gap-3">
                                    <Calendar size={18} className="text-neon" />
                                    <span className="uppercase text-sm">{event.date}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <MapPin size={18} className="text-neon" />
                                    <span className="uppercase text-sm">{event.location}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Music size={18} className="text-neon" />
                                    <span className="uppercase text-sm">{event.dj}</span>
                                </div>
                            </div>

                            <p className="font-thin text-white/80 border-t border-white/10 pt-4">
                                {event.desc}
                            </p>

                            {/* In-page Registration Form */}
                            <form className="flex flex-col gap-4 mt-4 bg-white/5 p-6 brutalist-border">
                                <h3 className="text-lg font-bold uppercase tracking-tighter">Registrazione Rapida</h3>
                                <input
                                    type="text"
                                    placeholder="Nome e Cognome"
                                    className="bg-transparent border border-white/20 p-2 text-sm focus:border-neon outline-none"
                                />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="bg-transparent border border-white/20 p-2 text-sm focus:border-neon outline-none"
                                />
                                <label className="flex items-start gap-2 text-[10px] text-white/50 uppercase cursor-pointer">
                                    <input type="checkbox" className="mt-1" />
                                    <span>Accetto i termini e condizioni e la GDPR Policy. Il pagamento avverrà al locale.</span>
                                </label>
                                <button className="brutalist-button w-full mt-2">
                                    Riserva il tuo posto
                                </button>
                            </form>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
