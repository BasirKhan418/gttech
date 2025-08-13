import mongoose from "mongoose";
const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    username: { type: String, required: false },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    img: { type: String, required: false },
    authtoken: { type: String, required: false },
    bio: { type: String, default: "" },
    phone: { type: String, default: "" },
    iscentraladmin: { type: Boolean, default: false },
    twofactor: { type: Boolean, default: false },
}, { timestamps: true })
export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);