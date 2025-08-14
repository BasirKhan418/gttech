import mongoose from "mongoose";

const IndustrySchema = new mongoose.Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    highlights: [{ type: String, required: true }],
    technologies: [{ type: String, required: true }],
    poster: { type: String, required: true },
    images: [{ type: String, required: false }],
    icon: { type: String, required: false },
    category: { type: String, required: true }, 
    
    // Visual styling
    gradientFrom: { type: String, default: "from-sky-500/20" },
    gradientTo: { type: String, default: "to-cyan-500/20" },
    borderColor: { type: String, default: "border-sky-500/20" },
    hoverBorderColor: { type: String, default: "hover:border-sky-400/40" },
    textColor: { type: String, default: "text-sky-400" },
    hoverTextColor: { type: String, default: "group-hover:text-sky-200" },
    buttonGradient: { type: String, default: "from-sky-500/80 to-sky-600/80 hover:from-sky-600/90 hover:to-sky-700/90" },
    iconBg: { type: String, default: "bg-gradient-to-r from-sky-500/20 to-cyan-500/20" },
    iconBorder: { type: String, default: "border-sky-400/30" },
    
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    
    // SEO and metadata
    slug: { type: String, required: true, unique: true },
    metaTitle: { type: String, required: false },
    metaDescription: { type: String, required: false },
    
    // Admin tracking
    lastEditedAuthor: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
}, { timestamps: true });

IndustrySchema.index({ category: 1, isActive: 1 });
IndustrySchema.index({ slug: 1 });
IndustrySchema.index({ isFeatured: 1, isActive: 1 });

export default mongoose.models.Industry || mongoose.model('Industry', IndustrySchema);