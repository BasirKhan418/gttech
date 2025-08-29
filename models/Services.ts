import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  // Basic fields
  slug: { type: String, required: true, unique: true },
  sectionName: { type: String, required: true },
  title: { type: String, required: true },
  tagline: { type: String, required: true },
  description: { type: String, required: true },
  poster: { type: String, required: true },
  images: { type: [String], required: false },
  lists: { type: [String], required: false },
  designType: { type: String, required: true },
  icon: { type: String, required: true },
  
  // Additional fields for flexibility
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  lastEditedAuthor: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: false },
  
  // Service specific fields
  industries: { type: [String], required: false },
  technologies: { type: [String], required: false },
  capabilities: { type: [String], required: false },
  benefits: { type: [String], required: false },
  pricingModel: { type: String, required: false },
  duration: { type: String, required: false },
  teamSize: { type: String, required: false },
  
  // SEO and metadata
  metaTitle: { type: String, required: false },
  metaDescription: { type: String, required: false },
  keywords: { type: [String], required: false },
}, {
  timestamps: true,
  strict: false // Allows additional fields not defined in schema
});

// Add indexes for better query performance
ServiceSchema.index({ isActive: 1, createdAt: -1 });
ServiceSchema.index({ sectionName: 1 });
ServiceSchema.index({ designType: 1 });
ServiceSchema.index({ isFeatured: 1 });
ServiceSchema.index({ 'author': 1 });
ServiceSchema.index({ 'lastEditedAuthor': 1 });

export default mongoose.models.Services || mongoose.model('Services', ServiceSchema);