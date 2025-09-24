import mongoose from "mongoose";

const IndustryCategorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    icon: { type: String, required: false },
    color: { type: String, default: "cyan" }, // for theming
    order: { type: Number, default: 0 }, // for sorting
    isActive: { type: Boolean, default: true },
    imageUrl: { type: String, required: false },
    // Admin tracking
    lastEditedAuthor: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
}, { timestamps: true });

// Add indexes
IndustryCategorySchema.index({ slug: 1 });
IndustryCategorySchema.index({ isActive: 1, order: 1 });

export default mongoose.models.IndustryCategory || mongoose.model('IndustryCategory', IndustryCategorySchema);