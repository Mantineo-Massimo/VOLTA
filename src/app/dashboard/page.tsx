"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, User, Phone, Clock, Search, RefreshCw } from "lucide-react";

export default function VenueDashboard() {
    const [guests, setGuests] = useState([
        { id: "1", name: "MARCO FINOCCHIO", email: "marco@volta.it", phone: "333 123 4567", checkedIn: true, time: "23:45" },
        { id: "2", name: "GIULIA BIANCHI", email: "giulia@email.com", phone: "349 987 6543", checkedIn: false, time: "23:50" },
        { id: "3", name: "ANDREA VERDI", email: "andrea@gmail.com", phone: "338 555 1111", checkedIn: false, time: "23:52" },
        { id: "4", name: "SARA NERI", email: "sara@outlook.com", phone: "347 222 3333", checkedIn: true, time: "00:05" },
    ]);

    const stats = {
        total: guests.length,
        entered: guests.filter(g => g.checkedIn).length,
        remaining: guests.length - guests.filter(g => g.checkedIn).length,
    };

    const toggleCheckIn = (id: string) => {
        setGuests(prev => prev.map(g => g.id === id ? { ...g, checkedIn: !g.checkedIn } : g));
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/10 pb-8">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tighter">VŌLTA <span className="text-neon">DASHBOARD</span></h1>
                        <p className="text-white/40 uppercase tracking-widest text-xs">Evento: Candy Shop | Villa Musco</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/5 p-1 rounded-lg border border-white/10">
                        <button className="px-4 py-2 bg-neon text-black text-xs font-bold uppercase rounded-md">Lista Ospiti</button>
                        <button className="px-4 py-2 hover:bg-white/5 text-white/60 text-xs font-bold uppercase rounded-md transition-colors">Analytics</button>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        { label: "Iscritti Totali", value: stats.total, color: "text-white" },
                        { label: "Arrivati", value: stats.entered, color: "text-neon" },
                        { label: "In Attesa", value: stats.remaining, color: "text-white/40" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                            <p className="text-[10px] uppercase tracking-widest text-white/40 mb-1">{stat.label}</p>
                            <p className={`text-4xl font-black ${stat.color}`}>{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Guest List List */}
                <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                    {/* Controls */}
                    <div className="p-4 border-b border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                            <input
                                type="text"
                                placeholder="CERCA NOME O EMAIL..."
                                className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm uppercase tracking-wider focus:outline-none focus:border-neon transition-colors"
                            />
                        </div>
                        <button className="flex items-center space-x-2 text-[10px] uppercase tracking-widest text-neon hover:text-white transition-colors">
                            <RefreshCw className="w-3 h-3" />
                            <span>Aggiorna Dati</span>
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/10 bg-white/[0.02]">
                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-medium">Ospite</th>
                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-medium md:table-cell hidden">Contatti</th>
                                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-white/40 font-medium md:table-cell hidden">Orario Reg.</th>
                                    <th className="px-6 py-4 text-right text-[10px] uppercase tracking-widest text-white/40 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {guests.map((guest) => (
                                    <motion.tr
                                        key={guest.id}
                                        layout
                                        className={`hover:bg-white/[0.02] transition-colors ${guest.checkedIn ? 'opacity-50' : ''}`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border ${guest.checkedIn ? 'border-neon/20 bg-neon/10' : 'border-white/10 bg-white/5'}`}>
                                                    <User className={`w-4 h-4 ${guest.checkedIn ? 'text-neon' : 'text-white/40'}`} />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm tracking-tight">{guest.name}</p>
                                                    <p className="text-[10px] text-white/40">{guest.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 md:table-cell hidden">
                                            <div className="flex items-center space-x-2 text-white/60">
                                                <Phone className="w-3 h-3" />
                                                <span className="text-xs">{guest.phone}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 md:table-cell hidden">
                                            <div className="flex items-center space-x-2 text-white/40">
                                                <Clock className="w-3 h-3" />
                                                <span className="text-xs tracking-wider">{guest.time}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => toggleCheckIn(guest.id)}
                                                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${guest.checkedIn
                                                        ? 'bg-neon text-black'
                                                        : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white'
                                                    }`}
                                            >
                                                {guest.checkedIn ? (
                                                    <>
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        <span>Entrato</span>
                                                    </>
                                                ) : (
                                                    <span>Segna Entrata</span>
                                                )}
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
