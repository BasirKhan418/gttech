import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    // Basic fields
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
    
    // Software products specific fields
    portfolios: { type: [String], required: false },
    industries: { type: [String], required: false },
    capabilities: { type: [String], required: false },
    valuePropositions: { type: [String], required: false },
    
    // SaaS specific fields
    pricingModel: { type: String, required: false },
    integrations: { type: [String], required: false },
    apiSupport: { type: Boolean, required: false },
    
    // Electric vehicles specific fields
    batteryCapacity: { type: String, required: false },
    range: { type: String, required: false },
    chargingTime: { type: String, required: false },
    motorType: { type: String, required: false },
    
    // Furnitures specific fields
    material: { type: [String], required: false },
    dimensions: { type: String, required: false },
    weight: { type: String, required: false },
    assemblyRequired: { type: Boolean, required: false },
    
    // Garments specific fields
    sizes: { type: [String], required: false },
    colors: { type: [String], required: false },
    fabric: { type: [String], required: false },
    careInstructions: { type: [String], required: false },
}, { 
    timestamps: true,
    // This allows fields not defined in the schema to be saved
    strict: false 
});

// Add indexes for better query performance
ProjectSchema.index({ isActive: 1, createdAt: -1 });
ProjectSchema.index({ category: 1 });
ProjectSchema.index({ isFeatured: 1 });
ProjectSchema.index({ 'author': 1 });
ProjectSchema.index({ 'lastEditedAuthor': 1 });

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);