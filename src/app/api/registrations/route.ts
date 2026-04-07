import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { sendEmail } from "@/utils/aws/ses";

// User: Book an event
export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { eventId } = await req.json();

        // Check if event exists and is not sold out
        const { data: event, error: eventError } = await supabase
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single();

        if (!event || eventError) return NextResponse.json({ error: "Event not found" }, { status: 404 });
        if (event.is_sold_out || (event.reg_limit > 0 && (event.regs_count || 0) >= event.reg_limit)) {
            return NextResponse.json({ error: "Event is sold out" }, { status: 400 });
        }

        // Check for existing registration
        const { data: existingReg } = await supabase
            .from('registrations')
            .select('*')
            .eq('user_id', user.id)
            .eq('event_id', eventId)
            .single();

        if (existingReg) return NextResponse.json({ error: "Already registered" }, { status: 400 });

        // Create registration
        const { data: registration, error: regError } = await supabase
            .from('registrations')
            .insert([{
                user_id: user.id,
                event_id: eventId,
                status: "confirmed"
            }])
            .select()
            .single();

        if (regError) throw regError;

        // Increment event regs_count
        const { error: updateError } = await supabase
            .from('events')
            .update({ regs_count: (event.regs_count || 0) + 1 })
            .eq('id', eventId);

        if (updateError) throw updateError;

        // Send Confirmation Email via AWS SES
        try {
            const emailHtml = `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 40px; background: #000; color: #fff; border: 1px solid #333; border-radius: 20px;">
                    <h1 style="font-size: 40px; text-transform: uppercase; letter-spacing: -2px; margin-bottom: 20px; font-style: italic;">VŌLTA CONFIRMED.</h1>
                    <p style="font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #888;">Grazie per esserti registrato, ${user.user_metadata?.full_name || 'Membro'}.</p>
                    
                    <div style="margin: 40px 0; padding: 20px; border-left: 4px solid #FFD700; background: #111;">
                        <h2 style="margin: 0; color: #FFD700; text-transform: uppercase;">${event.title}</h2>
                        <p style="margin: 10px 0 0; color: #fff; opacity: 0.6;">${event.date} • ${event.time} • ${event.venue}, ${event.location}</p>
                    </div>

                    <p style="font-size: 12px; line-height: 1.6; color: #555; text-transform: uppercase; letter-spacing: 1px;">
                        L'accesso agli eventi VŌLTA è strettamente su prenotazione. La registrazione online non garantisce l'accesso prioritario. Presentati puntualmente all'ingresso.
                    </p>

                    <div style="margin-top: 60px; border-top: 1px solid #222; pt: 20px; text-align: center;">
                        <p style="font-size: 10px; letter-spacing: 4px; color: #333; text-transform: uppercase;">VŌLTA Messina ${new Date().getFullYear()}</p>
                    </div>
                </div>
            `;

            await sendEmail({
                to: user.email!,
                subject: `VŌLTA | Conferma Registrazione: ${event.title}`,
                html: emailHtml
            });
        } catch (emailErr) {
            console.error("Failed to send confirmation email:", emailErr);
        }

        return NextResponse.json(registration, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to register" }, { status: 500 });
    }
}

// Admin/Venue: Get registrations for an event
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    try {
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!profile || (profile.role !== "admin" && profile.role !== "venue")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { data: registrations, error } = await supabase
            .from('registrations')
            .select(`
                *,
                profiles:user_id (id, full_name, email)
            `)
            .eq('event_id', eventId);

        if (error) throw error;
        return NextResponse.json(registrations);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
    }
}
