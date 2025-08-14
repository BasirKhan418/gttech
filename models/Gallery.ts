import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema({
    type: { type: String, required: true, enum: ['image', 'video'] },
    title: { type: String, required: true },
    description: { type: String, required: false },
    
    // For image albums
    images: { type: [String], required: false, validate: [arrayLimit, '{PATH} exceeds the limit of 10'] },
    
    // For video gallery
    videoUrl: { type: String, required: false }, // YouTube URL
    thumbnail: { type: String, required: false }, // Video thumbnail
    
    isActive: { type: Boolean, default: true },
    lastEditedAuthor: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
}, { timestamps: true });

// Validate array length for images
function arrayLimit(val: string[]) {
    return val.length <= 10;
}

// Add validation to ensure proper field usage based on type
GallerySchema.pre('save', function(next) {
    if (this.type === 'image') {
        if (!this.images || this.images.length === 0) {
            return next(new Error('Image albums must have at least one image'));
        }
        this.videoUrl = undefined;
    } else if (this.type === 'video') {
        if (!this.videoUrl) {
            return next(new Error('Video entries must have a videoUrl'));
        }
        this.images = undefined;
    }
    next();
});

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);