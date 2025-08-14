import mongoose from "mongoose";
const BannerSchema = new mongoose.Schema({
    title: { type: String, required: true },
    tags: [{ type: String, required: true }],
    description: { type: String, required: true },
    buttonText: { type: String, required: true },
    buttonLink: { type: String, required: true },
    image: { type: String, required: false },
    showImage: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    lastEditedAuthor: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
}, { timestamps: true })
export default mongoose.models.Banner || mongoose.model('Banner', BannerSchema);