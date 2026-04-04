export default function Footer() {
    return (
        <footer className="w-full bg-black border-t border-white/10 py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold tracking-tighter">VŌLTA</h2>
                    <p className="text-xs text-white/50 uppercase tracking-widest">
                        Marco Finocchio | P.IVA 03836020838
                    </p>
                    <p className="text-xs text-white/50 uppercase tracking-widest">
                        Via Giosuè Carducci n. 1, 98023 Furci Siculo (ME)
                    </p>
                </div>

                <div className="text-[10px] text-white/20 uppercase tracking-widest">
                    © {new Date().getFullYear()} VŌLTA. Tutti i diritti riservati.
                </div>
            </div>
        </footer>
    );
}
