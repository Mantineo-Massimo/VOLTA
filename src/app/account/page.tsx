"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Users, LogIn, CheckCircle, LogOut, ArrowRight, Activity, ShieldCheck, User, Search } from "lucide-react";

export default function Account() {
    const [role, setRole] = useState<"user" | "venue" | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Initial Login / Role Selection Screen
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-black pt-32 pb-24 px-6 overflow-hidden flex flex-col items-center justify-center relative">
                {/* Background Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl w-full relative z-10"
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
                        <p className="mt-6 text-sm uppercase tracking-[0.3em] font-medium text-white/40">Seleziona la tua modalità di accesso</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Member Access */}
                        <motion.button
                            whileHover={{ y: -10 }}
                            onClick={() => { setRole("user"); setIsLoggedIn(true); }}
                            className="group relative h-[400px] flex flex-col justify-end p-10 border border-white/10 bg-white/[0.02] overflow-hidden rounded-sm"
                        >
                            <div className="absolute top-0 right-0 p-8 text-white/10 group-hover:text-gold/20 transition-colors">
                                <User size={120} strokeWidth={0.5} />
                            </div>
                            <div className="relative z-10">
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-4 block">Area Riservata</span>
                                <h2 className="text-4xl font-bold uppercase mb-4 group-hover:text-gold transition-colors tracking-tighter">Member<br />Dashboard</h2>
                                <p className="text-xs text-white/50 uppercase leading-relaxed font-medium max-w-[200px] mb-8">Accesso esclusivo per visualizzare pass, prenotazioni e Tier VŌLTA.</p>
                                <div className="flex items-center gap-2 group-hover:gap-4 transition-all text-xs font-bold uppercase tracking-widest overflow-hidden">
                                    <span>Accedi</span>
                                    <ArrowRight size={14} className="text-gold" />
                                </div>
                            </div>
                        </motion.button>

                        {/* Venue Access */}
                        <motion.button
                            whileHover={{ y: -10 }}
                            onClick={() => { setRole("venue"); setIsLoggedIn(true); }}
                            className="group relative h-[400px] flex flex-col justify-end p-10 border border-white/10 bg-white/[0.02] overflow-hidden rounded-sm"
                        >
                            <div className="absolute top-0 right-0 p-8 text-white/10 group-hover:text-gold/20 transition-colors">
                                <ShieldCheck size={120} strokeWidth={0.5} />
                            </div>
                            <div className="relative z-10">
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold mb-4 block">Operatori Autorizzati</span>
                                <h2 className="text-4xl font-bold uppercase mb-4 group-hover:text-gold transition-colors tracking-tighter">Venue Control<br />System</h2>
                                <p className="text-xs text-white/50 uppercase leading-relaxed font-medium max-w-[200px] mb-8">Gestione liste, statistiche in tempo reale e validazione accessi.</p>
                                <div className="flex items-center gap-2 group-hover:gap-4 transition-all text-xs font-bold uppercase tracking-widest">
                                    <span>Sistema Operativo</span>
                                    <ArrowRight size={14} className="text-gold" />
                                </div>
                            </div>
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-32 pb-24 px-6 md:px-12">
            <div className="max-w-7xl mx-auto">
                {/* Header Navigation */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 border-b border-white/10 pb-10">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <span className="w-12 h-[1px] bg-gold" />
                            <span className="text-[10px] uppercase font-bold tracking-[0.5em] text-gold">
                                {role === "user" ? "Private Member Area" : "Operational Command"}
                            </span>
                        </motion.div>
                        <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter leading-none">
                            {role === "user" ? "Bentornato, Massimo" : "Management View"}
                        </h1>
                    </div>

                    <button
                        onClick={() => setIsLoggedIn(false)}
                        className="flex items-center gap-2 group text-[10px] uppercase font-bold tracking-widest text-white/40 hover:text-white transition-colors"
                    >
                        <span>Disconnetti Sessione</span>
                        <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {role === "user" ? (
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
        </div>
    );
}
