import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Registration from "@/models/Registration";
import Event from "@/models/Event";
import { getServerSession } from "next-auth";

// User: Book an event
export async function POST(req: Request) {
    try {
        const session = await getServerSession() as any;
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const { eventId } = await req.json();

        // Check if event exists and is not sold out
        const event = await Event.findById(eventId);
        if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
        if (event.isSoldOut || (event.regLimit > 0 && event.regsCount >= event.regLimit)) {
            return NextResponse.json({ error: "Event is sold out" }, { status: 400 });
        }

        // Check for existing registration
        const existingReg = await Registration.findOne({ userId: session.user.id, eventId });
        if (existingReg) return NextResponse.json({ error: "Already registered" }, { status: 400 });

        // Create registration
        const registration = await Registration.create({
            userId: session.user.id,
            eventId,
            status: "confirmed"
        });

        // Increment event regsCount
        event.regsCount += 1;
        await event.save();

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
        const session = await getServerSession() as any;
        if (!session || (session.user.role !== "admin" && session.user.role !== "venue")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const registrations = await Registration.find({ eventId }).populate("userId", "name email");
        return NextResponse.json(registrations);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
    }
}
