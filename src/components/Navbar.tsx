"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Instagram, Facebook } from "lucide-react";

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
            {/* Elegant Top Bar */}
            <nav className="fixed w-full z-[100] px-6 py-4 md:px-12 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/10">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/assets/Logo.png"
                        alt="VŌLTA"
                        width={120}
                        height={40}
                        className="object-contain"
                    />
                </Link>

                <div className="flex items-center gap-8">
                    {/* Desktop Static Links (Partial) */}
                    <div className="hidden lg:flex gap-8 items-center mr-8">
                        {navLinks.slice(0, 3).map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-xs uppercase font-bold tracking-widest hover:text-gold transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <button
                        className="flex items-center gap-4 group"
                        onClick={() => setIsOpen(true)}
                    >
                        <span className="text-xs uppercase font-bold tracking-[0.3em] group-hover:text-gold transition-colors">Menù</span>
                        <div className="flex flex-col gap-1 w-6">
                            <div className="w-full h-[2px] bg-white group-hover:bg-gold transition-colors" />
                            <div className="w-full h-[2px] bg-white group-hover:bg-gold transition-colors" />
                        </div>
                    </button>
                </div>
            </nav>

            {/* Refined Side Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-sm"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className="fixed right-0 top-0 h-full w-full md:w-[400px] z-[120] bg-black border-l border-white/10 p-12 flex flex-col justify-between"
                        >
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="group flex items-center gap-4"
                                >
                                    <span className="text-xs font-bold uppercase tracking-widest">Chiudi</span>
                                    <X size={24} className="group-hover:rotate-90 transition-transform duration-500" />
                                </button>
                            </div>

                            <nav className="flex flex-col gap-8">
                                {navLinks.map((link, i) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className="text-4xl font-bold uppercase tracking-tighter hover:text-gold transition-all hover:pl-4"
                                        >
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                ))}
                            </nav>

                            <div className="pt-8 border-t border-white/10 space-y-6">
                                <div className="space-y-1">
                                    <h4 className="text-gold font-bold uppercase text-[10px] tracking-widest">Next Event</h4>
                                    <p className="text-lg font-bold uppercase">Messina 04.04</p>
                                </div>
                                <div className="flex gap-6 items-center">
                                    <Instagram size={20} className="hover:text-gold cursor-pointer" />
                                    <Facebook size={20} className="hover:text-gold cursor-pointer" />
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-widest opacity-20">© 2026 VŌLTA</p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
