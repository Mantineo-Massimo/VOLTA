"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { QrCode, Users, LogIn, CheckCircle } from "lucide-react";

export default function Account() {
    const [role, setRole] = useState<"user" | "venue" | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    if (!isLoggedIn) {
        return (
            <div className="pt-32 pb-24 px-6 bg-black min-h-screen flex flex-col items-center justify-center gap-12">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase text-center">Area Personale</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    <button
                        onClick={() => { setRole("user"); setIsLoggedIn(true); }}
                        className="brutalist-card hover:bg-white/5 transition-colors group text-left"
                    >
                        <LogIn className="mb-4 text-gold group-hover:scale-110 transition-transform" size={48} />
                        <h2 className="text-3xl font-bold uppercase mb-2">User Side</h2>
                        <p className="font-thin text-white/60 uppercase text-xs tracking-widest">Accedi per i tuoi QR Code ed eventi.</p>
                    </button>
                    <button
                        onClick={() => { setRole("venue"); setIsLoggedIn(true); }}
                        className="brutalist-card hover:bg-white/5 transition-colors group text-left border-gold"
                    >
                        <Users className="mb-4 text-gold group-hover:scale-110 transition-transform" size={48} />
                        <h2 className="text-3xl font-bold uppercase mb-2">Venue Side</h2>
                        <p className="font-thin text-white/60 uppercase text-xs tracking-widest">Dashboard riservata ai locali & check-in.</p>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-24 px-6 bg-black min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-12 border-b border-white/10 pb-6">
                    <h1 className="text-4xl font-bold uppercase tracking-tighter">
                        {role === "user" ? "La tua VŌLTA Dashboard" : "Venue Control Panel"}
                    </h1>
                    <button
                        onClick={() => setIsLoggedIn(false)}
                        className="text-[10px] uppercase tracking-widest hover:text-gold underline"
                    >
                        Esci
                    </button>
                </div>

                {role === "user" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* User QR Codes */}
                        <div className="lg:col-span-2 flex flex-col gap-8">
                            <h2 className="text-2xl font-bold uppercase">QR Code Attivi</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="brutalist-card bg-white text-black flex flex-col items-center gap-4">
                                    <QrCode size={160} />
                                    <div className="text-center">
                                        <p className="font-bold text-xl uppercase">VŌLTA Premiere</p>
                                        <p className="text-xs uppercase tracking-tighter">4 Aprile @ Messina</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Participation History */}
                        <div className="flex flex-col gap-8 bg-white/5 p-8 brutalist-border">
                            <h2 className="text-2xl font-bold uppercase">Storico</h2>
                            <ul className="flex flex-col gap-4 text-sm font-thin">
                                <li className="flex justify-between items-center border-b border-white/10 py-2">
                                    <span>Season Opening 2023</span>
                                    <CheckCircle size={16} className="text-gold" />
                                </li>
                                <li className="flex justify-between items-center border-b border-white/10 py-2">
                                    <span>Winter Gala</span>
                                    <CheckCircle size={16} className="text-gold" />
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-12">
                        {/* Venue Dashboard */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="brutalist-card text-center flex flex-col gap-2">
                                <span className="text-gold text-4xl font-bold">128</span>
                                <span className="text-[10px] uppercase font-bold">Registrati</span>
                            </div>
                            <div className="brutalist-card text-center flex flex-col gap-2">
                                <span className="text-gold text-4xl font-bold">45</span>
                                <span className="text-[10px] uppercase font-bold">Check-in effettuati</span>
                            </div>
                        </div>

                        <div className="brutalist-card mt-6">
                            <h2 className="text-2xl font-bold uppercase mb-6">Lista Nomi Tempo Reale</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-white uppercase text-xs">
                                            <th className="py-4">Nome</th>
                                            <th className="py-4">Metodo</th>
                                            <th className="py-4">Status</th>
                                            <th className="py-4">Azione</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b border-white/10 text-sm font-thin">
                                            <td className="py-4 font-bold">Massimiliano Rossi</td>
                                            <td className="py-4 uppercase">Web Registration</td>
                                            <td className="py-4 text-gold uppercase">Ready</td>
                                            <td className="py-4">
                                                <button className="bg-gold text-black px-4 py-1 font-bold text-[10px] hover:invert transition-all">CHECK-IN</button>
                                            </td>
                                        </tr>
                                        <tr className="border-b border-white/10 text-sm font-thin opacity-30">
                                            <td className="py-4 font-bold">Giulia Bianchi</td>
                                            <td className="py-4 uppercase">Guest List</td>
                                            <td className="py-4 uppercase">Checked-in</td>
                                            <td className="py-4">
                                                <span className="text-[10px] font-bold">COMPLETED</span>
                                            </td>
                                        </tr>
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
