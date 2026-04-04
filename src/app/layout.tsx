import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "VŌLTA | La sVŌLTA della settimana",
    description: "VŌLTA - Esclusività, musica, atmosfera. La tua guida al clubbing di alto livello.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="it" className="bg-black">
            <body className={`${inter.className} min-h-screen flex flex-col`}>
                <Navbar />
                <main className="flex-grow">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    );
}
