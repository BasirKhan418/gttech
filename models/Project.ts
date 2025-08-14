import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    poster: { type: String, required: true },
    images: { type: [String], required: false },
    icon: { type: String, required: false },
    technologies: { type: [String], required: false },
    features: { type: [String], required: false },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    lastEditedAuthor: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
}, { timestamps: true });

// Add index for better query performance
ProjectSchema.index({ isActive: 1, createdAt: -1 });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ isFeatured: 1 });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);