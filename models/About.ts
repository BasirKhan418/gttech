import mongoose from "mongoose";
const AboutSchema = new mongoose.Schema({
    title: { type: String, required: true },
    ourstory: { type: String, required: true },
    card1title: { type: String, required: true },
    card1subtitle: { type: String, required: true },
    card1desc: { type: String, required: true },
    card1features: [{ type: String, required: true }],
    card2title: { type: String, required: true },
    card2subtitle: { type: String, required: true },
    card2desc: { type: String, required: true },
    card2features: [{ type: String, required: true }],
    foundationdesc:[{ type: String, required: true }],
    partners:[{type:Object, required:true}],
    lastEditedAuthor: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
}, { timestamps: true })
export default mongoose.models.About || mongoose.model('About', AboutSchema);