import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    avatarUrl: {
        type: String,
        default: '', // Sets a default empty string
    },
});

// Defines the 'User' model ONCE.
export default mongoose.model('User', UserSchema);