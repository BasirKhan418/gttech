import mongoose from "mongoose";
const ContentSchema = new mongoose.Schema({
    sectionName: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    poster: { type: String, required: true},
    images: { type: [String], required: false },
    lists: { type: [String], required: false },
    designType: { type: String, required: true },
    lastEditedAuthor: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
}, { timestamps: true })
export default mongoose.models.Content || mongoose.model('Content', ContentSchema);