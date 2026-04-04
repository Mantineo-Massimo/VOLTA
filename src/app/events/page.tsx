"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Calendar, MapPin, Music, X, ArrowRight, Info, CheckCircle2, Lock, User, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const activeEvents = [
    {
        id: 1,
        title: "VŌLTA PREMIERE",
        date: "Sabato, 4 Aprile",
        time: "23:00 - 05:00",
        location: "Messina",
        venue: "Teatro Metropolitan",
        dj: "CLARK",
        image: "/assets/DSC_0036.JPG",
        status: "Sold Out",
        genre: "INDUSTRIAL / TECHNO",
        dresscode: true,
        entryType: "INVITE ONLY",
        price: "Entry by Reservation",
        desc: "Il lancio ufficiale della stagione. Un'esperienza immersiva di suoni e luci progettata per colpire i sensi.",
        regLimit: 250,
        regs: 250
    },
    {
        id: 2,
        title: "TECHNO CLASH",
        date: "Venerdì, 10 Aprile",
        time: "22:30 - Late",
        location: "Taormina",
        venue: "Secret Garden",
        dj: "KØDE",
        image: "/assets/DSC_0175.JPG",
        status: "Low Availability",
        genre: "PURE TECHNO / HARD",
        dresscode: false,
        entryType: "DOOR TAX",
        price: "Member Exclusive",
        desc: "Un viaggio sonoro nelle sonorità più industriali e pure del clubbing. Niente compromessi, solo ritmo.",
        regLimit: 300,
        regs: 245
    },
    {
        id: 3,
        title: "SUNSET VIBE",
        date: "Domenica, 12 Aprile",
        time: "18:00 - 00:00",
        location: "Milazzo",
        venue: "Beach Club",
        dj: "MARK",
        image: "/assets/DSC_0467.JPG",
        status: "Upcoming",
        genre: "DEEP HOUSE / AFRO",
        dresscode: true,
        entryType: "WEB LIST",
        price: "Cocktail & Entry",
        desc: "Il primo evento pomeridiano della stagione. Aperitivo tech-house e ritmi profondi fronte mare.",
        regLimit: 150,
        regs: 42
    }
];

