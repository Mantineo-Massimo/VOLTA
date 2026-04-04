"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

export default function RegistrationForm() {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [qrValue, setQrValue] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("loading");

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            marketing: formData.get("marketing") === "on",
        };

        // Simulate API call for now (Server Action will be implemented)
        setTimeout(() => {
            setQrValue(JSON.stringify({ n: data.name, e: data.email, t: Date.now() }));
            setStatus("success");
        }, 1500);
    };

    if (status === "success") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
            >
                <div className="bg-white p-4 rounded-xl inline-block mx-auto border-4 border-neon shadow-[0_0_20px_rgba(0,255,204,0.3)]">
                    <QRCodeSVG value={qrValue} size={200} />
                </div>
                <div className="space-y-2">
                    <h4 className="text-2xl font-bold text-neon uppercase tracking-tight">Sei in lista!</h4>
                    <p className="text-sm text-white/60">Mostra questo QR Code all'ingresso per il check-in veloce.</p>
                </div>
                <button
                    onClick={() => setStatus("idle")}
                    className="text-xs uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                >
                    Effettua un'altra registrazione
                </button>
            </motion.div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Nome e Cognome</label>
                    <input
                        required
                        name="name"
                        type="text"
                        placeholder="MARIO ROSSI"
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/10 focus:outline-none focus:border-neon transition-colors font-medium"
                    />
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Email</label>
                    <input
                        required
                        name="email"
                        type="email"
                        placeholder="mario.rossi@email.com"
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/10 focus:outline-none focus:border-neon transition-colors font-medium"
                    />
                </div>

                <div>
                    <label className="block text-[10px] uppercase tracking-widest text-white/40 mb-1.5 ml-1">Cellulare</label>
                    <input
                        required
                        name="phone"
                        type="tel"
                        placeholder="+39 000 000 0000"
                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/10 focus:outline-none focus:border-neon transition-colors font-medium"
                    />
                </div>
            </div>

            <div className="space-y-3 pt-2">
                <label className="flex items-start space-x-3 cursor-pointer group">
                    <input required type="checkbox" className="mt-1 w-4 h-4 rounded border-white/10 bg-black/50 checked:bg-neon checked:border-neon transition-all cursor-pointer" />
                    <span className="text-[10px] uppercase tracking-wider text-white/40 group-hover:text-white/60 transition-colors leading-relaxed">
                        Accetto la Privacy Policy e il trattamento dei dati per la registrazione.
                    </span>
                </label>

                <label className="flex items-start space-x-3 cursor-pointer group">
                    <input name="marketing" type="checkbox" className="mt-1 w-4 h-4 rounded border-white/10 bg-black/50 checked:bg-neon checked:border-neon transition-all cursor-pointer" />
                    <span className="text-[10px] uppercase tracking-wider text-white/40 group-hover:text-white/60 transition-colors leading-relaxed">
                        Voglio ricevere aggiornamenti sui prossimi eventi VŌLTA (Marketing).
                    </span>
                </label>
            </div>

            <button
                disabled={status === "loading"}
                type="submit"
                className="w-full bg-white text-black font-black uppercase tracking-widest py-4 rounded-lg hover:bg-neon transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:scale-100"
            >
                {status === "loading" ? "Elaborazione..." : "Entra in Lista"}
            </button>
        </form>
    );
}
