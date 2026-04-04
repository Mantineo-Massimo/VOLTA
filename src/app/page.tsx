import Logo from "@/components/Logo";
import RegistrationForm from "@/components/RegistrationForm";
import Image from "next/image";

export default function LandingPage() {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-black overflow-hidden px-4">
            {/* Background patterns/effects */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-0 -left-4 w-72 h-72 bg-neon rounded-full mix-blend-screen filter blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 -right-4 w-72 h-72 bg-neon/30 rounded-full mix-blend-screen filter blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <section className="relative z-10 w-full max-w-4xl flex flex-col items-center space-y-16">
                <header className="text-center">
                    <Logo />
                </header>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Event Card */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm group">
                        <div className="relative aspect-video bg-black overflow-hidden">
                            {/* Fixed source path for logo or placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50 group-hover:scale-105 transition-transform duration-500">
                                <span className="text-white/20 text-4xl font-bold tracking-widest">VŌLTA EVENT</span>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold text-white tracking-tight">CANDY SHOP</h2>
                                <p className="text-neon text-sm font-medium uppercase tracking-widest">Villa Musco</p>
                            </div>
                            <div className="flex items-center space-x-4 text-white/60 text-sm">
                                <span>Venerdì 12 Aprile</span>
                                <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                                <span>23:30</span>
                            </div>
                        </div>
                    </div>

                    {/* Registration Form */}
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                        <div className="mb-8 border-l-2 border-neon pl-4">
                            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Mettiti in lista</h3>
                            <p className="text-sm text-white/40 mt-1">Registrazione gratuita. Il pagamento avviene alla cassa del locale.</p>
                        </div>
                        <RegistrationForm />
                    </div>
                </div>
            </section>
        </div>
    );
}
