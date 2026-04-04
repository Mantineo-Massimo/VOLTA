import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

// Public: Get all events
export async function GET() {
    try {
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);
        const { data: events, error } = await supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true });

        if (error) throw error;
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }
}

// Admin: Create new event
export async function POST(req: Request) {
    try {
        const cookieStore = await cookies();
        const supabase = createClient(cookieStore);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Check if user is admin via profile
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        // Map any camelCase to snake_case if necessary
        const { data: event, error } = await supabase
            .from('events')
            .insert([body])
            .select()
            .single();

        if (error) throw error;
        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
    }
}
