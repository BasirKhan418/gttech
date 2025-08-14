import ConnectDb from "../../middlewares/connectdb";
import Industry from "../../models/Industry";
import IndustryCategory from "../../models/IndustryCategory";

// Industry CRUD operations
const getIndustries = async () => {
    try {
        await ConnectDb();
        let data = await Industry.find()
            .populate("author lastEditedAuthor")
            .sort({ createdAt: -1 });
        return { success: true, message: "Industries fetched successfully", data };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const getIndustriesByCategory = async (category: string) => {
    try {
        await ConnectDb();
        let data = await Industry.find({ category, isActive: true })
            .populate("author lastEditedAuthor")
            .sort({ isFeatured: -1, createdAt: -1 });
        return { success: true, message: "Industries fetched successfully", data };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const getIndustryBySlug = async (slug: string) => {
    try {
        await ConnectDb();
        let data = await Industry.findOne({ slug, isActive: true })
            .populate("author lastEditedAuthor");
        if (!data) {
            return { success: false, message: "Industry not found" };
        }
        return { success: true, message: "Industry fetched successfully", data };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const addIndustry = async (data: any) => {
    try {
        await ConnectDb();
        let newIndustry = new Industry(data);
        await newIndustry.save();
        return { success: true, message: "Industry added successfully" };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const updateIndustry = async (id: string, data: any) => {
    try {
        await ConnectDb();
        let updatedIndustry = await Industry.findByIdAndUpdate(id, data, { new: true });
        if (!updatedIndustry) {
            return { success: false, message: "Industry not found" };
        }
        return { success: true, message: "Industry updated successfully", data: updatedIndustry };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const deleteIndustry = async (id: string) => {
    try {
        await ConnectDb();
        let deletedIndustry = await Industry.findByIdAndDelete(id);
        if (!deletedIndustry) {
            return { success: false, message: "Industry not found" };
        }
        return { success: true, message: "Industry deleted successfully" };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

// Category CRUD operations
const getIndustryCategories = async () => {
    try {
        await ConnectDb();
        let data = await IndustryCategory.find({ isActive: true })
            .populate("author lastEditedAuthor")
            .sort({ order: 1, createdAt: -1 });
        return { success: true, message: "Industry categories fetched successfully", data };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const getAllIndustryCategories = async () => {
    try {
        await ConnectDb();
        let data = await IndustryCategory.find()
            .populate("author lastEditedAuthor")
            .sort({ order: 1, createdAt: -1 });
        return { success: true, message: "All industry categories fetched successfully", data };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const addIndustryCategory = async (data: any) => {
    try {
        await ConnectDb();
        let newCategory = new IndustryCategory(data);
        await newCategory.save();
        return { success: true, message: "Industry category added successfully" };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const updateIndustryCategory = async (id: string, data: any) => {
    try {
        await ConnectDb();
        let updatedCategory = await IndustryCategory.findByIdAndUpdate(id, data, { new: true });
        if (!updatedCategory) {
            return { success: false, message: "Industry category not found" };
        }
        return { success: true, message: "Industry category updated successfully", data: updatedCategory };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const deleteIndustryCategory = async (id: string) => {
    try {
        await ConnectDb();
        let deletedCategory = await IndustryCategory.findByIdAndDelete(id);
        if (!deletedCategory) {
            return { success: false, message: "Industry category not found" };
        }
        return { success: true, message: "Industry category deleted successfully" };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

export { 
    getIndustries, 
    getIndustriesByCategory,
    getIndustryBySlug,
    addIndustry, 
    updateIndustry, 
    deleteIndustry,
    getIndustryCategories,
    getAllIndustryCategories,
    addIndustryCategory,
    updateIndustryCategory,
    deleteIndustryCategory
};