import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    linkedinUrl: { type: String, required: true },
    category: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    lastEditedAuthor: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
}, { timestamps: true })

export default mongoose.models.Team || mongoose.model('Team', TeamSchema);