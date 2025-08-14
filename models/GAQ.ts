import mongoose from "mongoose";

const GAQSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    budget: { type: String, required: true },
    projectType: { 
        type: String, 
        required: true, 
        enum: ['solution', 'consultancy'] 
    },
    requirementsPdf: { type: String, required: true }, // S3 URL
    estimatedBudget: { type: String, required: false },
    status: { 
        type: String, 
        default: 'pending', 
        enum: ['pending', 'seen', 'processed', 'rejected'] 
    },
    adminNotes: { type: String, default: "" },
    processedBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Admin', 
        required: false 
    },
    seenAt: { type: Date, required: false },
    processedAt: { type: Date, required: false },
}, { timestamps: true });

// Index for better query performance
GAQSchema.index({ status: 1, createdAt: -1 });
GAQSchema.index({ email: 1 });
GAQSchema.index({ projectType: 1 });

export default mongoose.models.GAQ || mongoose.model('GAQ', GAQSchema);