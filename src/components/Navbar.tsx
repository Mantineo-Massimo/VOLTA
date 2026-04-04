"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Instagram, Facebook, LayoutGrid } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const navLinks = [
    { name: "Home", href: "/" },
    { name: "Chi Siamo", href: "/about" },
    { name: "Eventi", href: "/events" },
    { name: "Galleria", href: "/gallery" },
    { name: "Account", href: "/account" },
];

export default function Navbar() {
    const supabase = createClient();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);

        // Auth state listener
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsLoggedIn(!!session);
        };
        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsLoggedIn(!!session);
        });

        return () => {
            window.removeEventListener("scroll", handleScroll);
            subscription.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    }, [isOpen]);

    return (
        <>
            {/* Modern Floating Header */}
            <header className="fixed w-full z-[100] px-6 py-6 transition-all duration-500 flex justify-center">
                <motion.nav
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    className={`
                        flex items-center justify-between px-6 py-3 rounded-full border border-white/10 transition-all duration-500
                        ${scrolled ? "w-full md:w-[90%] lg:w-[800px] bg-black/60 backdrop-blur-xl shadow-2xl" : "w-full bg-transparent border-transparent"}
                    `}
                >
                    <Link href="/" className="flex items-center shrink-0">
                        <Image
                            src="/assets/Logo.png"
                            alt="VŌLTA"
                            width={100}
                            height={30}
                            className="object-contain"
                        />
                    </Link>

                    {/* Desktop Center Links */}
                    <div className="hidden md:flex items-center gap-6">
                        {navLinks.slice(1, 4).map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[10px] uppercase font-bold tracking-[0.2em] text-white/60 hover:text-gold transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/account" className="hidden sm:block text-[10px] uppercase font-bold tracking-widest border border-white/20 px-4 py-1.5 rounded-full hover:bg-white hover:text-black transition-all">
                            {isLoggedIn ? "Account" : "Accedi"}
                        </Link>
                        <button
                            onClick={() => setIsOpen(true)}
                            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-gold transition-colors"
                        >
                            <LayoutGrid size={20} />
                        </button>
                    </div>
                </motion.nav>
            </header>

            {/* Modern Minimalist Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-8 right-8 w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex flex-col gap-8 text-center">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className="text-4xl md:text-7xl font-bold uppercase tracking-tighter transition-all hover:text-gold hover:italic"
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Overlay Footer */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="absolute bottom-12 flex flex-col items-center gap-6"
                        >
                            <div className="flex gap-8">
                                <Instagram size={20} className="text-white/40 hover:text-gold transition-colors cursor-pointer" />
                                <Facebook size={20} className="text-white/40 hover:text-gold transition-colors cursor-pointer" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-[0.5em] text-white/20">VŌLTA Messina 2026</span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
