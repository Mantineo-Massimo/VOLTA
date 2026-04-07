"use client";

import { Suspense, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import {
    LayoutDashboard, Users, Calendar, Settings, Plus, Search,
    MoreVertical, Trash2, Edit, X, Check, Filter, Download,
    Music, MapPin, Clock, Info, Shield, LogOut, QrCode, Ticket,
    Upload, ImageIcon, ArrowRight, Activity, ShieldCheck, CheckCircle2, User,
    ChevronRight, Sparkles
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
    const [activeTab, setActiveTab] = useState<"home" | "events" | "bookings" | "users" | "settings">("events");
    const [creationStage, setCreationStage] = useState(1);
    const [eventFormData, setEventFormData] = useState<any>({});
    const [lastStageChangeTime, setLastStageChangeTime] = useState(0);
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
    const [authFirstName, setAuthFirstName] = useState("");
    const [authLastName, setAuthLastName] = useState("");
    const [authPhone, setAuthPhone] = useState("");

    // Profile Edit State
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editFirstName, setEditFirstName] = useState("");
    const [editLastName, setEditLastName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    const [editPhone, setEditPhone] = useState("");

    // Auth & UI States
    const [authMessage, setAuthMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isAuthLoading, setIsAuthLoading] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Ensure user is loaded
        if (!user?.id) {
            setAuthMessage({ type: 'error', text: "SESSIONE NON TROVATA. RICARICA LA PAGINA." });
            return;
        }

        setIsAuthLoading(true);
        setAuthMessage(null);

        try {
            // STEP 0: Get fresh user to avoid stale state
            const { data: { user: freshUser }, error: userError } = await supabase.auth.getUser();
            if (userError || !freshUser) throw new Error("SESSIONE SCADUTA O NON VALIDA.");

            // STEP 1: Update Profile Table
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    first_name: editFirstName,
                    last_name: editLastName,
                    email: editEmail,
                    phone: editPhone,
                    full_name: `${editFirstName} ${editLastName}`
                })
                .eq('id', freshUser.id);

            if (profileError) {
                console.error("Profile Update Error:", profileError);
                throw new Error("ERRORE DATABASE: " + profileError.message);
            }

            // STEP 2: Update Auth Email (if changed) - Call our BRANDED API
            if (editEmail.toLowerCase() !== freshUser.email?.toLowerCase()) {
                const response = await fetch('/api/auth/update-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ newEmail: editEmail })
                });

                const result = await response.json();
                if (!response.ok) throw new Error(result.error || "ERRORE RICHIESTA CAMBIO EMAIL");

                setAuthMessage({
                    type: 'success',
                    text: result.message || "CONTROLLA LA NUOVA EMAIL PER CONFERMARE IL CAMBIO."
                });
            } else {
                setAuthMessage({ type: 'success', text: "PROFILO AGGIORNATO CON SUCCESSO" });
            }

            // Refresh local profile state by REFETCHING (cleanest)
            const { data: updatedProfile, error: refetchError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', freshUser.id)
                .single();

            if (refetchError) {
                // If refetch fails, we can at least use local data
                setProfile({
                    ...profile,
                    first_name: editFirstName,
                    last_name: editLastName,
                    email: editEmail,
                    phone: editPhone,
                    full_name: `${editFirstName} ${editLastName}`
                });
            } else {
                setProfile(updatedProfile);
            }

            // Sync user state for auth email changed
            if (editEmail.toLowerCase() !== freshUser.email?.toLowerCase()) {
                const { data: { user: latestUser } } = await supabase.auth.getUser();
                if (latestUser) setUser(latestUser);
            }

            setIsEditingProfile(false);

        } catch (err: any) {
            console.error("Critical Profile Update Failure:", err);
            setAuthMessage({
                type: 'error',
                text: err.message?.toUpperCase() || "ERRORE SCONOSCIUTO DURANTE IL SALVATAGGIO"
            });
        } finally {
            setIsAuthLoading(false);
        }
    };

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
        } else if (msg === "email_verified") {
            setAuthMessage({ type: 'success', text: "EMAIL AGGIORNATA CON SUCCESSO. ACCEDI PURE CON IL NUOVO INDIRIZZO." });
        } else if (err === "invalid_token") {
            setAuthMessage({ type: 'error', text: "TOKEN DI VERIFICA NON VALIDO O SCADUTO." });
        } else if (err === "admin_key_missing") {
            setAuthMessage({ type: 'error', text: "ERRORE DI CONFIGURAZIONE SERVER (CHIAVE ADMIN MANCANTE)." });
        } else if (err === "auth_sync_failed") {
            setAuthMessage({ type: 'error', text: "ERRORE DURANTE LA SINCRONIZZAZIONE DELL'ACCOUNT." });
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

    const [userRegistrations, setUserRegistrations] = useState<any[]>([]);
    const [isLoadingUserRegs, setIsLoadingUserRegs] = useState(false);

    useEffect(() => {
        if (isLoggedIn && role === "user") {
            const fetchUserRegs = async () => {
                setIsLoadingUserRegs(true);
                try {
                    const { data, error } = await supabase
                        .from('registrations')
                        .select('*, events(*)')
                        .eq('user_id', user.id);

                    if (data) setUserRegistrations(data);
                    if (error) throw error;
                } catch (err) {
                    console.error("Failed to fetch user registrations");
                } finally {
                    setIsLoadingUserRegs(false);
                }
            };
            fetchUserRegs();
        }
    }, [isLoggedIn, role, user?.id]);

    useEffect(() => {
        if (selectedEventId && (role === "admin" || role === "venue")) {
            const fetchRegs = async () => {
                setIsLoadingRegs(true);
                try {
                    const { data, error } = await supabase
                        .from('registrations')
                        .select('*, profiles(full_name, email, first_name, last_name)')
                        .eq('event_id', selectedEventId);

                    if (data) {
                        const mappedData = data.map((reg: any) => ({
                            ...reg,
                            userId: reg.profiles
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

    const captureStageData = () => {
        const form = document.getElementById('creationForm') as HTMLFormElement;
        if (!form) return;
        const formData = new FormData(form);
        const newData = { ...eventFormData };
        formData.forEach((value, key) => {
            if (value instanceof File && value.size === 0) return;
            if (value !== "") newData[key] = value;
        });
        setEventFormData(newData);
    };

    const handleSaveEvent = async (e: React.FormEvent) => {
        e.preventDefault();

        // BLOCK premature submission if not on final stage
        if (creationStage < 3) {
            captureStageData();
            setCreationStage(s => s + 1);
            setLastStageChangeTime(Date.now());
            return;
        }

        // RACE CONDITION LOCK: Block if stage just changed (prevents double-click submit)
        if (Date.now() - lastStageChangeTime < 500) return;

        setAuthMessage(null);

        // Capture final stage
        const form = e.target as HTMLFormElement;
        const finalFormData = new FormData(form);
        const mergedData = { ...eventFormData };
        finalFormData.forEach((value, key) => {
            if (value instanceof File && value.size === 0) return;
            if (value !== "") mergedData[key] = value;
        });

        // Manual Recomposition of Time from Selects
        const hour = mergedData.hour;
        const minute = mergedData.minute;
        const endHour = mergedData.endHour;
        const endMinute = mergedData.endMinute;

        if (hour && minute) {
            mergedData.startTime = `${hour}:${minute}`;
        }
        if (endHour && endMinute) {
            mergedData.endTime = `${endHour}:${endMinute}`;
        }

        // Manual Validation
        const requiredFields = [
            { id: 'title', label: 'TITOLO' },
            { id: 'eventDate', label: 'DATA' },
            { id: 'hour', label: 'ORA' },
        ];

        for (const field of requiredFields) {
            if (!mergedData[field.id]) {
                setAuthMessage({ type: 'error', text: `CAMPO RICHIESTO: ${field.label}` });
                return;
            }
        }

        setIsAuthLoading(true);
        try {
            // Recompose data explicitly to match Supabase schema
            const eventData: any = {
                title: mergedData.title,
                location: mergedData.location,
                venue: mergedData.location,
                dj: mergedData.dj,
                genre: mergedData.genre,
                description: mergedData.description,
                entry_type: mergedData.entryType,
                dresscode: mergedData.dresscode,
                sold_out_type: mergedData.soldOutType,
                reg_limit: parseInt(mergedData.regLimit as string) || 0,
                is_sold_out: (mergedData.soldOutType && mergedData.soldOutType !== 'NONE'),
                // PERSIST RAW DATA for recovery in Edit mode
                event_date: mergedData.eventDate,
                start_time: mergedData.startTime || "23:00",
                end_time: mergedData.endTime || "05:00"
            };

            // Handle Date
            if (mergedData.eventDate) {
                const d = new Date(mergedData.eventDate);
                const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
                const formattedDate = d.toLocaleDateString('it-IT', options);
                eventData.date = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
            }

            // Handle Time
            const start = mergedData.startTime || "23:00";
            const end = mergedData.endTime || "05:00";
            eventData.time = `${start} - ${end}`;

            // Handle Image
            let finalImageUrl = editingEvent?.image || "/assets/DSC_0036.JPG";

            if (mergedData.imageFile instanceof File && mergedData.imageFile.size > 0) {
                try {
                    const file = mergedData.imageFile;
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
                    const filePath = fileName;

                    const { error: uploadError } = await supabase.storage
                        .from('events')
                        .upload(filePath, file);

                    if (uploadError) {
                        console.error("Supabase Storage error", uploadError);
                        throw new Error(`ERRORE STORAGE: ${uploadError.message}. Verifica le 'Policies' del bucket 'events'.`);
                    }

                    const { data: { publicUrl } } = supabase.storage
                        .from('events')
                        .getPublicUrl(filePath);

                    finalImageUrl = publicUrl;
                } catch (storageErr: any) {
                    console.error("Storage connection error", storageErr);
                    throw new Error(storageErr.message || "Errore durante il caricamento su Supabase Storage.");
                }
            } else if (imagePreview && imagePreview.startsWith('http')) {
                finalImageUrl = imagePreview;
            } else if (editingEvent?.image) {
                finalImageUrl = editingEvent.image;
            }

            eventData.image = finalImageUrl;

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

            setAuthMessage({ type: 'success', text: editingEvent ? "MEMORIA AGGIORNATA!" : "EVENTO PUBBLICATO CON SUCCESSO!" });

            setTimeout(() => {
                setShowEventModal(false);
                setEditingEvent(null);
                setImagePreview(null);
                setAuthMessage(null);
                setCreationStage(1);
                setEventFormData({});
            }, 1500);
        } catch (err: any) {
            console.error("Failed to save event", err);
            setAuthMessage({ type: 'error', text: "ERRORE FATALE: " + (err.message || "Errore sconosciuto durante il salvataggio.") });
        } finally {
            setIsAuthLoading(false);
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

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsAuthLoading(true);

        if (isSignup) {
            try {
                setAuthMessage({ type: 'success', text: "CREAZIONE ACCOUNT IN CORSO..." });

                const response = await fetch("/api/auth/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: authEmail,
                        password: authPassword,
                        first_name: authFirstName,
                        last_name: authLastName,
                        phone: authPhone
                    })
                });

                const data = await response.json();

                if (!response.ok) throw new Error(data.error || "Errore durante la registrazione");

                setAuthMessage({
                    type: 'success',
                    text: "MEMBERSHIP CREATA. BENVENUTO NEL CLUB. CONTROLLA LA TUA EMAIL."
                });

                setAuthFirstName("");
                setAuthLastName("");
                setAuthPhone("");

                setIsSignup(false);
                setAuthMessage({
                    type: 'success',
                    text: "MEMBERSHIP CREATA. ORA PUOI ACCEDERE CON LE TUE CREDENZIALI."
                });
            } catch (err: any) {
                setAuthMessage({ type: 'error', text: err.message?.toUpperCase() || "ERRORE DURANTE LA REGISTRAZIONE" });
            } finally {
                setIsAuthLoading(false);
            }
        } else {
            const { error } = await supabase.auth.signInWithPassword({
                email: authEmail,
                password: authPassword,
            });
            if (error) {
                setAuthMessage({ type: 'error', text: "Credenziali non valide: " + error.message });
            }
            setIsAuthLoading(false);
        }
    };

    // --- SIDEBAR RENDERER ---

    const renderSidebar = () => {
        const menuItems = [
            { id: 'home' as const, label: 'HOME', icon: LayoutDashboard },
            { id: 'events' as const, label: 'EVENTI', icon: Calendar },
            { id: 'bookings' as const, label: 'PRENOTAZIONI', icon: Ticket },
            { id: 'users' as const, label: 'UTENTI', icon: Users },
            { id: 'settings' as const, label: 'IMPOSTAZIONI', icon: Settings },
        ];

        return (
            <div className="flex flex-col gap-3">
                <div className="mb-6 px-2">
                    <p className="text-[8px] font-black uppercase tracking-[0.5em] text-white/20 italic">Command Center</p>
                </div>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`flex items-center gap-4 px-6 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all border backdrop-blur-xl ${activeTab === item.id
                            ? 'bg-gold text-black border-gold shadow-[0_20px_50px_rgba(255,184,0,0.15)] translate-x-2'
                            : 'bg-white/[0.02] text-white/30 border-white/5 hover:border-white/20 hover:text-white hover:translate-x-1'
                            }`}
                    >
                        <item.icon size={16} />
                        <span className="italic">{item.label}</span>
                    </button>
                ))}

                <button
                    onClick={() => supabase.auth.signOut()}
                    className="mt-12 flex items-center gap-4 px-6 py-5 text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-white/5 text-white/20 hover:text-red-500 hover:border-red-500/30 bg-white/[0.01]"
                >
                    <LogOut size={16} />
                    <span className="italic">Fine Sessione</span>
                </button>
            </div>
        );
    };

    const renderHome = () => (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                    { label: "Active Events", value: events.length, icon: Calendar },
                    { label: "Total Bookings", value: "2.4K", icon: Ticket },
                    { label: "VŌLTA Members", value: "850", icon: Users },
                    { label: "Live Traffic", value: "12", icon: Activity },
                ].map((stat, i) => (
                    <div key={i} className="p-8 border border-white/10 bg-white/[0.02] backdrop-blur-xl group hover:border-gold/30 transition-all">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 mb-4 flex items-center gap-2">
                            <stat.icon size={12} className="text-gold/50" /> {stat.label}
                        </p>
                        <h4 className="text-5xl font-black italic tracking-tighter text-white group-hover:text-gold transition-colors">{stat.value}</h4>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="p-10 border border-white/10 bg-white/[0.01] min-h-[400px]">
                    <h3 className="text-xl font-bold uppercase tracking-tighter flex items-center gap-4 mb-10">
                        <Activity className="text-gold" size={20} />
                        Platform Activity
                    </h3>
                    <div className="space-y-6 opacity-30">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="flex items-center gap-6 border-b border-white/5 pb-6">
                                <div className="w-2 h-2 bg-gold rounded-full" />
                                <div className="flex-grow h-4 bg-white/5" />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="p-10 border border-white/10 bg-white/[0.01]">
                    <h3 className="text-xl font-bold uppercase tracking-tighter flex items-center gap-4 mb-10">
                        <LogOut className="text-gold" size={20} />
                        Quick Access
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setActiveTab('events')} className="p-6 border border-white/5 hover:border-gold/50 transition-all text-[10px] font-bold uppercase tracking-widest text-left">Deploy New Event</button>
                        <button onClick={() => setActiveTab('bookings')} className="p-6 border border-white/5 hover:border-gold/50 transition-all text-[10px] font-bold uppercase tracking-widest text-left">Audit Registrations</button>
                        <button onClick={() => setActiveTab('users')} className="p-6 border border-white/5 hover:border-gold/50 transition-all text-[10px] font-bold uppercase tracking-widest text-left">Manage Staff</button>
                        <button onClick={() => setActiveTab('settings')} className="p-6 border border-white/5 hover:border-gold/50 transition-all text-[10px] font-bold uppercase tracking-widest text-left">System Config</button>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    const renderEvents = () => (
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
                                                {event.regs_count || 0} / {event.reg_limit || 0} Booking
                                            </p>
                                            {event.sold_out_type !== 'NONE' && (
                                                <span className="text-[8px] font-bold px-2 py-0.5 border border-red-500/50 text-red-500 uppercase">
                                                    SOLD OUT {event.sold_out_type}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setImagePreview(null);
                                                setEditingEvent(event);
                                                setShowEventModal(true);
                                            }}
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
                                    <h3 className="text-3xl font-bold uppercase tracking-tighter italic">Guest List</h3>
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
                                                    <p className="font-bold uppercase text-xs tracking-tighter group-hover:text-gold transition-colors">{reg.userId?.first_name} {reg.userId?.last_name}</p>
                                                    <p className="text-[9px] text-white/20 font-medium tracking-widest">{reg.userId?.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[8px] font-bold px-2 py-1 bg-white/5 text-white/40 group-hover:bg-gold group-hover:text-black transition-all uppercase">
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
                                        <Download size={14} /> EXPORT LIST
                                    </button>
                                    <button className="py-4 border border-white/10 text-[9px] font-bold uppercase tracking-widest hover:bg-gold hover:text-black hover:border-gold transition-all italic flex items-center justify-center gap-2">
                                        <Activity size={14} /> METRICS
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );

    const renderBookings = () => (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-20 border border-dotted border-white/10 text-center opacity-20">
            <Ticket size={48} className="mx-auto mb-6 text-gold" />
            <h3 className="text-xl font-bold uppercase tracking-[0.3em] mb-4">Registro Prenotazioni</h3>
            <p className="text-xs uppercase tracking-widest italic">Modulo in fase di configurazione operativa.</p>
        </motion.div>
    );

    const renderUsers = () => (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-20 border border-dotted border-white/10 text-center opacity-20">
            <Users size={48} className="mx-auto mb-6 text-gold" />
            <h3 className="text-xl font-bold uppercase tracking-[0.3em] mb-4">Gestione Utenti</h3>
            <p className="text-xs uppercase tracking-widest italic">Interfaccia di amministrazione utenti in sviluppo.</p>
        </motion.div>
    );

    const renderSettings = () => (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto p-12 border border-white/5 bg-white/[0.01]">
            <h3 className="text-xl font-bold uppercase tracking-tighter flex items-center gap-4 mb-10">
                <Settings className="text-gold" size={20} />
                Global Config
            </h3>
            <div className="space-y-8">
                <div className="flex justify-between items-center border-b border-white/5 pb-6">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Maintenance Mode</p>
                        <p className="text-xs text-white/20 mt-1">Hide platform to non-admin users</p>
                    </div>
                    <div className="w-12 h-6 bg-white/5 rounded-full flex items-center px-1 border border-white/10">
                        <div className="w-4 h-4 bg-white/20 rounded-full" />
                    </div>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-6">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">Public Registration</p>
                        <p className="text-xs text-white/20 mt-1">Allow new user signups</p>
                    </div>
                    <div className="w-12 h-6 bg-gold/20 rounded-full flex items-center px-1 border border-gold/40 justify-end">
                        <div className="w-4 h-4 bg-gold rounded-full" />
                    </div>
                </div>
                <button className="w-full py-4 bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-black transition-all">Update System Parameters</button>
            </div>
        </motion.div>
    );

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
                        CONTROLLA LA TUA EMAIL (<span className="text-white">{profile?.email || '...'}</span>) E CLICCA SUL LINK DI CONFERMA PER ACCEDERE AL PORTALE VŌLTA.
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
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] uppercase tracking-widest text-white/40 font-bold ml-1">Nome</label>
                                            <input
                                                required
                                                type="text"
                                                value={authFirstName}
                                                onChange={(e) => setAuthFirstName(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 p-4 outline-none focus:border-gold transition-colors text-sm uppercase font-bold tracking-widest"
                                                placeholder="NOME"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] uppercase tracking-widest text-white/40 font-bold ml-1">Cognome</label>
                                            <input
                                                required
                                                type="text"
                                                value={authLastName}
                                                onChange={(e) => setAuthLastName(e.target.value)}
                                                className="w-full bg-black/40 border border-white/10 p-4 outline-none focus:border-gold transition-colors text-sm uppercase font-bold tracking-widest"
                                                placeholder="COGNOME"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[9px] uppercase tracking-widest text-white/40 font-bold ml-1">Telefono</label>
                                        <input
                                            required
                                            type="tel"
                                            value={authPhone}
                                            onChange={(e) => setAuthPhone(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 p-4 outline-none focus:border-gold transition-colors text-sm uppercase font-bold tracking-widest"
                                            placeholder="+39 3XX XXXXXXX"
                                        />
                                    </div>
                                </>
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
                            disabled={isAuthLoading}
                            className="w-full bg-white text-black py-5 font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-gold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isAuthLoading ? "CARICAMENTO..." : (isSignup ? "Create Membership" : "Sign In / Enter")}
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
                <AnimatePresence>
                    {authMessage && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className={`mb-12 p-6 border text-[11px] uppercase tracking-widest font-bold flex justify-between items-center backdrop-blur-xl ${authMessage.type === 'success' ? 'bg-gold/10 border-gold/40 text-gold shadow-[0_0_50px_rgba(255,184,0,0.1)]' : 'bg-red-500/10 border-red-500/40 text-red-500 shadow-[0_0_50px_rgba(239,68,68,0.1)]'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                {authMessage.type === 'success' ? <CheckCircle2 size={16} /> : <Info size={16} />}
                                <span className="italic">{authMessage.text}</span>
                            </div>
                            <button onClick={() => setAuthMessage(null)} className="opacity-40 hover:opacity-100 transition-opacity p-2">
                                <X size={16} />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
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
                            {role === "user" ? (
                                <>BENTORNATO,<br /> <span className="text-gold">{profile?.first_name} {profile?.last_name}</span></>
                            ) : "Management Hub"}
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
                        {/* Sidebar Column */}
                        <div className="lg:col-span-3">
                            <div className="sticky top-40">
                                {renderSidebar()}
                            </div>
                        </div>

                        {/* Content Column */}
                        <div className="lg:col-span-9">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                                >
                                    <div className="mb-12 border-b border-white/5 pb-8 flex justify-between items-end">
                                        <h2 className="text-5xl font-black italic tracking-tighter uppercase leading-none">
                                            {activeTab === 'home' && 'HOME'}
                                            {activeTab === 'events' && 'EVENTI'}
                                            {activeTab === 'bookings' && 'PRENOTAZIONI'}
                                            {activeTab === 'users' && 'UTENTI'}
                                            {activeTab === 'settings' && 'IMPOSTAZIONI'}
                                            <span className="text-gold ml-2">Section.</span>
                                        </h2>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-white/20 italic">VŌLTA Admin System v1.2</p>
                                    </div>

                                    {activeTab === 'home' && renderHome()}
                                    {activeTab === 'events' && renderEvents()}
                                    {activeTab === 'bookings' && renderBookings()}
                                    {activeTab === 'users' && renderUsers()}
                                    {activeTab === 'settings' && renderSettings()}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT COL: Digital Member Card & Profile */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* Member Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative aspect-[1.6/1] bg-gradient-to-br from-white/10 to-transparent border border-white/20 p-8 overflow-hidden group backdrop-blur-3xl"
                            >
                                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold/10 blur-[50px] rounded-full" />

                                <div className="relative h-full flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">VŌLTA MEMBER ID</div>
                                        <ShieldCheck size={20} className="text-gold" />
                                    </div>

                                    <div>
                                        <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-2">
                                            {profile?.first_name || profile?.full_name?.split(' ')[0]} {profile?.last_name || profile?.full_name?.split(' ')[1]}
                                        </h2>
                                        <p className="text-[9px] font-mono tracking-widest text-gold/80 uppercase">
                                            VOLTA-{profile?.id?.substring(0, 8).toUpperCase()}-{new Date().getFullYear()}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-end">
                                        <div className="text-[8px] uppercase tracking-[0.2em] text-white/30 font-bold">
                                            STATUS: <span className="text-white">ACTIVE MEMBER</span>
                                        </div>
                                        <div className="text-[10px] font-black italic tracking-widest">
                                            PLATFORM <span className="text-gold">ACCESS</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Profile Details Card */}
                            <div className="bg-white/[0.02] border border-white/5 p-8 backdrop-blur-xl group hover:border-white/10 transition-colors">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40 flex items-center gap-2">
                                        <User size={12} className="text-gold" /> DATI ACCOUNT
                                    </h3>
                                    {!isEditingProfile ? (
                                        <button
                                            onClick={() => {
                                                setEditFirstName(profile?.first_name || "");
                                                setEditLastName(profile?.last_name || "");
                                                setEditEmail(profile?.email || "");
                                                setEditPhone(profile?.phone || "");
                                                setIsEditingProfile(true);
                                            }}
                                            className="text-[9px] font-bold uppercase tracking-widest text-gold hover:text-white transition-colors flex items-center gap-1"
                                        >
                                            <Edit size={10} /> EDIT
                                        </button>
                                    ) : (
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setIsEditingProfile(false)}
                                                className="text-[9px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-colors"
                                            >
                                                CANCEL
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {isEditingProfile ? (
                                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <label className="text-[8px] uppercase tracking-widest text-white/20">Nome</label>
                                                    <input
                                                        required
                                                        value={editFirstName}
                                                        onChange={(e) => setEditFirstName(e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 p-2 text-xs font-bold uppercase tracking-widest focus:border-gold outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[8px] uppercase tracking-widest text-white/20">Cognome</label>
                                                    <input
                                                        required
                                                        value={editLastName}
                                                        onChange={(e) => setEditLastName(e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 p-2 text-xs font-bold uppercase tracking-widest focus:border-gold outline-none"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] uppercase tracking-widest text-white/20">Email</label>
                                                <input
                                                    required
                                                    type="email"
                                                    value={editEmail}
                                                    onChange={(e) => setEditEmail(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 p-2 text-xs font-bold uppercase tracking-widest focus:border-gold outline-none"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-[8px] uppercase tracking-widest text-white/20">Telefono</label>
                                                <input
                                                    required
                                                    value={editPhone}
                                                    onChange={(e) => setEditPhone(e.target.value)}
                                                    className="w-full bg-white/5 border border-white/10 p-2 text-xs font-bold uppercase tracking-widest focus:border-gold outline-none"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={isAuthLoading}
                                                className="w-full bg-gold text-black py-3 text-[9px] font-black uppercase tracking-widest hover:bg-white transition-colors"
                                            >
                                                {isAuthLoading ? "SALVATAGGIO..." : "SALVA MODIFICHE"}
                                            </button>
                                        </form>
                                    ) : (
                                        <>
                                            <div>
                                                <p className="text-[8px] uppercase tracking-widest text-white/20 mb-1">Email Registrata</p>
                                                <p className="text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2 truncate">{profile?.email}</p>
                                            </div>
                                            <div>
                                                <p className="text-[8px] uppercase tracking-widest text-white/20 mb-1">Recapito Telefonico</p>
                                                <p className="text-xs font-bold uppercase tracking-widest border-b border-white/5 pb-2 text-white/60">
                                                    {profile?.phone || "DATO NON DISPONIBILE"}
                                                </p>
                                            </div>
                                            <div className="pt-2">
                                                <p className="text-[8px] uppercase tracking-widest text-white/20 mb-2">Member Since</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white italic">{new Intl.DateTimeFormat('it-IT', { month: 'long', year: 'numeric' }).format(new Date())}</span>
                                                    <div className="w-1 h-1 bg-gold rounded-full" />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COL: Personal Registrations / Activity */}
                        <div className="lg:col-span-8 flex flex-col gap-8">
                            <div className="bg-white/[0.01] border border-white/10 p-10 backdrop-blur-2xl relative overflow-hidden flex-grow group hover:border-white/20 transition-colors">
                                <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:opacity-[0.05] transition-opacity">
                                    <Activity size={200} />
                                </div>
                                <div className="flex justify-between items-end mb-12 relative z-10">
                                    <div>
                                        <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Le Mie <span className="text-gold">Prenotazioni.</span></h2>
                                        <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/20 mt-3">Storico Partecipazioni e Ticket Attivi</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black tracking-tighter italic leading-none">{userRegistrations.length}</p>
                                        <p className="text-[8px] uppercase font-bold tracking-widest text-gold/60 mt-1">Prenotazioni</p>
                                    </div>
                                </div>

                                <div className="space-y-4 relative z-10">
                                    {isLoadingUserRegs ? (
                                        <div className="animate-pulse space-y-4">
                                            {[1, 2].map(i => (
                                                <div key={i} className="h-24 bg-white/5 border border-white/5 rounded-none" />
                                            ))}
                                        </div>
                                    ) : userRegistrations.length > 0 ? (
                                        userRegistrations.map((reg) => (
                                            <div
                                                key={reg.id}
                                                className="group/item flex flex-col md:flex-row md:items-center justify-between p-6 bg-black/40 border border-white/10 hover:border-gold/40 hover:bg-gold/[0.02] transition-all cursor-default"
                                            >
                                                <div className="flex items-center gap-6">
                                                    <div className="w-12 h-12 bg-gold/10 flex flex-col items-center justify-center border border-gold/20 group-hover/item:bg-gold/20 transition-colors">
                                                        <Calendar size={18} className="text-gold" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black uppercase tracking-widest group-hover/item:text-gold transition-colors">
                                                            {reg.events?.title || "Evento Speciale"}
                                                        </h4>
                                                        <p className="text-[9px] uppercase tracking-widest text-white/40 mt-1 flex items-center gap-2">
                                                            <MapPin size={10} /> {reg.events?.venue || "TBA"} • {reg.events?.date || reg.events?.created_at?.split('T')[0]}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-4 md:mt-0 flex items-center gap-6 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                                                    <div className="text-right hidden md:block">
                                                        <p className="text-[8px] uppercase font-bold tracking-widest text-white/20">Status</p>
                                                        <p className="text-[10px] font-black uppercase text-green-500 tracking-widest italic flex items-center gap-2">
                                                            <CheckCircle2 size={10} /> Confermato
                                                        </p>
                                                    </div>
                                                    <Ticket size={24} className="text-white/10 group-hover/item:text-gold transition-colors" />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-24 border border-dotted border-white/10 opacity-20 text-center group-hover:opacity-40 transition-opacity">
                                            <Search size={40} className="mb-4 text-gold" />
                                            <p className="text-[10px] uppercase font-bold tracking-[0.2em] mb-4">Ancora nessuna prenotazione attiva.</p>
                                            <button
                                                onClick={() => router.push('/events')}
                                                className="bg-white text-black px-6 py-3 text-[9px] font-black uppercase tracking-[0.3em] hover:bg-gold transition-colors"
                                            >
                                                Sfoglia Eventi
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {showEventModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 bg-black/95 backdrop-blur-2xl overflow-hidden">
                        <motion.div
                            initial={{ opacity: 0, scale: 1.05 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                            className="bg-black/40 border-y md:border border-white/10 w-full h-full md:h-[90vh] max-w-[1600px] relative overflow-hidden text-white shadow-[0_0_150px_rgba(255,184,0,0.05)] flex flex-col md:flex-row"
                        >
                            {/* Left Side: Creation Form */}
                            <div className="flex-1 flex flex-col h-full border-r border-white/10 relative z-10 bg-black/40 backdrop-blur-md">
                                <div className="p-8 md:p-12 flex justify-between items-center border-b border-white/5">
                                    <div>
                                        <h2 className="text-4xl font-black uppercase tracking-tighter italic leading-none flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full border border-gold flex items-center justify-center text-xs font-black not-italic text-gold italic">0{creationStage}</div>
                                            DEPLOY <span className="text-gold">COMMAND.</span>
                                        </h2>
                                        <p className="text-[10px] uppercase tracking-[0.4em] text-white/20 mt-3 font-bold italic">VŌLTA Operational Protocol v2.1</p>
                                    </div>
                                    <button
                                        onClick={() => { setShowEventModal(false); setCreationStage(1); }}
                                        className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-red-500 hover:text-white transition-all border border-white/5"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
                                    {authMessage && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`mb-10 p-5 border text-[10px] uppercase tracking-[0.2em] font-black flex justify-between items-center shadow-xl ${authMessage.type === 'success' ? 'bg-gold/10 border-gold/40 text-gold' : 'bg-red-500/10 border-red-500/40 text-red-500'}`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <CheckCircle2 size={16} />
                                                <span>{authMessage.text}</span>
                                            </div>
                                            <button onClick={() => setAuthMessage(null)} className="opacity-40 hover:opacity-100 transition-opacity p-2">
                                                <X size={16} />
                                            </button>
                                        </motion.div>
                                    )}
                                    <form id="creationForm" onSubmit={handleSaveEvent} className="space-y-12">
                                        <AnimatePresence mode="wait">
                                            {creationStage === 1 && (
                                                <motion.div
                                                    key="stage1"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="space-y-10"
                                                >
                                                    <div className="space-y-2">
                                                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-gold italic">Phase 01</span>
                                                        <h3 className="text-3xl font-black uppercase tracking-tighter italic">THE VIBE & AESTHETICS.</h3>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-8">
                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Event Master Title</label>
                                                            <input name="title" required placeholder="E.G. MIDNIGHT GARDEN" className="w-full bg-white/[0.03] border border-white/10 p-6 text-2xl font-black uppercase tracking-tighter focus:border-gold focus:bg-gold/[0.02] outline-none transition-all placeholder:text-white/5" defaultValue={editingEvent?.title} />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-8">
                                                            <div className="space-y-3">
                                                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Lead DJ / Artist</label>
                                                                <input name="dj" required placeholder="E.G. MARCO M." className="w-full bg-white/[0.03] border border-white/10 p-5 text-sm font-bold uppercase tracking-widest focus:border-gold outline-none transition-all" defaultValue={editingEvent?.dj} />
                                                            </div>
                                                            <div className="space-y-3">
                                                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Musical Genre</label>
                                                                <input name="genre" required placeholder="E.G. TECH HOUSE" className="w-full bg-white/[0.03] border border-white/10 p-5 text-sm font-bold uppercase tracking-widest focus:border-gold outline-none transition-all" defaultValue={editingEvent?.genre} />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-4">
                                                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Hero Asset (Cover)</label>
                                                            <div
                                                                onClick={() => document.getElementById('imageFile')?.click()}
                                                                className="relative aspect-video md:aspect-[21/9] bg-white/[0.02] border border-white/10 border-dashed hover:border-gold/50 transition-all group flex flex-col items-center justify-center cursor-pointer overflow-hidden backdrop-blur-sm"
                                                            >
                                                                {imagePreview || editingEvent?.image ? (
                                                                    <img src={imagePreview || editingEvent?.image} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-all duration-700" alt="Preview" />
                                                                ) : null}
                                                                <div className="relative z-10 flex flex-col items-center gap-4 text-white/20 group-hover:text-gold transition-all">
                                                                    <Upload size={32} strokeWidth={1.5} />
                                                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Carica Visual Optimizato</span>
                                                                </div>
                                                                <input id="imageFile" name="imageFile" type="file" className="hidden" accept="image/*" onChange={(e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (file) setImagePreview(URL.createObjectURL(file));
                                                                }} />
                                                            </div>
                                                            <p className="text-[8px] text-white/20 uppercase tracking-widest font-bold text-center italic">Best performance: 16:9 or 21:9 Wide Format</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {creationStage === 2 && (
                                                <motion.div
                                                    key="stage2"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="space-y-10"
                                                >
                                                    <div className="space-y-2">
                                                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-gold italic">Phase 02</span>
                                                        <h3 className="text-3xl font-black uppercase tracking-tighter italic">LOGISTICS & SYNC.</h3>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-8">
                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Event Date (CALENDAR)</label>
                                                            <input type="date" name="eventDate" required className="w-full bg-white/[0.03] border border-white/10 p-6 text-2xl font-black uppercase tracking-tighter focus:border-gold outline-none transition-all [color-scheme:dark]" defaultValue={editingEvent?.event_date} />
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-8">
                                                            <div className="space-y-3">
                                                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Physical Location</label>
                                                                <input name="location" required placeholder="E.G. MESSINA" className="w-full bg-white/[0.03] border border-white/10 p-5 text-sm font-bold uppercase tracking-widest focus:border-gold outline-none transition-all" defaultValue={editingEvent?.location} />
                                                            </div>
                                                            <div className="space-y-3">
                                                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Max Capacity</label>
                                                                <input name="regLimit" type="number" required placeholder="E.G. 500" className="w-full bg-white/[0.03] border border-white/10 p-5 text-sm font-bold uppercase tracking-widest focus:border-gold outline-none transition-all" defaultValue={editingEvent?.reg_limit} />
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Opening Hours (24H Format)</label>
                                                            <div className="grid grid-cols-4 gap-4">
                                                                <select name="hour" defaultValue={editingEvent?.start_time?.split(':')[0] || "23"} className="bg-black border border-white/10 p-5 text-sm font-bold uppercase tracking-widest focus:border-gold outline-none transition-all cursor-pointer">
                                                                    {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
                                                                </select>
                                                                <select name="minute" defaultValue={editingEvent?.start_time?.split(':')[1] || "00"} className="bg-black border border-white/10 p-5 text-sm font-bold uppercase tracking-widest focus:border-gold outline-none transition-all cursor-pointer">
                                                                    {['00', '15', '30', '45'].map(m => <option key={m} value={m}>{m}</option>)}
                                                                </select>
                                                                <select name="endHour" defaultValue={editingEvent?.end_time?.split(':')[0] || "05"} className="bg-black border border-white/10 p-5 text-sm font-bold uppercase tracking-widest focus:border-red-500/50 text-white/40 outline-none transition-all cursor-pointer">
                                                                    {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
                                                                </select>
                                                                <select name="endMinute" defaultValue={editingEvent?.end_time?.split(':')[1] || "00"} className="bg-black border border-white/10 p-5 text-sm font-bold uppercase tracking-widest focus:border-red-500/50 text-white/40 outline-none transition-all cursor-pointer">
                                                                    {['00', '15', '30', '45'].map(m => <option key={m} value={m}>{m}</option>)}
                                                                </select>
                                                            </div>
                                                            <p className="text-[8px] text-white/20 uppercase tracking-widest font-bold mt-2 ml-1 italic">Left: Start Time • Right: End Time (Estimated)</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                            {creationStage === 3 && (
                                                <motion.div
                                                    key="stage3"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    className="space-y-10"
                                                >
                                                    <div className="space-y-2">
                                                        <span className="text-[9px] font-black uppercase tracking-[0.5em] text-gold italic">Phase 03</span>
                                                        <h3 className="text-3xl font-black uppercase tracking-tighter italic">POLICIES & DEPLOYMENT.</h3>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-8">
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                            <div className="space-y-3">
                                                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Dresscode Requirements</label>
                                                                <input name="dresscode" placeholder="E.G. TOTAL BLACK" className="w-full bg-white/[0.03] border border-white/10 p-5 text-sm font-bold uppercase tracking-widest focus:border-gold outline-none transition-all" defaultValue={editingEvent?.dresscode} />
                                                            </div>
                                                            <div className="space-y-3">
                                                                <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Deployment Status</label>
                                                                <select name="soldOutType" defaultValue={editingEvent?.sold_out_type || 'NONE'} className="w-full bg-black border border-white/10 p-5 text-sm font-bold uppercase tracking-widest focus:border-gold outline-none transition-all cursor-pointer">
                                                                    <option value="NONE">OPEN (DISPONIBILE)</option>
                                                                    <option value="TAVOLI">SOLD OUT TAVOLI</option>
                                                                    <option value="LISTA">SOLD OUT LISTA</option>
                                                                    <option value="COMPLETO">SOLD OUT COMPLETO</option>
                                                                </select>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <label className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-1">Extended Vibe Description (Narrative)</label>
                                                            <textarea name="description" rows={6} placeholder="DESCRIBE THE NIGHT..." className="w-full bg-white/[0.03] border border-white/10 p-6 text-sm font-medium tracking-widest focus:border-gold outline-none transition-all resize-none italic" defaultValue={editingEvent?.description} />
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <div className="pt-8 border-t border-white/5 flex gap-4">
                                            {creationStage > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => { captureStageData(); setCreationStage(s => s - 1); }}
                                                    className="px-10 py-5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/10 transition-all italic"
                                                >
                                                    Back
                                                </button>
                                            )}

                                            {creationStage < 3 ? (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        captureStageData();
                                                        setCreationStage(s => s + 1);
                                                        setLastStageChangeTime(Date.now());
                                                    }}
                                                    className="flex-grow bg-white text-black px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-gold transition-all italic flex items-center justify-between"
                                                >
                                                    Procedere al prossimo stadio
                                                    <ChevronRight size={16} />
                                                </button>
                                            ) : (
                                                <button
                                                    type="submit"
                                                    disabled={isAuthLoading}
                                                    className="flex-grow bg-gold text-black px-10 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-[0.98] transition-all italic border border-gold flex items-center justify-between shadow-[0_20px_50px_rgba(255,184,0,0.2)]"
                                                >
                                                    {isAuthLoading ? "SYNCHRONIZING..." : (editingEvent ? "SYNCHRONIZE UPDATE" : "INITIALIZE FINAL DEPLOYMENT")}
                                                    <ShieldCheck size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </form>
                                </div>
                            </div>

                            {/* Right Side: Visualizer / Preview */}
                            <div className="hidden lg:flex w-[40%] bg-white/[0.02] relative overflow-hidden flex-col">
                                <div className="absolute inset-0 bg-[#0A0A0A] z-0" />
                                <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-30" />

                                <div className="relative z-10 p-12 h-full flex flex-col">
                                    <div className="mb-12">
                                        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic">Live Visualizer</p>
                                        <div className="w-12 h-[1px] bg-gold mt-4" />
                                    </div>

                                    <div className="flex-grow flex items-center justify-center">
                                        <div className="w-full max-w-sm group">
                                            <div className="relative aspect-[4/5] overflow-hidden border border-white/10 shadow-2xl">
                                                {imagePreview || editingEvent?.image ? (
                                                    <img src={imagePreview || editingEvent?.image} className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110" alt="Card Preview" />
                                                ) : (
                                                    <div className="w-full h-full bg-white/[0.02] animate-pulse flex items-center justify-center opacity-10">
                                                        <ImageIcon size={64} />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                                                <div className="absolute bottom-0 left-0 p-8 w-full">
                                                    <p className="text-gold text-[10px] font-black uppercase tracking-[0.5em] mb-3 italic">{eventFormData.dj || editingEvent?.dj || "Artist Prototype"}</p>
                                                    <h4 className="text-3xl font-black uppercase tracking-tighter italic leading-none truncate">{eventFormData.title || editingEvent?.title || "Event Header"}</h4>
                                                    <div className="flex justify-between items-end mt-4">
                                                        <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/40">
                                                            {(eventFormData.location || editingEvent?.location || "MESSINA").toUpperCase()} // {eventFormData.eventDate ? new Date(eventFormData.eventDate).getFullYear() : (editingEvent?.event_date ? new Date(editingEvent.event_date).getFullYear() : new Date().getFullYear())}
                                                        </div>
                                                        <div className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 text-[8px] font-black uppercase tracking-widest">
                                                            VIEW ENTRY
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-8 space-y-4 px-2">
                                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/20 italic">
                                                    <span>Data Protocol</span>
                                                    <span className="text-gold">SINC_OK</span>
                                                </div>
                                                <div className="h-[1px] bg-white/5 w-full" />
                                                <p className="text-[9px] leading-relaxed text-white/10 uppercase font-black tracking-widest italic">Ogni evento VŌLTA è un'opera unica di design notturno. La coerenza visiva è imperativa.</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto p-8 border border-white/5 bg-white/[0.01] backdrop-blur-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center">
                                                <Sparkles className="text-gold" size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Quality Assurance</p>
                                                <p className="text-[8px] uppercase tracking-widest text-white/20 mt-1 font-bold">L'evento sarà visibile globalmente dopo il deploy.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
