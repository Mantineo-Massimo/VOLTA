"use client"; // Note: this is actually a server side file but I will name it actions.ts

import dbConnect from "./db";
import { User, Registration, Event } from "./models";

export async function registerForEvent(formData: any) {
    await dbConnect();

    const { name, email, phone, marketingConsent, eventSlug } = formData;

    // 1. Find or Create User
    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({ name, email, phone, marketingConsent });
    } else {
        // Update contact info if different
        user.name = name;
        user.phone = phone;
        user.marketingConsent = marketingConsent;
        await user.save();
    }

    // 2. Find Event
    const event = await Event.findOne({ slug: eventSlug });
    if (!event) {
        throw new Error("Evento non trovato");
    }

    // 3. Create Registration (avoid duplicates)
    const existingReg = await Registration.findOne({ userId: user._id, eventId: event._id });
    if (existingReg) {
        return { success: true, message: "Già registrato", registration: existingReg };
    }

    const registration = await Registration.create({
        userId: user._id,
        eventId: event._id,
    });

    return { success: true, message: "Registrazione completata", registration };
}
