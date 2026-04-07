"use client";

import { Suspense, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
    LayoutDashboard, Users, Calendar, Settings, Plus, Search,
    MoreVertical, Trash2, Edit, X, Check, Filter, Download,
    Music, MapPin, Clock, Info, Shield, LogOut, QrCode, Ticket,
    Upload, ImageIcon, ArrowRight, Activity, ShieldCheck, CheckCircle2, User
} from "lucide-react";

function AccountContent() {
    const supabase = createClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode");

    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

    const [events, setEvents] = useState<any[]>([]);
    const [registrations, setRegistrations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingRegs, setIsLoadingRegs] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
    const [showEventModal, setShowEventModal] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Auth Form State
    const [authEmail, setAuthEmail] = useState("");
    const [authPassword, setAuthPassword] = useState("");

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
                // Fetch profile for role and verification status
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                setProfile(profile);
                setStatus("authenticated");
            } else {
                setStatus("unauthenticated");
            }
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session) {
                setUser(session.user);
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();
                setProfile(profile);
                setStatus("authenticated");
            } else {
                setUser(null);
                setProfile(null);
                setStatus("unauthenticated");
            }
        });

        // Handle URL parameters for messages
        const msg = searchParams.get("message");
        const err = searchParams.get("error");
        if (msg === "verified_success") {
            setAuthMessage({ type: 'success', text: "ACCOUNT ATTIVATO CON SUCCESSO! ORA PUOI ACCEDERE." });
        } else if (msg === "already_verified") {
            setAuthMessage({ type: 'success', text: "ACCOUNT GIÀ VERIFICATO. ACCEDI PURE." });
        } else if (err === "invalid_token") {
            setAuthMessage({ type: 'error', text: "TOKEN DI VERIFICA NON VALIDO O SCADUTO." });
        }

        return () => subscription.unsubscribe();
    }, [searchParams]);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Using Supabase client directly for events
                const { data, error } = await supabase
                    .from('events')
                    .select('*')
                    .order('date', { ascending: true });

                if (data) setEvents(data);
                if (error) throw error;
            } catch (err) {
                console.error("Failed to fetch events");
            } finally {
                setIsLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const role = profile?.role || null;
    const isLoggedIn = status === "authenticated";

    useEffect(() => {
        if (selectedEventId && (role === "admin" || role === "venue")) {
            const fetchRegs = async () => {
                setIsLoadingRegs(true);
                try {
                    const { data, error } = await supabase
                        .from('registrations')
                        .select('*, profiles(full_name, email)') // Note: joined with profiles
                        .eq('event_id', selectedEventId);

                    if (data) {
                        // Map the joined profile data to match existing UI structure
                        const mappedData = data.map((reg: any) => ({
                            ...reg,
                            userId: reg.profiles // This matches the userId.full_name access in UI
                        }));
                        setRegistrations(mappedData);
                    }
                    if (error) throw error;
                } catch (err) {
                    console.error("Failed to fetch registrations");
                } finally {
                    setIsLoadingRegs(false);
                }
            };
            fetchRegs();
        }
    }, [selectedEventId, role]);

    const handleSaveEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const eventData: any = {
            dresscode: false,
            is_sold_out: false // Using snake_case for Supabase usually, but I'll stick to what I planned in SQL
        };
        formData.forEach((value, key) => {
            if (key === 'dresscode' || key === 'isSoldOut') {
                eventData[key === 'isSoldOut' ? 'is_sold_out' : key] = value === 'on';
            } else if (key === 'regLimit') {
                eventData.reg_limit = parseInt(value as string) || 0;
            } else if (key === 'imageFile') {
                // skip
            } else {
                // Map camelCase to snake_case for SQL if needed, but I'll use the SQL names
                const mapping: Record<string, string> = {
                    title: 'title',
                    location: 'location',
                    dj: 'dj',
                    genre: 'genre',
                    date: 'date',
                    time: 'time',
                    venue: 'venue',
                    description: 'description',
                    entryType: 'entry_type'
                };
                if (mapping[key]) {
                    eventData[mapping[key]] = value;
                }
            }
        });

        eventData.image = imagePreview || editingEvent?.image || "/assets/DSC_0036.JPG";

        try {
            if (editingEvent) {
                const { error } = await supabase
                    .from('events')
                    .update(eventData)
                    .eq('id', editingEvent.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('events')
                    .insert([eventData]);
                if (error) throw error;
            }

            const { data: updatedData } = await supabase
                .from('events')
                .select('*')
                .order('date', { ascending: true });

            if (updatedData) setEvents(updatedData);
            setShowEventModal(false);
            setEditingEvent(null);
            setImagePreview(null);
        } catch (err) {
            console.error("Failed to save event");
        }
    };

    const handleDeleteEvent = async (id: string) => {
        if (!confirm("Sei sicuro di voler eliminare questo evento?")) return;
        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id);

            if (!error) {
                setEvents(events.filter(e => e.id !== id));
                if (selectedEventId === id) setSelectedEventId(null);
            }
        } catch (err) {
            console.error("Failed to delete event");
        }
    };

    const [isSignup, setIsSignup] = useState(mode === "signup");
    const [authName, setAuthName] = useState("");
    const [authMessage, setAuthMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSignup) {
            try {
                setAuthMessage({ type: 'success', text: "CREAZIONE ACCOUNT IN CORSO..." });

                const response = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: authEmail,
                        password: authPassword,
                        full_name: authName
                    })
                });

                const data = await response.json();

                if (!response.ok) throw new Error(data.error || "Errore durante la registrazione");

                setAuthMessage({
                    type: 'success',
                    text: "MEMBERSHIP CREATA. BENVENUTO NEL CLUB. CONTROLLA LA TUA EMAIL."
                });

                // Clear fields
                setAuthEmail("");
                setAuthPassword("");
                setAuthName("");

                // Automatic login after signup if session is available
                // In our API case, we might need a manual login or wait for the auth state to change
                // But usually, Supabase Auth state will catch up if the user was signed up.
                // However, since we are using a server-side route, we might want to trigger a sign-in here or let the user login manually.
                // For better UX, we'll suggest logging in now.
                setIsSignup(false);
                setAuthMessage({
                    type: 'success',
                    text: "MEMBERSHIP CREATA. ORA PUOI ACCEDERE CON LE TUE CREDENZIALI."
                });
            } catch (err: any) {
                setAuthMessage({ type: 'error', text: err.message?.toUpperCase() || "ERRORE DURANTE LA REGISTRAZIONE" });
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email: authEmail,
                password: authPassword,
            });
            if (error) {
                setAuthMessage({ type: 'error', text: "Credenziali non valide: " + error.message });
            }
        }
    };

    if (isLoggedIn && (!profile || profile.is_verified === false)) {
        return (
            <div className="min-h-screen bg-black pt-32 pb-24 px-6 flex flex-col items-center justify-center relative font-sans text-white text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-white/5 p-12 border border-gold/30 backdrop-blur-xl relative z-10"
                >
                    <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-gold/20">
                        <ShieldCheck className="w-10 h-10 text-gold" />
                    </div>

                    <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-6 leading-none">
                        VERIFICA <span className="text-gold">RICHIESTA.</span>
                    </h1>

                    <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-10 leading-relaxed">
                        IL TUO ACCOUNT È STATO CREATO MA DEVE ESSERE ATTIVATO.
                        CONTROLLA LA TUA EMAIL (<span className="text-white">{profile.email}</span>) E CLICCA SUL LINK DI CONFERMA PER ACCEDERE AL PORTALE VŌLTA.
                    </p>

                    <div className="space-y-4">
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-white text-black py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gold transition-colors"
                        >
                            HO GIÀ CONFERMATO
                        </button>

                        <button
                            onClick={() => supabase.auth.signOut()}
                            className="w-full bg-transparent border border-white/20 text-white/40 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:text-white hover:border-white transition-all"
                        >
                            ESCI / CAMBIA ACCOUNT
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-black pt-32 pb-24 px-6 overflow-hidden flex flex-col items-center justify-center relative font-sans text-white">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full relative z-10"
                >
                    <div className="flex flex-col items-center mb-12 text-center">
                        <h1 className="text-5xl font-bold tracking-tighter uppercase leading-none italic">
                            {isSignup ? "Create" : "Access"} <span className="text-gold">Portal.</span>
                        </h1>
                        <p className="mt-4 text-[10px] uppercase tracking-[0.3em] font-medium text-white/40 italic">
                            {isSignup ? "Join the VŌLTA community" : "Insert your VŌLTA credentials"}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-6 bg-white/5 p-10 border border-white/10 rounded-sm backdrop-blur-xl">
                        {authMessage && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className={`p-4 border text-[11px] uppercase tracking-widest font-bold ${authMessage.type === 'success' ? 'bg-gold/10 border-gold/40 text-gold' : 'bg-red-500/10 border-red-500/40 text-red-500'
                                    }`}
                            >
                                {authMessage.text}
                            </motion.div>
                        )}
                        <div className="space-y-4">
                            {isSignup && (
                                <div className="space-y-1">
                                    <label className="text-[9px] uppercase tracking-widest text-white/40 font-bold ml-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={authName}
                                        onChange={(e) => setAuthName(e.target.value)}
                                        className="w-full bg-black/40 border border-white/10 p-4 outline-none focus:border-gold transition-colors text-sm uppercase font-bold tracking-widest"
                                        placeholder="NOMINATIVO"
                                    />
                                </div>
                            )}
                            <div className="space-y-1">
                                <label className="text-[9px] uppercase tracking-widest text-white/40 font-bold ml-1">Email</label>
                                <input
                                    required
                                    type="email"
                                    value={authEmail}
                                    onChange={(e) => setAuthEmail(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 p-4 outline-none focus:border-gold transition-colors text-sm uppercase font-bold tracking-widest"
                                    placeholder="EMAIL"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[9px] uppercase tracking-widest text-white/40 font-bold ml-1">Password</label>
                                <input
                                    required
                                    type="password"
                                    value={authPassword}
                                    onChange={(e) => setAuthPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 p-4 outline-none focus:border-gold transition-colors text-sm uppercase font-bold tracking-widest"
                                    placeholder="********"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-white text-black py-5 font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-gold transition-all"
                        >
                            {isSignup ? "Create Membership" : "Sign In / Enter"}
                        </button>

                        <div className="pt-4 text-center">
                            <button
                                type="button"
                                onClick={() => setIsSignup(!isSignup)}
                                className="text-[9px] text-white/40 uppercase tracking-widest font-bold hover:text-gold transition-colors"
                            >
                                {isSignup ? "Già registrato? Accedi" : "Nuovo membro? Registrati ora"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-32 pb-24 px-6 md:px-12 font-sans text-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 border-b border-white/5 pb-10">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <span className="w-12 h-[1px] bg-gold" />
                            <span className="text-[9px] uppercase font-bold tracking-[0.5em] text-gold">
                                {role === "user" ? "Private Member Area" : "Operational Command Center"}
                            </span>
                        </motion.div>
                        <h1 className="text-4xl md:text-7xl font-bold uppercase tracking-tighter leading-none italic">
                            {role === "user" ? `Bentornato, ${profile?.name || user?.email}` : "Management Hub"}
                        </h1>
                    </div>

                    <button
                        onClick={() => supabase.auth.signOut()}
                        className="flex items-center gap-2 group text-[10px] uppercase font-bold tracking-widest text-white/20 hover:text-white transition-colors border border-white/10 px-6 py-3"
                    >
                        <span>Fine Sessione</span>
                        <LogOut size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                {role === "admin" || role === "venue" ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-7 flex flex-col gap-10">
                            <div className="flex justify-between items-center bg-white/[0.02] p-8 border border-white/5 backdrop-blur-sm">
                                <h2 className="text-2xl font-bold uppercase tracking-tighter flex items-center gap-4">
                                    <Activity className="text-gold" size={24} />
                                    Eventi Globali
                                </h2>
                                <button
                                    onClick={() => { setEditingEvent(null); setShowEventModal(true); setImagePreview(null); }}
                                    className="bg-gold text-black text-[10px] font-bold uppercase px-8 py-3 tracking-widest hover:invert transition-all transform active:scale-95"
                                >
                                    CREA EVENTO
                                </button>
                            </div>

                            <div className="flex flex-col gap-4">
                                {isLoading ? (
                                    <div className="p-8 border border-white/5 bg-white/[0.01] animate-pulse h-32" />
                                ) : events.length > 0 ? (
                                    events.map((event) => (
                                        <div
                                            key={event.id}
                                            onClick={() => setSelectedEventId(event.id)}
                                            className={`p-8 border transition-all cursor-pointer group ${selectedEventId === event.id ? 'border-gold bg-gold/5' : 'border-white/5 bg-white/[0.01] hover:border-white/20'}`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-gold mb-2">{event.date} • {event.location}</p>
                                                    <h3 className="text-2xl font-bold uppercase tracking-tighter">{event.title}</h3>
                                                    <div className="flex items-center gap-4 mt-4">
                                                        <p className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-2">
                                                            <Users size={12} className="text-gold/40" />
                                                            {event.regsCount || 0} / {event.regLimit} Booking
                                                        </p>
                                                        {event.isSoldOut && (
                                                            <span className="text-[8px] font-bold px-2 py-0.5 border border-red-500/50 text-red-500 uppercase">Sold Out</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setEditingEvent(event); setShowEventModal(true); }}
                                                        className="p-3 border border-white/10 hover:border-white/40 text-white/40 hover:text-white transition-all bg-white/5"
                                                    >
                                                        <Edit size={16} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteEvent(event.id);
                                                        }}
                                                        className="p-3 border border-white/10 hover:border-red-500/50 text-white/40 hover:text-red-500 transition-all bg-white/5"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-20 border border-dotted border-white/10 text-center opacity-20">
                                        <p className="text-xs uppercase tracking-widest">Nessun evento presente nel database.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lg:col-span-5 border border-white/10 bg-white/[0.01] flex flex-col p-8 md:p-10 min-h-[600px] relative overflow-hidden backdrop-blur-xl">
                            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                <QrCode size={120} />
                            </div>

                            {!selectedEventId ? (
                                <div className="flex-grow flex flex-col items-center justify-center text-center opacity-20 py-20">
                                    <Search size={48} strokeWidth={1} className="mb-6 text-gold" />
                                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold">Seleziona un evento per caricare la lista ospiti</p>
                                </div>
                            ) : (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={selectedEventId}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="h-full flex flex-col"
                                    >
                                        <div className="mb-10 flex justify-between items-end border-b border-white/10 pb-8">
                                            <div>
                                                <h3 className="text-3xl font-bold uppercase tracking-tighter italic">VŌLTA List</h3>
                                                <p className="text-[9px] font-bold uppercase tracking-widest text-gold mt-1">Sincronizzazione Real-Time Attiva</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-2xl font-bold tracking-tighter leading-none">{registrations.length}</p>
                                                <p className="text-[8px] uppercase font-bold text-white/30 tracking-widest mt-1 italic">Total Guest</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                            {isLoadingRegs ? (
                                                <div className="flex flex-col gap-4">
                                                    {[1, 2, 3].map(i => <div key={i} className="h-16 border border-white/5 bg-white/[0.02] animate-pulse" />)}
                                                </div>
                                            ) : registrations.length > 0 ? (
                                                registrations.map((reg, idx) => (
                                                    <div key={idx} className="p-5 border border-white/5 bg-white/[0.01] flex items-center justify-between group hover:border-gold/30 hover:bg-gold/[0.02] transition-all">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[10px] font-bold opacity-30 group-hover:opacity-100 group-hover:border-gold group-hover:text-gold transition-all">
                                                                {idx + 1}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold uppercase text-xs tracking-tighter group-hover:text-gold transition-colors">{reg.userId?.name}</p>
                                                                <p className="text-[9px] text-white/20 font-medium tracking-widest">{reg.userId?.email}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-[8px] font-bold px-2 py-1 bg-white/5 text-white/40 group-hover:bg-gold group-hover:text-black transition-all">
                                                                {reg.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="py-20 text-center border border-dashed border-white/5 flex flex-col items-center gap-4">
                                                    <Users size={32} className="opacity-10" />
                                                    <p className="text-[10px] uppercase font-bold text-white/20 tracking-widest italic">Nessuna prenotazione attiva per questo evento.</p>
                                                </div>
                                            )}
                                        </div>

                                        {registrations.length > 0 && (
                                            <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                                                <button className="py-4 border border-white/10 text-[9px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all italic flex items-center justify-center gap-2">
                                                    <Download size={14} /> EXPORT GUEST LIST
                                                </button>
                                                <button className="py-4 border border-white/10 text-[9px] font-bold uppercase tracking-widest hover:bg-gold hover:text-black hover:border-gold transition-all italic flex items-center justify-center gap-2">
                                                    <Info size={14} /> LIVE ANALYTICS
                                                </button>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                        <div className="lg:col-span-12 py-20 text-center border border-white/5 bg-white/[0.01]">
                            <Shield size={64} className="mx-auto mb-8 text-gold/20" />
                            <h2 className="text-3xl font-bold uppercase tracking-tighter mb-4 italic">Sezione Membro Attivata</h2>
                            <p className="text-xs text-white/40 uppercase tracking-widest max-w-lg mx-auto leading-relaxed">
                                Benvenuto nell'area privata VŌLTA. Le tue prenotazioni e lo storico degli eventi verranno visualizzati qui a breve.
                                Il sistema è in fase di sincronizzazione con il nuovo database globale.
                            </p>
                            <button onClick={() => router.push('/events')} className="mt-10 bg-white text-black px-10 py-4 font-bold uppercase text-[10px] tracking-widest hover:bg-gold transition-all italic">SFOGLIA EVENTI LIVE</button>
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showEventModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="bg-black border border-white/10 p-12 max-w-6xl w-full relative overflow-hidden text-white shadow-[0_0_100px_rgba(255,184,0,0.05)]"
                        >
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />

                            <div className="flex justify-between items-end mb-12">
                                <div>
                                    <h2 className="text-5xl font-bold uppercase tracking-tighter italic">
                                        {editingEvent ? "Update" : "Deploy"} <span className="text-gold">Event.</span>
                                    </h2>
                                    <p className="text-[10px] uppercase tracking-widest text-white/20 mt-2 font-bold italic">Configurazione parametri globali dell'evento</p>
                                </div>
                                <button
                                    onClick={() => setShowEventModal(false)}
                                    className="bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-500 p-3 rounded-full transition-all border border-white/5"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form className="grid grid-cols-1 md:grid-cols-3 gap-12 h-[60vh] overflow-y-auto pr-6 custom-scrollbar" onSubmit={handleSaveEvent}>
                                <div className="space-y-6 text-left">
                                    <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/60 italic border-b border-white/5 pb-4">Multimedia Assets</h3>
                                    <div
                                        className="relative aspect-[4/5] bg-white/[0.02] border border-white/10 hover:border-gold/50 transition-all group flex flex-col items-center justify-center cursor-pointer overflow-hidden backdrop-blur-sm"
                                        onClick={() => document.getElementById('imageFile')?.click()}
                                    >
                                        {(imagePreview || editingEvent?.image) ? (
                                            <>
                                                <img
                                                    src={imagePreview || editingEvent?.image}
                                                    alt="Preview"
                                                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-all duration-700 scale-105 group-hover:scale-100"
                                                />
                                                <div className="relative z-10 flex flex-col items-center gap-2 transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                    <Upload size={32} className="text-gold" />
                                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white italic">REPLACE ASSET</span>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center gap-6 text-white/10 group-hover:text-gold/60 transition-all duration-500">
                                                <ImageIcon size={64} strokeWidth={0.5} />
                                                <div className="text-center">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest italic">Upload Cover (4:5)</p>
                                                    <p className="text-[8px] uppercase tracking-tighter mt-2 opacity-50">Drag & Drop visual</p>
                                                </div>
                                            </div>
                                        )}
                                        <input
                                            id="imageFile"
                                            name="imageFile"
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) {
                                                    const url = URL.createObjectURL(file);
                                                    setImagePreview(url);
                                                }
                                            }}
                                        />
                                    </div>
                                    <p className="text-[9px] text-white/20 uppercase font-medium leading-relaxed italic">Auto-Cloudinary conversion enabled. High-res optimized for brutalist UI.</p>
                                </div>

                                <div className="md:col-span-2 space-y-12 text-left">
                                    <div className="space-y-8">
                                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/60 italic border-b border-white/5 pb-4">Core metadata</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 ml-1">Event Title</label>
                                                <input required name="title" defaultValue={editingEvent?.title} className="w-full bg-white/[0.02] border border-white/10 p-4 text-sm font-bold uppercase tracking-tighter focus:border-gold focus:bg-gold/5 outline-none transition-all placeholder:opacity-20" placeholder="E.G. UNDERGROUND SESSION" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 ml-1">Physical Location</label>
                                                <input required name="location" defaultValue={editingEvent?.location} className="w-full bg-white/[0.02] border border-white/10 p-4 text-sm font-bold uppercase tracking-tighter focus:border-gold focus:bg-gold/5 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 ml-1">Lead Artist (DJ)</label>
                                                <input required name="dj" defaultValue={editingEvent?.dj} className="w-full bg-white/[0.02] border border-white/10 p-4 text-sm font-bold uppercase tracking-tighter focus:border-gold focus:bg-gold/5 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 ml-1">Musical Narrative</label>
                                                <input required name="genre" defaultValue={editingEvent?.genre} className="w-full bg-white/[0.02] border border-white/10 p-4 text-sm font-bold uppercase tracking-tighter focus:border-gold focus:bg-gold/5 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 ml-1">Full Date String</label>
                                                <input required name="date" placeholder="Sabato, 4 Aprile" defaultValue={editingEvent?.date} className="w-full bg-white/[0.02] border border-white/10 p-4 text-sm font-bold uppercase tracking-tighter focus:border-gold focus:bg-gold/5 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 ml-1">Schedule (Time)</label>
                                                <input required name="time" placeholder="23:00 - 05:00" defaultValue={editingEvent?.time} className="w-full bg-white/[0.02] border border-white/10 p-4 text-sm font-bold uppercase tracking-tighter focus:border-gold focus:bg-gold/5 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 ml-1">Venue Partner</label>
                                                <input required name="venue" defaultValue={editingEvent?.venue} className="w-full bg-white/[0.02] border border-white/10 p-4 text-sm font-bold uppercase tracking-tighter focus:border-gold focus:bg-gold/5 outline-none transition-all" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 ml-1">Access Capacity (Reg Limit)</label>
                                                <input required name="regLimit" type="number" defaultValue={editingEvent?.regLimit} className="w-full bg-white/[0.02] border border-white/10 p-4 text-sm font-bold uppercase tracking-tighter focus:border-gold focus:bg-gold/5 outline-none transition-all" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold/60 italic border-b border-white/5 pb-4">Operational Flags</h3>
                                        <div className="grid grid-cols-2 gap-8">
                                            <label className="flex items-center gap-4 cursor-pointer group">
                                                <input type="checkbox" name="dresscode" defaultChecked={editingEvent?.dresscode} className="hidden peer" />
                                                <div className="w-6 h-6 border border-white/20 peer-checked:bg-gold peer-checked:border-gold transition-all" />
                                                <span className="text-[9px] font-bold uppercase tracking-widest group-hover:text-gold transition-colors italic">Mandatory Dresscode</span>
                                            </label>
                                            <label className="flex items-center gap-4 cursor-pointer group">
                                                <input type="checkbox" name="isSoldOut" defaultChecked={editingEvent?.isSoldOut} className="hidden peer" />
                                                <div className="w-6 h-6 border border-white/20 peer-checked:bg-red-500 peer-checked:border-red-500 transition-all" />
                                                <span className="text-[9px] font-bold uppercase tracking-widest group-hover:text-red-500 transition-colors italic">Hard Kill (Sold Out)</span>
                                            </label>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 ml-1">Extended Concept (Description)</label>
                                            <textarea name="description" rows={5} defaultValue={editingEvent?.description} className="w-full bg-white/[0.02] border border-white/10 p-4 text-sm font-bold uppercase tracking-tighter focus:border-gold focus:bg-gold/5 outline-none transition-all resize-none italic" placeholder="DESIGN THE VIBE..." />
                                        </div>

                                        <button type="submit" className="w-full bg-gold text-black font-extrabold uppercase py-6 tracking-[0.5em] hover:bg-white transition-all transform active:scale-[0.98] shadow-[0_30px_60px_rgba(255,184,0,0.15)] mt-6 text-xs italic">
                                            {editingEvent ? "SYNCHRONIZE UPDATE" : "INITIALIZE DEPLOYMENT"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function Account() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <AccountContent />
        </Suspense>
    );
}
