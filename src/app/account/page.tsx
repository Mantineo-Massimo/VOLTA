"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Users, LogIn, CheckCircle, LogOut, ArrowRight, Activity, ShieldCheck, User, Search } from "lucide-react";

export default function Account() {
    const [role, setRole] = useState<"user" | "venue" | "admin" | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any>(null);
    const [events, setEvents] = useState([
        { id: 1, name: "VŌLTA Premiere", date: "4 APR 26", loc: "MESSINA", regs: 248, desc: "Evento di lancio esclusivo.", time: "22:00", dj: "CLARK", genre: "INDUSTRIAL", dresscode: true, entryType: "INVITE ONLY", isSoldOut: true, regLimit: 250 },
        { id: 2, name: "TECHNO CLASH", date: "10 APR 26", loc: "TAORMINA", regs: 156, desc: "La sfida definitiva.", time: "23:00", dj: "KØDE", genre: "TECHNO", dresscode: false, entryType: "DOOR TAX", isSoldOut: false, regLimit: 300 },
        { id: 3, name: "SICKO NIGHT", date: "12 APR 26", loc: "MILAZZO", regs: 92, desc: "Nightlife refinement.", time: "22:30", dj: "VNL", genre: "PHONK", dresscode: true, entryType: "WEB LIST", isSoldOut: false, regLimit: 150 }
    ]);

    // ... (rest of search/role selection logic) ...

    // Initial Login / Role Selection Screen
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-black pt-32 pb-24 px-6 overflow-hidden flex flex-col items-center justify-center relative font-sans">
                {/* Background Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl w-full relative z-10"
                >
                    <div className="flex flex-col items-center mb-16 text-center">
                        <motion.span
                            initial={{ width: 0 }}
                            animate={{ width: 60 }}
                            className="h-[1px] bg-gold mb-6"
                        />
                        <h1 className="text-6xl md:text-8xl font-bold tracking-[ -0.05em] uppercase leading-none">
                            Access <span className="text-gold">Portal.</span>
                        </h1>
                        <p className="mt-6 text-sm uppercase tracking-[0.3em] font-medium text-white/40 italic">Seleziona la tua modalità di accesso</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Member Access */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => { setRole("user"); setIsLoggedIn(true); }}
                            className="group relative h-[400px] flex flex-col justify-end p-10 border border-white/5 bg-white/[0.01] overflow-hidden rounded-sm hover:border-gold/30 transition-all"
                        >
                            <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-gold/10 transition-all">
                                <User size={120} strokeWidth={0.5} />
                            </div>
                            <div className="relative z-10 text-left">
                                <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-gold mb-4 block">Private Club</span>
                                <h2 className="text-4xl font-bold uppercase mb-4 tracking-tighter">Member</h2>
                                <p className="text-xs text-white/40 uppercase leading-relaxed font-medium mb-8">Accesso esclusivo per visualizzare pass e prenotazioni.</p>
                                <div className="flex items-center gap-2 group-hover:gap-4 transition-all text-[10px] font-bold uppercase tracking-widest">
                                    <span>Accedi</span>
                                    <ArrowRight size={14} className="text-gold" />
                                </div>
                            </div>
                        </motion.button>

                        {/* Venue Access */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => { setRole("venue"); setIsLoggedIn(true); }}
                            className="group relative h-[400px] flex flex-col justify-end p-10 border border-white/5 bg-white/[0.01] overflow-hidden rounded-sm hover:border-gold/30 transition-all"
                        >
                            <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-gold/10 transition-all">
                                <Users size={120} strokeWidth={0.5} />
                            </div>
                            <div className="relative z-10 text-left">
                                <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-gold mb-4 block">Operational Side</span>
                                <h2 className="text-4xl font-bold uppercase mb-4 tracking-tighter">Venue</h2>
                                <p className="text-xs text-white/40 uppercase leading-relaxed font-medium mb-8">Validazione accessi, liste ospiti e check-in rapido.</p>
                                <div className="flex items-center gap-2 group-hover:gap-4 transition-all text-[10px] font-bold uppercase tracking-widest">
                                    <span>Gestione</span>
                                    <ArrowRight size={14} className="text-gold" />
                                </div>
                            </div>
                        </motion.button>

                        {/* Admin Access */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            onClick={() => { setRole("admin"); setIsLoggedIn(true); }}
                            className="group relative h-[400px] flex flex-col justify-end p-10 border border-white/5 bg-white/[0.01] overflow-hidden rounded-sm hover:border-gold/30 transition-all"
                        >
                            <div className="absolute top-0 right-0 p-8 text-white/5 group-hover:text-gold/10 transition-all">
                                <ShieldCheck size={120} strokeWidth={0.5} />
                            </div>
                            <div className="relative z-10 text-left">
                                <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-gold mb-4 block">System Overlord</span>
                                <h2 className="text-4xl font-bold uppercase mb-4 tracking-tighter text-gold">Admin</h2>
                                <p className="text-xs text-white/40 uppercase leading-relaxed font-medium mb-8">Gestione globale eventi, liste registrazioni e controllo totale.</p>
                                <div className="flex items-center gap-2 group-hover:gap-4 transition-all text-[10px] font-bold uppercase tracking-widest text-gold">
                                    <span>Power Management</span>
                                    <ArrowRight size={14} />
                                </div>
                            </div>
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-32 pb-24 px-6 md:px-12 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header Navigation */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/5 pb-10">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <span className="w-12 h-[1px] bg-gold" />
                            <span className="text-[9px] uppercase font-bold tracking-[0.5em] text-gold">
                                {role === "user" ? "Private Member Area" : role === "venue" ? "Operational Command" : "Global System Administration"}
                            </span>
                        </motion.div>
                        <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter leading-none">
                            {role === "user" ? "Bentornato, Massimo" : role === "venue" ? "Operations" : "Management Hub"}
                        </h1>
                    </div>

                    <button
                        onClick={() => { setIsLoggedIn(false); setRole(null); setSelectedEventId(null); }}
                        className="flex items-center gap-2 group text-[10px] uppercase font-bold tracking-widest text-white/20 hover:text-white transition-colors"
                    >
                        <span>Fine Sessione</span>
                        <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {role === "admin" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Event List for Admins */}
                        <div className="lg:col-span-7 flex flex-col gap-10">
                            <div className="flex justify-between items-center bg-white/[0.02] p-8 border border-white/5">
                                <h2 className="text-2xl font-bold uppercase tracking-tighter">Eventi Globali</h2>
                                <button
                                    onClick={() => { setEditingEvent(null); setShowEventModal(true); }}
                                    className="bg-gold text-black text-[10px] font-bold uppercase px-6 py-3 tracking-widest hover:invert transition-all transform active:scale-95"
                                >
                                    NUOVO EVENTO
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                {events.map((event) => (
                                    <div
                                        key={event.id}
                                        onClick={() => setSelectedEventId(event.id)}
                                        className={`p-8 border transition-all cursor-pointer group ${selectedEventId === event.id ? 'border-gold bg-gold/5' : 'border-white/5 bg-white/[0.01] hover:border-white/20'}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-gold mb-2">{event.date} • {event.loc}</p>
                                                <h3 className="text-2xl font-bold uppercase tracking-tighter">{event.name}</h3>
                                                <p className="text-[10px] uppercase tracking-widest text-white/40 mt-3">{event.regs} Registrazioni Attive</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setEditingEvent(event); setShowEventModal(true); }}
                                                    className="p-2 border border-white/10 hover:border-white/40 text-white/40 hover:text-white transition-all"
                                                >
                                                    <Activity size={14} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEvents(prev => prev.filter(ev => ev.id !== event.id));
                                                        if (selectedEventId === event.id) setSelectedEventId(null);
                                                    }}
                                                    className="p-2 border border-white/10 hover:border-red-500/50 text-white/40 hover:text-red-500 transition-all"
                                                >
                                                    <LogOut size={14} className="rotate-90 text-red-500/50 group-hover:text-red-500" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Registration View for Selected Event */}
                        <div className="lg:col-span-5 border border-white/10 bg-white/[0.01] flex flex-col p-8 md:p-10 min-h-[600px] relative overflow-hidden">
                            {!selectedEventId ? (
                                <div className="flex-grow flex flex-col items-center justify-center text-center opacity-20">
                                    <Search size={48} strokeWidth={1} className="mb-6" />
                                    <p className="text-sm uppercase tracking-widest">Seleziona un evento per gestire le registrazioni</p>
                                </div>
                            ) : (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={selectedEventId}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="h-full flex flex-col"
                                    >
                                        <div className="mb-8 flex justify-between items-end border-b border-white/10 pb-6">
                                            <h3 className="text-xl font-bold uppercase tracking-tighter">Registrazioni Hub</h3>
                                            <span className="text-[9px] font-bold uppercase text-gold">Live Syncing</span>
                                        </div>

                                        <div className="space-y-6 flex-grow ">
                                            <div className="relative group">
                                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={14} />
                                                <input
                                                    type="text"
                                                    placeholder="CERCA IN LISTA..."
                                                    className="w-full bg-black border border-white/10 px-12 py-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-gold transition-all"
                                                />
                                            </div>

                                            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                                {(selectedEventId === 1 ? [
                                                    { name: "Marco Rossi", email: "m.rossi@v-member.it", status: "WEB" },
                                                    { name: "Luca Veronese", email: "l.vero@gmail.com", status: "PR-A" },
                                                    { name: "Chiara Belli", email: "chiara.b@v-member.it", status: "GOLD" },
                                                    { name: "Sandro Galli", email: "s.galli@hotmail.it", status: "WEB" }
                                                ] : selectedEventId === 2 ? [
                                                    { name: "Alessia Forte", email: "a.forte@v-member.it", status: "VIP" },
                                                    { name: "Dario Longo", email: "d.longo@gmail.com", status: "WEB" }
                                                ] : [
                                                    { name: "Giusy Mare", email: "g.mare@v-member.it", status: "WEB" }
                                                ]).map((reg, idx) => (
                                                    <div key={idx} className="p-4 border border-white/5 bg-white/[0.02] flex items-center justify-between group hover:border-white/20 transition-all">
                                                        <div>
                                                            <p className="font-bold uppercase text-xs tracking-tighter">{reg.name}</p>
                                                            <p className="text-[10px] text-white/20">{reg.email}</p>
                                                        </div>
                                                        <span className="text-[8px] font-bold px-2 py-1 bg-white/5 text-white/40 group-hover:bg-gold group-hover:text-black transition-colors">{reg.status}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="mt-12 flex gap-4">
                                            <button className="flex-grow border border-white/10 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all italic">EXPORT CSV</button>
                                            <button className="flex-grow border border-white/10 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-white/5 transition-all italic">SEND NOTIF</button>
                                        </div>
                                    </motion.div>
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                ) : role === "user" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        {/* Left Column: QR Code & Status */}
                        <div className="lg:col-span-4 flex flex-col gap-10">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative aspect-square max-w-[340px] mx-auto w-full group p-[2px] rounded-sm bg-gradient-to-tr from-gold/40 via-gold/10 to-transparent"
                            >
                                <div className="w-full h-full bg-black flex flex-col items-center justify-center p-12 relative overflow-hidden">
                                    {/* Rotating Background */}
                                    <div className="absolute inset-0 opacity-10 blur-3xl pointer-events-none bg-gold" />

                                    <div className="relative z-10 bg-white p-4 rounded-sm shadow-[0_0_50px_rgba(255,184,0,0.2)]">
                                        <QrCode size={180} className="text-black" strokeWidth={1.5} />
                                    </div>

                                    <div className="mt-8 text-center relative z-10">
                                        <p className="text-gold font-bold text-xl uppercase tracking-tighter">VŌLTA Premiere</p>
                                        <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-white/40 mt-1">4 APR 26 • MESSINA</p>
                                    </div>
                                </div>
                            </motion.div>

                            <div className="p-8 border border-white/5 bg-white/[0.02]">
                                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-6">Status Member</h3>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-3xl font-bold uppercase text-gold leading-none">VŌLTA Gold</p>
                                        <p className="text-[10px] uppercase mt-2 font-medium opacity-50">Socio Fondatore</p>
                                    </div>
                                    <ShieldCheck size={40} className="text-gold/20" />
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Information & History */}
                        <div className="lg:col-span-8 flex flex-col gap-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors relative group">
                                    <Activity className="absolute top-6 right-6 text-gold/20" size={24} />
                                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-2">Eventi Partecipati</h3>
                                    <p className="text-5xl font-bold">12</p>
                                </div>
                                <div className="p-8 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors relative group">
                                    <Users className="absolute top-6 right-6 text-gold/20" size={24} />
                                    <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/40 mb-2">Inviti Disponibili</h3>
                                    <p className="text-5xl font-bold">03</p>
                                </div>
                            </div>

                            <div className="border border-white/5 bg-white/[0.02] p-10 flex flex-col flex-grow">
                                <h2 className="text-2xl font-bold uppercase tracking-tighter mb-8 flex justify-between items-center">
                                    Storico Accessi
                                    <span className="text-[10px] font-medium text-white/20 uppercase tracking-widest italic">Live Feed</span>
                                </h2>
                                <div className="space-y-4">
                                    {[
                                        { event: "Season Opening 2023", date: "22 DEC 23", location: "Catania" },
                                        { event: "Winter Gala", date: "05 JAN 24", location: "Taormina" },
                                        { event: "Underground Special", date: "14 FEB 24", location: "Messina" }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between py-6 border-b border-white/5 group hover:px-2 transition-all">
                                            <div>
                                                <p className="font-bold uppercase tracking-tighter text-lg">{item.event}</p>
                                                <p className="text-[10px] uppercase tracking-widest text-white/40 mt-1">{item.date} • {item.location}</p>
                                            </div>
                                            <CheckCircle size={20} className="text-gold/40 group-hover:text-gold transition-colors" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-12">
                        {/* Venue Metrics Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {[
                                { label: "Prenotati", value: "248", trend: "+12%" },
                                { label: "Check-in", value: "112", trend: "45%" },
                                { label: "In Attesa", value: "136", trend: "-" },
                                { label: "Capienza", value: "85%", trend: "Critical" }
                            ].map((stat, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="p-8 border border-white/10 bg-white/[0.02] flex flex-col"
                                >
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-4">{stat.label}</span>
                                    <div className="flex items-end justify-between">
                                        <span className="text-5xl font-bold tracking-tighter">{stat.value}</span>
                                        <span className={`text-[10px] font-bold uppercase px-2 py-1 ${stat.trend === 'Critical' ? 'bg-red-500/20 text-red-500' : 'bg-gold/10 text-gold'}`}>
                                            {stat.trend}
                                        </span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* Management Table Area */}
                        <div className="bg-white/[0.01] border border-white/10 p-1 md:p-10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                                <h3 className="text-3xl font-bold uppercase tracking-tighter">Real-Time Access List</h3>
                                <div className="w-full md:w-80 relative group">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-gold transition-colors" size={16} />
                                    <input
                                        type="text"
                                        placeholder="CERCA NOMINATIVO O ID..."
                                        className="w-full bg-black border border-white/10 px-12 py-3 text-[10px] font-bold uppercase tracking-widest focus:outline-none focus:border-gold transition-all"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="text-left border-b border-white text-[10px] font-bold uppercase tracking-[0.4em] opacity-40">
                                            <th className="py-6 px-4">Nominativo</th>
                                            <th className="py-6 px-4">Canale</th>
                                            <th className="py-6 px-4">Time</th>
                                            <th className="py-6 px-4">Status</th>
                                            <th className="py-6 px-4 text-right">Azione</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {[
                                            { name: "Massimo Mantineo", channel: "Web Direct", time: "22:14", status: "Ready", active: true },
                                            { name: "Alessio Morelli", channel: "G-List #01", time: "22:15", status: "Ready", active: true },
                                            { name: "Francesca Neri", channel: "Member Platinum", time: "21:50", status: "Checked", active: false },
                                            { name: "Roberto Gallo", channel: "PR Team A", time: "21:48", status: "Checked", active: false }
                                        ].map((person, idx) => (
                                            <tr key={idx} className={`group hover:bg-white/[0.02] transition-colors ${!person.active ? 'opacity-30' : ''}`}>
                                                <td className="py-6 px-4">
                                                    <p className="font-bold uppercase tracking-tighter text-sm">{person.name}</p>
                                                    <p className="text-[9px] text-white/40 uppercase tracking-widest mt-1">ID: VLT-2024-{1000 + idx}</p>
                                                </td>
                                                <td className="py-6 px-4 text-[10px] uppercase font-medium tracking-widest text-white/60">{person.channel}</td>
                                                <td className="py-6 px-4 text-[10px] font-medium tracking-widest">{person.time}</td>
                                                <td className="py-6 px-4">
                                                    <span className={`text-[9px] font-bold uppercase border px-2 py-0.5 ${person.active ? 'border-gold text-gold' : 'border-white/20 text-white/40'}`}>
                                                        {person.status}
                                                    </span>
                                                </td>
                                                <td className="py-6 px-4 text-right">
                                                    {person.active ? (
                                                        <button className="bg-gold text-black text-[10px] font-bold uppercase px-6 py-2 tracking-widest hover:bg-white transition-all transform active:scale-95">
                                                            Conferma
                                                        </button>
                                                    ) : (
                                                        <span className="text-[9px] font-bold text-white/20 uppercase">Validato</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Event Management Modal */}
            <AnimatePresence>
                {showEventModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="bg-black border border-white/10 p-10 max-w-2xl w-full relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />

                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-2 block">Database Entry</span>
                                    <h3 className="text-4xl font-bold uppercase tracking-tighter">
                                        {editingEvent ? "Modifica Evento" : "Nuovo Evento"}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setShowEventModal(false)}
                                    className="text-white/20 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest"
                                >
                                    Chiudi
                                </button>
                            </div>

                            <form className="space-y-8 h-[60vh] overflow-y-auto pr-4 custom-scrollbar" onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                const newEventData = {
                                    id: editingEvent ? editingEvent.id : Date.now(),
                                    name: formData.get('name') as string,
                                    date: formData.get('date') as string,
                                    loc: formData.get('loc') as string,
                                    time: formData.get('time') as string,
                                    desc: formData.get('desc') as string,
                                    dj: formData.get('dj') as string,
                                    genre: formData.get('genre') as string,
                                    dresscode: formData.get('dresscode') === 'on',
                                    entryType: formData.get('entryType') as string,
                                    isSoldOut: formData.get('isSoldOut') === 'on',
                                    regLimit: parseInt(formData.get('regLimit') as string) || 0,
                                    regs: editingEvent ? editingEvent.regs : 0
                                };

                                if (editingEvent) {
                                    setEvents(prev => prev.map(ev => ev.id === editingEvent.id ? newEventData : ev));
                                } else {
                                    setEvents(prev => [...prev, newEventData]);
                                }
                                setShowEventModal(false);
                            }}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Nome Evento</label>
                                        <input required name="name" defaultValue={editingEvent?.name} className="w-full bg-white/[0.02] border border-white/10 p-4 text-sm font-bold uppercase tracking-tighter focus:border-gold outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Location</label>
                                        <input required name="loc" defaultValue={editingEvent?.loc} className="w-full bg-white/[0.02] border border-white/10 p-4 text-sm font-bold uppercase tracking-tighter focus:border-gold outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">DJ Master</label>
                                        <input required name="dj" defaultValue={editingEvent?.dj} className="w-full bg-white/[0.02] border border-white/10 p-4 text-sm font-bold uppercase tracking-tighter focus:border-gold outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Genere Musicale</label>
                                        <input required name="genre" defaultValue={editingEvent?.genre} className="w-full bg-white/[0.02] border border-white/10 p-4 text-sm font-bold uppercase tracking-tighter focus:border-gold outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Data</label>
                                        <input required name="date" placeholder="DD MMM YY" defaultValue={editingEvent?.date} className="w-full bg-white/[0.02] border border-white/10 p-4 text-sm font-bold uppercase tracking-tighter focus:border-gold outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Orario</label>
                                        <input required name="time" type="time" defaultValue={editingEvent?.time} className="w-full bg-white/[0.02] border border-white/10 p-4 text-sm font-bold uppercase tracking-tighter focus:border-gold outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Tipo Entrata</label>
                                        <select name="entryType" defaultValue={editingEvent?.entryType || "WEB LIST"} className="w-full bg-black border border-white/10 p-4 text-sm font-bold uppercase tracking-tighter focus:border-gold outline-none transition-all">
                                            <option value="WEB LIST">WEB LIST</option>
                                            <option value="INVITE ONLY">INVITE ONLY</option>
                                            <option value="DOOR TAX">DOOR TAX</option>
                                            <option value="PRIVATE">PRIVATE</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Limite Registrazioni</label>
                                        <input required name="regLimit" type="number" defaultValue={editingEvent?.regLimit} className="w-full bg-white/[0.02] border border-white/10 p-4 text-sm font-bold uppercase tracking-tighter focus:border-gold outline-none transition-all" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <label className="flex items-center gap-4 cursor-pointer group">
                                        <input type="checkbox" name="dresscode" defaultChecked={editingEvent?.dresscode} className="hidden peer" />
                                        <div className="w-6 h-6 border border-white/20 peer-checked:bg-gold peer-checked:border-gold transition-all" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-gold transition-colors">Richiesto Dresscode</span>
                                    </label>
                                    <label className="flex items-center gap-4 cursor-pointer group">
                                        <input type="checkbox" name="isSoldOut" defaultChecked={editingEvent?.isSoldOut} className="hidden peer" />
                                        <div className="w-6 h-6 border border-white/20 peer-checked:bg-red-500 peer-checked:border-red-500 transition-all" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest group-hover:text-red-500 transition-colors">Segna come Sold Out</span>
                                    </label>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40">Descrizione dell'Evento</label>
                                    <textarea name="desc" rows={4} defaultValue={editingEvent?.desc} className="w-full bg-white/[0.02] border border-white/10 p-4 text-sm font-bold uppercase tracking-tighter focus:border-gold outline-none transition-all resize-none" />
                                </div>

                                <button type="submit" className="w-full bg-gold text-black font-bold uppercase py-5 tracking-[0.3em] hover:invert transition-all transform active:scale-95 shadow-[0_20px_50px_rgba(255,184,0,0.1)] mt-4">
                                    {editingEvent ? "SALVA MODIFICHE" : "PUBBLICA EVENTO"}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
