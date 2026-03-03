import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
    name: { type: String, required: true }, 
    address: { type: String, required: true }, 
    phone: { type: String, required: true },
    email: { type: String, required: false }, 
    city: { type: String, required: true }, 
    state: { type: String, required: true }, 
    country: { type: String, required: true, default: "India" },
    pincode: { type: String, required: true },
    isActive: { type: Boolean, default: true }, 
    displayOrder: { type: Number, default: 0 }, 
    lastEditedAuthor: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
}, { timestamps: true });

export default mongoose.models.Address || mongoose.model('Address', AddressSchema);