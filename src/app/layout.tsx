import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "VŌLTA - The Nightlife Guestlist Engine",
    description: "La sVŌLTA della settimana",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="it">
            <body className={`${inter.className} bg-black text-white min-h-screen flex flex-col`}>
                <main className="flex-grow">
                    {children}
                </main>
                <footer className="py-8 px-4 border-t border-white/10 text-center text-xs text-white/40">
                    <div className="max-w-4xl mx-auto">
                        <p className="mb-2">Marco Finocchio | P.IVA 03836020838</p>
                        <p>Via Giosuè Carducci n. 1, 98023 Furci Siculo (ME)</p>
                    </div>
                </footer>
            </body>
        </html>
    );
}
