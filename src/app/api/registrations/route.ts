import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

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
