import ConnectDb from "../../middlewares/connectdb";
import Content from "../../models/Content";


const getContent = async () => {
    try {
        await ConnectDb();
        let content = await Content.find({})
            .populate("author lastEditedAuthor")
            .sort({ createdAt: -1 });
        return { success: true, data: content };
    } catch (err) {
        console.error(err);
        return { success: false, message: "Error fetching content. Please try again later." };
    }
};
const createContent = async (data: any) => {
    try {
        await ConnectDb();
        let content = new Content({...data});
        await content.save();
        return { success: true, data: content };
    } catch (err) {
        console.log("error is ", err);
        return { success: false, message: "Error creating content. Please try again later." };
    }
}


const updateContent = async (id: string, data: any) => {
    try {
        await ConnectDb();
        let content = await Content.findByIdAndUpdate(id, { ...data }, { new: true });
        return { success: true, data: content };
    } catch (err) {
        console.log("error is ", err);
        return { success: false, message: "Error updating content. Please try again later." };
    }
}

const deleteContent = async (id: string) => {
    try {
        await ConnectDb();
        await Content.findByIdAndDelete(id);
        return { success: true };
    } catch (err) {
        console.log("error is ", err);
        return { success: false, message: "Error deleting content. Please try again later." };
    }
}

export { getContent, createContent, updateContent, deleteContent };