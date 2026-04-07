"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Calendar, MapPin, Music, X, ArrowRight, Info, CheckCircle2, Lock, User, Clock, Plus, Zap, ShieldCheck } from "lucide-react";
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
        <div className="bg-black min-h-screen text-white pt-32 pb-24 px-6 selection:bg-gold selection:text-black">
            <div className="max-w-7xl mx-auto space-y-24">

                {/* Header Section: Brutalist Impact */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative flex flex-col md:flex-row justify-between items-start md:items-end gap-12 border-l-4 border-gold pl-8 md:pl-12 py-4"
                >
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-gold animate-pulse" />
                            <span className="text-gold font-black uppercase text-[10px] tracking-[0.6em] italic">Anno • {new Date().getFullYear()}</span>
                        </div>
                        <h1 className="text-7xl md:text-[10rem] font-black uppercase tracking-tighter leading-[0.8] italic">
                            Prossimi<br />Eventi
                        </h1>
                    </div>
                    <div className="max-w-sm space-y-6">
                        <div className="flex items-center gap-2 text-white/20">
                            <Lock size={12} />
                            <span className="text-[10px] uppercase font-black tracking-[0.3em]">Authorized Access Only</span>
                        </div>
                        <p className="text-xs uppercase font-bold tracking-widest text-white/40 leading-relaxed text-justify italic">
                            L&apos;accesso alle esperienze VŌLTA è riservato esclusivamente ai membri verificati
                        </p>
                    </div>
                </motion.div>

                {/* Events Grid: Tactical Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-8">
                    {isLoading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="aspect-[4/5] bg-white/[0.02] border border-white/5 animate-pulse" />
                        ))
                    ) : activeEvents.length > 0 ? (
                        activeEvents.map((event, i) => {
                            const isFull = (event.regs_count || 0) >= (event.reg_limit || 0);
                            let statusLabel = "Available";
                            let statusColor = "border-gold text-gold";

                            if (event.sold_out_type && event.sold_out_type !== 'NONE') {
                                statusLabel = `SOLD OUT ${event.sold_out_type}`;
                                statusColor = "border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
                            } else if (event.is_sold_out || isFull) {
                                statusLabel = "Sold Out";
                                statusColor = "border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]";
                            }

                            return (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    viewport={{ once: true }}
                                    className="group relative flex flex-col bg-transparent cursor-pointer"
                                    onClick={() => setSelectedEvent(event)}
                                >
                                    {/* Tactical Metadata Overlay */}
                                    <div className="absolute -top-4 left-0 right-0 flex justify-between items-center z-20 px-4">
                                        <span className="text-[8px] font-black tracking-[0.4em] text-white/20 uppercase whitespace-nowrap">
                                            FLR-ID: {event.id.substring(0, 8).toUpperCase()}
                                        </span>
                                        <div className="h-[1px] flex-grow mx-4 bg-white/5" />
                                    </div>

                                    {/* Main Asset Container */}
                                    <div className="aspect-[4/5] relative overflow-hidden bg-zinc-900 border border-white/10 group-hover:border-gold/50 transition-all duration-500">
                                        <Image
                                            src={event.image || "/assets/DSC_0036.JPG"}
                                            alt={event.title}
                                            fill
                                            className="object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:scale-105 group-hover:brightness-100 transition-all duration-1000 ease-out"
                                        />

                                        {/* Overlay Gradients */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                                        <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                        {/* Status Badge */}
                                        <div className="absolute top-6 right-6">
                                            <span className={`text-[9px] font-black uppercase px-4 py-1.5 border-2 ${statusColor} backdrop-blur-md`}>
                                                {statusLabel}
                                            </span>
                                        </div>

                                        {/* Interaction Cue */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100">
                                            <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
                                                <Plus size={24} className="text-gold" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="pt-8 space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-gold font-black text-[10px] tracking-[0.4em] uppercase">{event.date}</span>
                                                <span className="text-white/20 text-[10px] font-black">•</span>
                                                <span className="text-white/40 font-black text-[10px] tracking-[0.4em] uppercase">{event.location}</span>
                                            </div>
                                            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none italic group-hover:text-gold transition-colors duration-300">
                                                {event.title}
                                            </h2>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 border-t border-white/10 pt-6">
                                            <div className="flex items-center gap-3 text-white/30 group-hover:text-white/60 transition-colors">
                                                <MapPin size={12} className="text-gold" />
                                                <span className="text-[9px] font-black uppercase tracking-widest">{event.venue || event.location}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-white/30 group-hover:text-white/60 transition-colors">
                                                <Music size={12} className="text-gold" />
                                                <span className="text-[9px] font-black uppercase tracking-widest truncate">{event.dj}</span>
                                            </div>
                                        </div>

                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <div className="col-span-full py-40 flex flex-col items-center justify-center text-center space-y-8 border-2 border-dashed border-white/5">
                            <div className="w-24 h-24 rounded-full bg-white/[0.02] border border-white/5 flex items-center justify-center relative overflow-hidden">
                                <div className="absolute inset-0 bg-gold/5 animate-pulse" />
                                <Music size={40} className="text-gold/20" />
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic">Nessun Evento Programmato.</h3>
                                <p className="text-[10px] uppercase font-black tracking-[0.5em] text-white/20">Stiamo preparando la prossima sVŌLTA eccellente.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="pt-24 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8"
                >
                    <p className="text-[9px] uppercase font-black tracking-[0.5em] text-white/20">
                        © {new Date().getFullYear()} VŌLTA MESSINA • ALL RIGHTS RESERVED
                    </p>
                    <div className="flex items-center gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-white/40 italic">
                        <span>Physical Payment Only</span>
                        <span>Member Verified Only</span>
                    </div>
                </motion.div>
            </div>

            {/* Modal: Tactical Overlay Redesign */}
            <AnimatePresence>
                {selectedEvent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-0 md:p-8"
                    >
                        {/* Immersive Background Backdrop */}
                        <motion.div
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.1, opacity: 0 }}
                            className="absolute inset-0 bg-cover bg-center grayscale brightness-[0.2]"
                            style={{ backgroundImage: `url(${selectedEvent.image || "/assets/DSC_0036.JPG"})` }}
                        />
                        <div className="absolute inset-0 bg-black/80 backdrop-blur-3xl" />

                        {/* Tactical Scanline Effect overlay */}
                        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] z-10 opacity-20" />

                        <motion.div
                            initial={{ y: 50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 50, opacity: 0, scale: 0.95 }}
                            className="relative w-full max-w-7xl h-full md:h-[85vh] bg-zinc-950/40 border-y md:border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(0,0,0,1)] z-20"
                        >
                            {/* Close Button: Elite Square */}
                            <button
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-6 right-6 z-50 w-12 h-12 flex items-center justify-center border border-white/10 hover:border-gold hover:text-gold transition-all bg-black/50 backdrop-blur-md group"
                            >
                                <X size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                            </button>

                            {/* Left: Mission Asset Hub */}
                            <div className="hidden md:block w-[45%] relative border-r border-white/10 overflow-hidden group/asset">
                                <Image
                                    src={selectedEvent.image || "/assets/DSC_0036.JPG"}
                                    alt={selectedEvent.title}
                                    fill
                                    className="object-cover grayscale brightness-50 group-hover/asset:brightness-75 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

                                {/* Floating Metadata */}
                                <div className="absolute bottom-12 left-12 space-y-4">
                                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.5em] text-gold animate-pulse">
                                        <div className="w-2 h-2 bg-gold rounded-full" />
                                        Asset Live Status: Verified
                                    </div>
                                    <h4 className="text-4xl font-black uppercase tracking-tighter italic text-white leading-none">
                                        {selectedEvent.title}
                                    </h4>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 max-w-xs leading-relaxed italic">
                                        {selectedEvent.description}
                                    </p>
                                </div>

                                {/* ID Overlay */}
                                <div className="absolute top-12 left-12 flex items-center gap-4 text-[8px] font-black tracking-[0.4em] text-white/20 uppercase">
                                    <span>REF: EVT-{selectedEvent.id.substring(0, 8).toUpperCase()}</span>
                                    <div className="h-[1px] w-8 bg-white/10" />
                                    <span>AUTH: VOLTA-{new Date().getFullYear()}</span>
                                </div>
                            </div>

                            {/* Right: Operational Control */}
                            <div className="flex-1 flex flex-col p-8 md:p-16 overflow-y-auto bg-black/40 backdrop-blur-md">
                                <div className="flex-1 space-y-16">
                                    {/* Section 01: Logistics Grid */}
                                    <div className="space-y-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1 h-1 bg-gold" />
                                            <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">Section 01 // Logistics</span>
                                        </div>
                                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
                                            {[
                                                { label: 'Deployment Date', val: selectedEvent.date, icon: Calendar },
                                                { label: 'Time Window', val: selectedEvent.time, icon: Clock },
                                                { label: 'Ground Zero', val: selectedEvent.venue || selectedEvent.location, icon: MapPin },
                                                { label: 'Principal DJ', val: selectedEvent.dj, icon: Music },
                                                { label: 'Sound Identity', val: selectedEvent.genre, icon: Zap },
                                                { label: 'Security Tier', val: selectedEvent.entry_type || "Members Only", icon: ShieldCheck }
                                            ].map((spec, idx) => (
                                                <div key={idx} className="space-y-2 group/spec">
                                                    <div className="flex items-center gap-2 opacity-20 group-hover/spec:opacity-50 transition-opacity">
                                                        <spec.icon size={10} className="text-gold" />
                                                        <p className="text-[8px] font-black uppercase tracking-[0.2em]">{spec.label}</p>
                                                    </div>
                                                    <p className="text-sm font-black uppercase tracking-tighter italic text-white/90 group-hover/spec:text-gold transition-colors">{spec.val}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Section 02: Registration Hub */}
                                    <div className="space-y-8 pt-8 border-t border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1 h-1 bg-gold" />
                                            <span className="text-gold text-[10px] font-black uppercase tracking-[0.4em]">Section 02 // Auth Hub</span>
                                        </div>

                                        {!isRegistered ? (
                                            <div className="space-y-10">
                                                {!isLoggedIn ? (
                                                    <div className="bg-white/[0.02] border border-white/5 p-8 space-y-8">
                                                        <div className="space-y-2">
                                                            <h4 className="text-2xl font-black uppercase tracking-tighter italic">Accesso Riservato.</h4>
                                                            <p className="text-[9px] font-bold uppercase text-white/20 tracking-widest italic">Autenticazione richiesta per il protocollo VŌLTA.</p>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row gap-4">
                                                            <Link href="/account" className="flex-1 bg-gold text-black py-4 px-8 font-black uppercase text-[10px] tracking-[0.3em] hover:scale-105 transition-all text-center italic">Login</Link>
                                                            <Link href="/account?mode=signup" className="flex-1 border border-white/10 text-white/40 py-4 px-8 font-black uppercase text-[10px] tracking-[0.3em] hover:bg-white/5 transition-all text-center italic">Registrati</Link>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-10">
                                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-gold/[0.03] border border-gold/10">
                                                            <div className="flex items-center gap-6">
                                                                <div className="w-16 h-16 border border-gold/30 flex items-center justify-center bg-gold/5">
                                                                    <User size={24} className="text-gold" />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <p className="text-[8px] font-black uppercase text-gold/40 tracking-widest">Authenticated Member</p>
                                                                    <p className="text-xs font-black uppercase text-white tracking-widest">{user?.email}</p>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-[8px] font-black uppercase text-white/20 tracking-widest mb-1 italic">Protocol Status</p>
                                                                <div className="inline-flex items-center gap-2 text-gold font-black uppercase text-[10px] tracking-widest italic">
                                                                    <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                                                                    Ready to Deploy
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="bg-white/[0.02] border border-white/5 p-6 text-[9px] font-bold uppercase tracking-[0.2em] leading-relaxed text-white/30 italic">
                                                            <span className="text-gold opacity-50 block mb-2">// WARNING //</span>
                                                            La registrazione non garantisce l&apos;ingresso. L&apos;accesso finale è subordinato alla convalida fisica dell&apos;identità e al rispetto del Dress Code da parte della sicurezza.
                                                        </div>

                                                        {((selectedEvent.sold_out_type === 'LISTA' || selectedEvent.sold_out_type === 'COMPLETO') || (selectedEvent.regs_count || 0) >= (selectedEvent.reg_limit || 0)) && (
                                                            <div className="border border-red-500/50 p-4 bg-red-500/5 text-center">
                                                                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">
                                                                    {selectedEvent.sold_out_type === 'LISTA' ? "LISTA CHIUSA (SOLD OUT)" :
                                                                        selectedEvent.sold_out_type === 'COMPLETO' ? "EVENTO COMPLETO (SOLD OUT)" :
                                                                            "CAPACITÀ MASSIMA RAGGIUNTA"}
                                                                </p>
                                                            </div>
                                                        )}

                                                        <button
                                                            onClick={handleRegister}
                                                            disabled={(selectedEvent.regs_count || 0) >= (selectedEvent.reg_limit || 0) || selectedEvent.sold_out_type === 'LISTA' || selectedEvent.sold_out_type === 'COMPLETO'}
                                                            className="w-full bg-gold text-black py-8 font-black uppercase text-xs tracking-[0.6em] hover:shadow-[0_0_50px_rgba(255,184,0,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-10 disabled:grayscale italic"
                                                        >
                                                            AUTORIZZA PRENOTAZIONE
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <motion.div
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-gold/5 border border-gold/30 p-12 flex flex-col items-center text-center gap-8"
                                            >
                                                <div className="w-20 h-20 border-2 border-gold text-gold flex items-center justify-center bg-gold/10 relative">
                                                    <div className="absolute inset-0 border border-gold animate-ping opacity-20" />
                                                    <CheckCircle2 size={40} />
                                                </div>
                                                <div className="space-y-4">
                                                    <h4 className="text-4xl font-black uppercase tracking-tighter italic text-gold">Autorizzato.</h4>
                                                    <p className="text-[10px] font-black uppercase text-white/50 tracking-[0.2em] leading-relaxed max-w-xs italic">
                                                        Protocollo di partecipazione confermato per {selectedEvent.title}. Riceverai a breve i dettagli tattici via email.
                                                    </p>
                                                </div>
                                                <div className="h-[1px] w-20 bg-gold/20" />
                                                <p className="text-[8px] font-black uppercase text-gold/40 tracking-[0.6em]">SECURITY SYNCED // VOLTA ELITE</p>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                {/* Footer Metadata Strip */}
                                <div className="mt-16 pt-8 border-t border-white/5 flex justify-between items-center text-white/10 text-[8px] font-black uppercase tracking-[0.4em]">
                                    <span>VŌLTA Messina // Tactical Interface v.3.0</span>
                                    <span className="hidden sm:block">Status: Operational</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
