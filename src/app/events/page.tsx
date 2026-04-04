"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Calendar, MapPin, Music, X, ArrowRight, Info, CheckCircle2 } from "lucide-react";
import Image from "next/image";

const activeEvents = [
    {
        id: 1,
        title: "VŌLTA PREMIERE",
        date: "Sabato, 4 Aprile",
        time: "23:00 - 05:00",
        location: "Messina",
        venue: "Teatro Metropolitan",
        dj: "Special Guest DJ",
        image: "/assets/DSC_0036.JPG",
        status: "Low Availability",
        desc: "Il lancio ufficiale della stagione. Un'esperienza immersiva di suoni e luci."
    },
    {
        id: 2,
        title: "TECHNO CLASH",
        date: "Venerdì, 10 Aprile",
        time: "22:30 - Late",
        location: "Taormina",
        venue: "Secret Garden",
        dj: "VŌLTA Residents",
        image: "/assets/DSC_0175.JPG",
        status: "Selling Fast",
        desc: "Un viaggio sonoro nelle sonorità più industriali e pure del clubbing."
    },
    {
        id: 3,
        title: "SUNSET VIBE",
        date: "Domenica, 12 Aprile",
        time: "18:00 - 00:00",
        location: "Milazzo",
        venue: "Beach Club",
        dj: "Deep House Session",
        image: "/assets/DSC_0467.JPG",
        status: "Upcoming",
        desc: "Il primo evento pomeridiano della stagione. Aperitivo e ritmi profondi."
    }
];

export default function Events() {
    const [selectedEvent, setSelectedEvent] = useState<typeof activeEvents[0] | null>(null);
    const [isRegistered, setIsRegistered] = useState(false);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setIsRegistered(true);
        setTimeout(() => {
            setIsRegistered(false);
            setSelectedEvent(null);
        }, 2000);
    };

    return (
        <div className="bg-black min-h-screen text-white pt-32 pb-24 px-6">
            <div className="max-w-7xl mx-auto space-y-24">

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-white/10 pb-12"
                >
                    <div className="space-y-4">
                        <span className="text-gold font-bold uppercase text-xs tracking-[0.5em]">Current Tour</span>
                        <h1 className="text-6xl md:text-8xl font-bold uppercase tracking-tighter leading-none italic">
                            Eventi<br />Imminenti.
                        </h1>
                    </div>
                    <div className="max-w-xs space-y-4 text-right md:text-left">
                        <div className="flex items-center gap-2 text-white/40 md:justify-end">
                            <Info size={14} />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Informazioni</span>
                        </div>
                        <p className="text-xs uppercase font-bold tracking-widest text-white/60 leading-relaxed">
                            L'accesso agli eventi VŌLTA è strettamente su prenotazione. La registrazione online garantisce l'accesso prioritario.
                        </p>
                    </div>
                </motion.div>

                {/* Event Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {activeEvents.map((event, i) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="group relative flex flex-col bg-white/5 rounded-3xl overflow-hidden border border-white/5 hover:border-gold/30 transition-all duration-500"
                        >
                            {/* Card Image */}
                            <div className="aspect-[4/3] relative overflow-hidden">
                                <Image
                                    src={event.image}
                                    alt={event.title}
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-gold text-black text-[10px] font-bold uppercase px-3 py-1 rounded-full shadow-xl">
                                        {event.status}
                                    </span>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-8 flex flex-col flex-grow gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-4 text-gold uppercase text-[10px] font-bold tracking-widest">
                                        <span>{event.date}</span>
                                        <div className="w-1 h-1 rounded-full bg-white/20" />
                                        <span>{event.location}</span>
                                    </div>
                                    <h2 className="text-3xl font-bold uppercase tracking-tighter italic">{event.title}</h2>
                                </div>

                                <div className="space-y-3 text-white/40 text-xs font-bold uppercase tracking-widest">
                                    <div className="flex items-center gap-3">
                                        <MapPin size={14} className="text-gold" />
                                        <span>{event.venue}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Music size={14} className="text-gold" />
                                        <span>{event.dj}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedEvent(event)}
                                    className="mt-auto group/btn flex items-center justify-between bg-white text-black p-4 rounded-2xl font-bold uppercase text-xs hover:bg-gold transition-all"
                                >
                                    Riserva Posto <ArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-center text-[10px] uppercase font-bold tracking-[0.5em] text-white/20 pt-12 border-t border-white/5"
                >
                    Importante: Il pagamento della quota associativa avviene esclusivamente presso la cassa del locale.
                </motion.p>
            </div>

            {/* Registration Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedEvent(null)}
                            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-lg bg-zinc-900 rounded-[2.5rem] border border-white/10 overflow-hidden"
                        >
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                            >
                                <X size={20} />
                            </button>

                            {!isRegistered ? (
                                <div className="p-8 md:p-12 space-y-8">
                                    <div className="space-y-4">
                                        <span className="text-gold uppercase text-[10px] font-bold tracking-widest">{selectedEvent.venue} — {selectedEvent.location}</span>
                                        <h3 className="text-4xl font-bold uppercase tracking-tighter leading-none italic">
                                            {selectedEvent.title}
                                        </h3>
                                        <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-white/40">
                                            <span>{selectedEvent.date}</span>
                                            <span>{selectedEvent.time}</span>
                                        </div>
                                    </div>

                                    <form onSubmit={handleRegister} className="space-y-4">
                                        <div className="space-y-4">
                                            <input
                                                required
                                                type="text"
                                                placeholder="NOME E COGNOME"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-gold transition-colors"
                                            />
                                            <input
                                                required
                                                type="email"
                                                placeholder="EMAIL"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-gold transition-colors"
                                            />
                                        </div>
                                        <label className="flex items-start gap-3 cursor-pointer group">
                                            <input required type="checkbox" className="mt-1 accent-gold" />
                                            <span className="text-[9px] uppercase font-bold tracking-widest text-white/40 leading-relaxed group-hover:text-white/60 transition-colors">
                                                Accetto i termini, la GDPR policy e confermo di aver compreso che il pagamento avverrà al locale.
                                            </span>
                                        </label>
                                        <button className="w-full bg-gold text-black p-5 rounded-2xl font-bold uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all">
                                            Invia Registrazione
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-12 flex flex-col items-center text-center gap-6"
                                >
                                    <div className="w-20 h-20 rounded-full bg-gold text-black flex items-center justify-center shadow-[0_0_50px_rgba(255,184,0,0.3)]">
                                        <CheckCircle2 size={40} />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-2xl font-bold uppercase tracking-tighter">Registrazione Inviata</h4>
                                        <p className="text-xs font-bold uppercase text-white/40 tracking-widest leading-relaxed">
                                            Un'email di conferma è stata inviata al tuo indirizzo.<br />Ci vediamo al VŌLTA.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
