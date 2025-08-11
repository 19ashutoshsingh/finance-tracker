// import mongoose from 'mongoose';

// const AlertSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     message: { type: String, required: true },
//     isRead: { type: Boolean, default: false },
//     createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.model('Alert', AlertSchema);


import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    // ✅ Add threshold to track which alert was sent
    threshold: { type: Number, enum: [50, 90, 100], required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Alert', AlertSchema);