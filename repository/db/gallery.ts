import ConnectDb from "../../middlewares/connectdb";
import Gallery from "../../models/Gallery";

const getGallery = async () => {
    try {
        await ConnectDb();
        let data = await Gallery.find({})
            .populate("author lastEditedAuthor")
            .sort({ createdAt: -1 });
        return { success: true, message: "Gallery items fetched successfully", data };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const addGallery = async (data: any) => {
    try {
        await ConnectDb();
        let newGallery = new Gallery(data);
        await newGallery.save();
        return { success: true, message: "Gallery item added successfully" };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const updateGallery = async (id: string, data: any) => {
    try {
        await ConnectDb();
        let updatedGallery = await Gallery.findByIdAndUpdate(id, data, { new: true });
        if (!updatedGallery) {
            return { success: false, message: "Gallery item not found" };
        }
        return { success: true, message: "Gallery item updated successfully", data: updatedGallery };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const deleteGallery = async (id: string) => {
    try {
        await ConnectDb();
        let deletedGallery = await Gallery.findByIdAndDelete(id);
        if (!deletedGallery) {
            return { success: false, message: "Gallery item not found" };
        }
        return { success: true, message: "Gallery item deleted successfully" };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

export { getGallery, addGallery, updateGallery, deleteGallery };