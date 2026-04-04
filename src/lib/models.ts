import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    marketingConsent: { type: Boolean, default: false },
}, { timestamps: true });

const EventSchema = new Schema({
    title: { type: String, required: true },
    venueName: { type: String, required: true },
    date: { type: Date, required: true },
    description: { type: String },
    slug: { type: String, unique: true },
}, { timestamps: true });

const RegistrationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    checkedIn: { type: Boolean, default: false },
    checkedInAt: { type: Date },
}, { timestamps: true });

export const User = models.User || model("User", UserSchema);
export const Event = models.Event || model("Event", EventSchema);
export const Registration = models.Registration || model("Registration", RegistrationSchema);
