"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Music, X, ArrowRight, Info, CheckCircle2, Lock, User, Clock } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import Link from "next/link";

export default function Events() {
    const supabase = createClient();
    const [user, setUser] = useState<any>(null);
    const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");
    const [activeEvents, setActiveEvents] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
    const [isRegistered, setIsRegistered] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const isLoggedIn = status === "authenticated";

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
                setStatus("authenticated");
            } else {
                setStatus("unauthenticated");
            }
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setUser(session.user);
                setStatus("authenticated");
            } else {
                setUser(null);
                setStatus("unauthenticated");
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchEvents = async () => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: true });

            if (data) setActiveEvents(data);
            if (error) throw error;
        } catch (err) {
            console.error("Failed to fetch events");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            // 1. Insert registration
            const { error: regError } = await supabase
                .from('registrations')
                .insert([
                    { user_id: user.id, event_id: selectedEvent.id }
                ]);

            if (regError) {
                if (regError.code === '23505') {
                    alert("Sei già registrato a questo evento.");
                } else {
                    throw regError;
                }
                return;
            }

            // 2. Increment regs_count in events table
            // In a real app, this should be done via a Postgres Trigger or an RPC to be atomic.
            // For now, I'll do a simple increment.
            const { error: updateError } = await supabase
                .from('events')
                .update({ regs_count: (selectedEvent.regs_count || 0) + 1 })
                .eq('id', selectedEvent.id);

            if (updateError) throw updateError;

            setIsRegistered(true);
            await fetchEvents(); // Refresh data

            setTimeout(() => {
                setIsRegistered(false);
                setSelectedEvent(null);
            }, 3000);
        } catch (err: any) {
            console.error("Registration failed:", err);
            alert("Errore durante la registrazione: " + (err.message || "Unknown error"));
        }
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse rounded-3xl" />
                        ))
                    ) : activeEvents.length > 0 ? (
                        activeEvents.map((event, i) => {
                            const isFull = (event.regs_count || 0) >= (event.reg_limit || 0);

                            let statusLabel = "Upcoming";
                            let statusColor = "bg-gold text-black";

                            if (event.sold_out_type && event.sold_out_type !== 'NONE') {
                                statusLabel = `SOLD OUT ${event.sold_out_type}`;
                                statusColor = "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]";
                            } else if (event.is_sold_out || isFull) {
                                statusLabel = "Sold Out";
                                statusColor = "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]";
                            } else if (((event.regs_count || 0) / (event.reg_limit || 1) > 0.8)) {
                                statusLabel = "Low Availability";
                                statusColor = "bg-orange-500 text-white shadow-[0_0_20px_rgba(249,115,22,0.3)]";
                            }

                            return (
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
                                            src={event.image || "/assets/DSC_0036.JPG"}
                                            alt={event.title}
                                            fill
                                            className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                        <div className="absolute top-4 left-4">
                                            <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${statusColor}`}>
                                                {statusLabel}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-8 flex flex-col flex-grow gap-6">
                                        <div className="space-y-2 text-left">
                                            <div className="flex items-center gap-4 text-gold uppercase text-[9px] font-bold tracking-[0.2em]">
                                                <span>{event.date}</span>
                                                <div className="w-1 h-1 rounded-full bg-gold/30" />
                                                <span>{event.location}</span>
                                            </div>
                                            <h2 className="text-3xl font-bold uppercase tracking-tighter italic group-hover:text-gold transition-colors">{event.title}</h2>
                                            <div className="flex items-center gap-4">
                                                <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{event.genre}</p>
                                                <div className="flex items-center gap-2 text-[9px] font-bold text-gold/60">
                                                    <User size={10} />
                                                    <span>{event.regs_count || 0} / {event.reg_limit || 0}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4 text-white/40 text-[10px] font-bold uppercase tracking-widest border-t border-white/5 pt-6 text-left">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <MapPin size={12} className="text-gold" />
                                                    <span>{event.venue}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Clock size={12} className="text-gold" />
                                                    <span>{event.time?.split(' - ')[0]}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 text-white/80">
                                                    <Music size={12} className="text-gold" />
                                                    <span>{event.dj}</span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {event.dresscode && <span className="border border-gold/30 px-2 py-0.5 text-[8px] text-gold font-bold">{event.dresscode.toUpperCase()}</span>}
                                                </div>
                                            </div>
                                        </div>

                                        <button className="w-full mt-auto py-4 border border-white/10 uppercase text-[10px] font-bold tracking-[0.3em] group-hover:bg-white group-hover:text-black transition-all duration-500 rounded-xl">
                                            Dettagli Evento
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-32 flex flex-col items-center justify-center text-center space-y-6 bg-white/[0.02] border border-dashed border-white/10 rounded-[3rem]">
                            <div className="w-20 h-20 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                                <Music size={32} className="text-gold opacity-50" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold uppercase tracking-tighter italic">Nessun Evento Programmato.</h3>
                                <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-white/20">Stiamo preparando la prossima sVŌLTA.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="text-center text-[10px] uppercase font-bold tracking-[0.5em] text-white/20 pt-12 border-t border-white/5"
                >
                    Importante: Il pagamento avviene esclusivamente presso la cassa del locale.
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
                            className="relative w-full max-w-4xl bg-zinc-900/50 rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto shadow-2xl"
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-black transition-all"
                            >
                                <X size={20} />
                            </button>

                            {/* Left: Stats & Specs */}
                            <div className="flex-1 p-10 md:p-14 space-y-12 overflow-y-auto border-b md:border-b-0 md:border-r border-white/10 text-left">
                                <div className="space-y-4">
                                    <span className="text-gold uppercase text-[10px] font-bold tracking-[0.5em] block">
                                        {selectedEvent.is_sold_out ? "Sold Out" : "Limited Access"}
                                    </span>
                                    <h3 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none italic">
                                        {selectedEvent.title}
                                    </h3>
                                    <p className="text-white/60 text-sm font-medium uppercase tracking-wide leading-relaxed max-w-sm italic">
                                        {selectedEvent.description}
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
                                        <p className="text-sm font-bold uppercase text-white">{selectedEvent.dresscode || "NESSUNO"}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">Entry Access</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold uppercase text-white">{selectedEvent.entryType || "MEMBER ONLY"}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1 col-span-2">
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">Availability</p>
                                        <div className="flex flex-col gap-2">
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-1000 ${selectedEvent.regs_count >= (selectedEvent.reg_limit || 0) ? 'bg-red-500' : 'bg-gold'}`}
                                                    style={{ width: `${Math.min(100, ((selectedEvent.regs_count || 0) / (selectedEvent.reg_limit || 1)) * 100)}%` }}
                                                />
                                            </div>
                                            <p className="text-[9px] font-extrabold text-white/40 uppercase tracking-widest">
                                                {selectedEvent.regs_count || 0} / {selectedEvent.reg_limit} REGISTERED GUEST
                                            </p>
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
                            <div className="w-full md:w-[40%] bg-white/[0.02] p-10 md:p-14 flex flex-col justify-center backdrop-blur-xl border-l border-white/5">
                                {!isRegistered ? (
                                    <>
                                        {!isLoggedIn ? (
                                            <div className="space-y-8 text-center animate-in fade-in zoom-in duration-500">
                                                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                                    <Lock size={40} className="text-gold/40" />
                                                </div>
                                                <div className="space-y-3">
                                                    <h4 className="text-2xl font-bold uppercase tracking-tighter italic">Accesso Privato</h4>
                                                    <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest leading-relaxed">
                                                        Per riservare il tuo posto devi essere autenticato nel sistema VŌLTA.
                                                    </p>
                                                </div>
                                                <div className="space-y-4 pt-6">
                                                    <Link
                                                        href="/account"
                                                        className="block w-full bg-white text-black py-5 rounded-2xl font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-gold transition-all"
                                                    >
                                                        Login / Accesso
                                                    </Link>
                                                    <Link
                                                        href="/account?mode=signup"
                                                        className="block w-full border border-white/10 py-5 rounded-2xl font-bold uppercase text-[10px] tracking-[0.2em] hover:bg-white/10 transition-all text-white/40"
                                                    >
                                                        Crea Profilo
                                                    </Link>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-10 animate-in slide-in-from-right duration-500 text-center">
                                                <div className="space-y-4">
                                                    <div className="w-24 h-24 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(255,184,0,0.05)]">
                                                        <User size={40} className="text-gold" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-2xl font-bold uppercase tracking-tighter italic">One-Click Booking</h4>
                                                        <p className="text-[10px] font-bold uppercase text-white/30 tracking-widest mt-2">{user?.user_metadata?.full_name || user?.email}</p>
                                                    </div>
                                                </div>

                                                <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 text-[9px] text-white/40 leading-relaxed uppercase tracking-widest text-justify italic">
                                                    Con la registrazione il tuo nominativo verrà inserito automaticamente nella guest list ufficiale di VŌLTA. Riceverai una conferma digitale via email.
                                                </div>

                                                {((selectedEvent.sold_out_type === 'LISTA' || selectedEvent.sold_out_type === 'COMPLETO') || (selectedEvent.regs_count || 0) >= (selectedEvent.reg_limit || 0)) && (
                                                    <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-4 italic">
                                                        {selectedEvent.sold_out_type === 'LISTA' ? "LISTA CHIUSA (SOLD OUT)" :
                                                            selectedEvent.sold_out_type === 'COMPLETO' ? "EVENTO COMPLETO (SOLD OUT)" :
                                                                "LIMITE PRENOTAZIONI RAGGIUNTO"}
                                                    </p>
                                                )}

                                                <button
                                                    onClick={handleRegister}
                                                    disabled={(selectedEvent.regs_count || 0) >= (selectedEvent.reg_limit || 0) || selectedEvent.sold_out_type === 'LISTA' || selectedEvent.sold_out_type === 'COMPLETO'}
                                                    className="w-full bg-gold text-black py-6 rounded-[2rem] font-extrabold uppercase text-xs tracking-[0.4em] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:grayscale"
                                                >
                                                    {selectedEvent.sold_out_type === 'TAVOLI' ? "RISERVA (LISTA SOLA)" : "RISERVA POSTO"}
                                                </button>

                                                <p className="text-[8px] uppercase font-bold text-white/20 tracking-[0.5em]">System Verified</p>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center text-center gap-8"
                                    >
                                        <div className="w-28 h-28 rounded-full bg-gold text-black flex items-center justify-center shadow-[0_0_80px_rgba(255,184,0,0.4)]">
                                            <CheckCircle2 size={56} />
                                        </div>
                                        <div className="space-y-3">
                                            <h4 className="text-3xl font-extrabold uppercase tracking-tighter italic text-gold">Successo!</h4>
                                            <p className="text-[10px] font-bold uppercase text-white/40 tracking-widest leading-relaxed max-w-[200px] mx-auto">
                                                Il tuo posto per {selectedEvent.title} è stato riservato correttamente.
                                            </p>
                                        </div>
                                        <div className="mt-4 text-[9px] font-bold uppercase text-gold/60 border border-gold/20 px-8 py-3 rounded-full animate-pulse">
                                            Email in arrivo...
                                        </div>
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
