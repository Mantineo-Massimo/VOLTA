"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Instagram, Facebook } from "lucide-react";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Chi Siamo", href: "/about" },
    { name: "Eventi", href: "/events" },
    { name: "Galleria", href: "/gallery" },
    { name: "Accedi", href: "/account" },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    // Disable scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isOpen]);

    return (
        <>
            {/* Minimalist Top Bar */}
            <nav className="fixed w-full z-[100] px-6 py-6 md:px-12 flex justify-between items-center mix-blend-difference">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/assets/Logo.png"
                        alt="VŌLTA"
                        width={140}
                        height={50}
                        className="object-contain"
                    />
                </Link>

                <button
                    className="flex items-center gap-4 group"
                    onClick={() => setIsOpen(true)}
                >
                    <span className="text-xs uppercase font-bold tracking-[0.3em] hidden md:block group-hover:text-gold transition-colors">Menù</span>
                    <div className="flex flex-col gap-1.5 overflow-hidden">
                        <div className="w-8 h-[2px] bg-white group-hover:translate-x-2 transition-transform duration-300" />
                        <div className="w-8 h-[2px] bg-white group-hover:-translate-x-2 transition-transform duration-300" />
                    </div>
                </button>
            </nav>

            {/* Immersive Full Screen Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ clipPath: "circle(0% at 100% 0%)" }}
                        animate={{ clipPath: "circle(150% at 100% 0%)" }}
                        exit={{ clipPath: "circle(0% at 100% 0%)" }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        className="fixed inset-0 z-[110] bg-black flex flex-col p-8 md:p-24"
                    >
                        {/* Overlay Header */}
                        <div className="flex justify-between items-center w-full">
                            <span className="text-xs font-bold uppercase tracking-[0.5em] text-gold/60">VŌLTA / CLUBBING CORE</span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="group flex items-center gap-4"
                            >
                                <span className="text-xs font-bold uppercase tracking-widest hidden md:block">Chiudi</span>
                                <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:border-gold transition-colors">
                                    <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                                </div>
                            </button>
                        </div>

                        {/* Main Links Area */}
                        <div className="flex-1 flex flex-col md:flex-row justify-center items-center md:items-end gap-12 md:gap-32">
                            <ul className="flex flex-col gap-4 md:gap-8 overflow-hidden">
                                {navLinks.map((link, i) => (
                                    <motion.li
                                        key={link.name}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="text-5xl md:text-[10rem] font-bold uppercase tracking-tighter leading-[0.8] hover:text-gold transition-colors block italic hover:not-italic"
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>

                            {/* Additional Context Info */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="hidden lg:flex flex-col gap-12 text-left border-l border-white/10 pl-16 max-w-sm mb-12"
                            >
                                <div className="space-y-4">
                                    <h4 className="text-gold font-bold uppercase text-xs tracking-widest leading-none">Next Show</h4>
                                    <p className="text-2xl font-bold uppercase leading-none">Messina 04.04</p>
                                    <p className="text-sm font-thin uppercase opacity-40 leading-none">Teatro Metropolitan</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-gold font-bold uppercase text-xs tracking-widest leading-none">Social Hub</h4>
                                    <div className="flex gap-4">
                                        <Instagram size={20} className="hover:text-gold cursor-pointer" />
                                        <Facebook size={20} className="hover:text-gold cursor-pointer" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold uppercase tracking-widest opacity-20">© 2026 VŌLTA. All Rights Reserved.</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