export default function Events() {
    const [selectedEvent, setSelectedEvent] = useState<typeof activeEvents[0] | null>(null);
    const [isRegistered, setIsRegistered] = useState(false);
    // Mock login state for demonstration
    const [isLoggedIn] = useState(false);

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        setIsRegistered(true);
        setTimeout(() => {
            setIsRegistered(false);
            setSelectedEvent(null);
        }, 3000);
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
                        <p className="text-xs uppercase font-bold tracking-widest text-white/60 leading-relaxed text-justify">
                            L'accesso agli eventi VŌLTA è strettamente su prenotazione. La registrazione online non garantisce l'accesso prioritario.
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
                            className="group relative flex flex-col bg-white/5 rounded-3xl overflow-hidden border border-white/5 hover:border-gold/30 transition-all duration-500 cursor-pointer"
                            onClick={() => setSelectedEvent(event)}
                        >
                            {/* Card Image */}
                            <div className="aspect-[4/5] relative overflow-hidden">
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
                                    <div className="flex items-center gap-4 text-gold uppercase text-[9px] font-bold tracking-[0.2em]">
                                        <span>{event.date}</span>
                                        <div className="w-1 h-1 rounded-full bg-gold/30" />
                                        <span>{event.location}</span>
                                    </div>
                                    <h2 className="text-3xl font-bold uppercase tracking-tighter italic group-hover:text-gold transition-colors">{event.title}</h2>
                                    <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{event.genre}</p>
                                </div>

                                <div className="space-y-4 text-white/40 text-[10px] font-bold uppercase tracking-widest border-t border-white/5 pt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <MapPin size={12} className="text-gold" />
                                            <span>{event.venue}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Clock size={12} className="text-gold" />
                                            <span>{event.time.split(' - ')[0]}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-white/80">
                                            <Music size={12} className="text-gold" />
                                            <span>{event.dj}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {event.dresscode && <span className="border border-white/10 px-2 py-0.5 text-[8px]">DRESSCODE</span>}
                                        </div>
                                    </div>
                                </div>

                                <button className="w-full mt-auto py-4 border border-white/10 uppercase text-[10px] font-bold tracking-[0.3em] group-hover:bg-white group-hover:text-black transition-all duration-500">
                                    Dettagli Evento
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

            {/* Registration & Specs Modal */}
            <AnimatePresence>
                {selectedEvent && (
                    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedEvent(null)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-2xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 40 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 40 }}
                            className="relative w-full max-w-4xl bg-zinc-900/50 rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-black transition-all"
                            >
                                <X size={20} />
                            </button>

                            {/* Left: Stats & Specs */}
                            <div className="flex-1 p-8 md:p-12 space-y-12 overflow-y-auto border-b md:border-b-0 md:border-r border-white/10">
                                <div className="space-y-4">
                                    <span className="text-gold uppercase text-[10px] font-bold tracking-[0.5em] block">{selectedEvent.status}</span>
                                    <h3 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none italic">
                                        {selectedEvent.title}
                                    </h3>
                                    <p className="text-white/60 text-sm font-thin uppercase leading-relaxed max-w-sm">
                                        {selectedEvent.desc}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-8 text-left">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Master Artist</p>
                                        <p className="text-sm font-bold uppercase text-gold">{selectedEvent.dj}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Sonic Genre</p>
                                        <p className="text-sm font-bold uppercase text-white">{selectedEvent.genre}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Dress Code</p>
                                        <p className="text-sm font-bold uppercase text-white">{selectedEvent.dresscode ? "REQUIRED" : "NOT REQUIRED"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Entry Access</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold uppercase text-white">{selectedEvent.entryType || selectedEvent.price}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Availability</p>
                                        <div className="flex flex-col gap-1">
                                            <div className="h-1.5 w-full bg-white/5 overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-1000 ${selectedEvent.regs >= selectedEvent.regLimit ? 'bg-red-500' : 'bg-gold'}`}
                                                    style={{ width: `${Math.min(100, (selectedEvent.regs / selectedEvent.regLimit) * 100)}%` }}
                                                />
                                            </div>
                                            <p className="text-[9px] font-bold text-white/40 uppercase">{selectedEvent.regs} / {selectedEvent.regLimit} REGISTERED</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 pt-8 border-t border-white/5">
                                    <div className="flex items-center gap-4">
                                        <Calendar className="text-gold" size={16} />
                                        <span className="text-xs font-bold uppercase tracking-[0.2em]">{selectedEvent.date}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Clock className="text-gold" size={16} />
                                        <span className="text-xs font-bold uppercase tracking-[0.2em] font-mono">{selectedEvent.time}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <MapPin className="text-gold" size={16} />
                                        <span className="text-xs font-bold uppercase tracking-[0.2em]">{selectedEvent.venue}, {selectedEvent.location}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Auth Gate & Registration */}
                            <div className="w-full md:w-[40%] bg-black/40 p-8 md:p-12 flex flex-col justify-center">
                                {!isRegistered ? (
                                    <>
                                        {!isLoggedIn ? (
                                            <div className="space-y-8 text-center animate-in fade-in zoom-in duration-500">
                                                <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                                                    <Lock size={32} className="text-gold" />
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="text-xl font-bold uppercase">Accesso Richiesto</h4>
                                                    <p className="text-[10px] font-bold uppercase text-white/40 tracking-widest leading-relaxed">
                                                        Per riservare un posto devi essere un membro della community VŌLTA.
                                                    </p>
                                                </div>
                                                <div className="space-y-4 pt-4">
                                                    <Link
                                                        href="/account"
                                                        className="block w-full bg-white text-black p-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-gold transition-all"
                                                    >
                                                        Accedi ora
                                                    </Link>
                                                    <Link
                                                        href="/account?mode=signup"
                                                        className="block w-full border border-white/10 p-5 rounded-2xl font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all"
                                                    >
                                                        Crea Account
                                                    </Link>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-8 animate-in slide-in-from-right duration-500">
                                                <div className="flex items-center gap-3 mb-8">
                                                    <User size={16} className="text-gold" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">Prenota come Member</span>
                                                </div>
                                                <form onSubmit={handleRegister} className="space-y-4">
                                                    <div className="space-y-4 text-xs font-bold uppercase tracking-widest">
                                                        <input required placeholder="Telefono" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-gold transition-colors" />
                                                        <div className="p-4 rounded-2xl bg-gold/5 border border-gold/10 text-[9px] text-gold/80 leading-relaxed uppercase">
                                                            I tuoi dati (Nome ed Email) verranno estratti automaticamente dal tuo profilo VŌLTA.
                                                        </div>
                                                    </div>
                                                    <button className="w-full bg-gold text-black p-5 rounded-2xl font-bold uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all">
                                                        Conferma Prenotazione
                                                    </button>
                                                </form>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center text-center gap-6"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-gold text-black flex items-center justify-center shadow-[0_0_50px_rgba(255,184,0,0.3)]">
                                            <CheckCircle2 size={40} />
                                        </div>
                                        <h4 className="text-2xl font-bold uppercase tracking-tighter">Prenotato!</h4>
                                        <p className="text-[10px] font-bold uppercase text-white/40 tracking-widest leading-relaxed">
                                            Riceverai una conferma digitale a breve.
                                        </p>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
