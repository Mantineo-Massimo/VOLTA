import mongoose, { Schema, model, models } from 'mongoose';

const RegistrationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'attended'], default: 'confirmed' },
    qrCode: { type: String },
    timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

const Registration = models.Registration || model('Registration', RegistrationSchema);
export default Registration;
