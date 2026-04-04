import mongoose, { Schema, model, models } from 'mongoose';

const EventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dj: { type: String, required: true },
    genre: { type: String, required: true },
    dresscode: { type: Boolean, default: false },
    entryType: { type: String, required: true },
    date: { type: String, required: true }, // Keeping as string for Italian format preference, or Date if preferred
    time: { type: String, required: true },
    location: { type: String, required: true },
    venue: { type: String, required: true },
    image: { type: String }, // Cloudinary URL
    isSoldOut: { type: Boolean, default: false },
    regLimit: { type: Number, default: 0 },
    regsCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const Event = models.Event || model('Event', EventSchema);
export default Event;
