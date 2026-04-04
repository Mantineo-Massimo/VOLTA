import mongoose, { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Hashed
    role: { type: String, enum: ['user', 'venue', 'admin'], default: 'user' },
    image: { type: String },
    phoneNumber: { type: String },
    memberships: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

const User = models.User || model('User', UserSchema);
export default User;
