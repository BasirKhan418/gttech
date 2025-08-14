import ConnectDb from "../../middlewares/connectdb";
import Industry from "../../models/Industry";
import IndustryCategory from "../../models/IndustryCategory";

// Industry CRUD operations
const getIndustries = async () => {
    try {
        console.log('getIndustries: Connecting to database...');
        await ConnectDb();
        
        console.log('getIndustries: Fetching industries...');
        let data = await Industry.find()
            .populate("author lastEditedAuthor", "name email")
            .sort({ createdAt: -1 })
            .lean(); // Use lean() for better performance
        
        console.log('getIndustries: Found', data?.length || 0, 'industries');
        
        return { 
            success: true, 
            message: "Industries fetched successfully", 
            data: data || [] 
        };
    } catch (error) {
        console.error('getIndustries error:', error);
        return { 
            success: false, 
            message: "Something went wrong please try again after sometime",
            data: []
        };
    }
}

const getIndustriesByCategory = async (category: string) => {
    try {
        console.log('getIndustriesByCategory: Connecting to database...');
        await ConnectDb();
        
        console.log('getIndustriesByCategory: Fetching industries for category:', category);
        let data = await Industry.find({ category, isActive: true })
            .populate("author lastEditedAuthor", "name email")
            .sort({ isFeatured: -1, createdAt: -1 })
            .lean();
            
        console.log('getIndustriesByCategory: Found', data?.length || 0, 'industries');
        
        return { 
            success: true, 
            message: "Industries fetched successfully", 
            data: data || [] 
        };
    } catch (error) {
        console.error('getIndustriesByCategory error:', error);
        return { 
            success: false, 
            message: "Something went wrong please try again after sometime",
            data: []
        };
    }
}

const getIndustryBySlug = async (slug: string) => {
    try {
        console.log('getIndustryBySlug: Connecting to database...');
        await ConnectDb();
        
        console.log('getIndustryBySlug: Fetching industry with slug:', slug);
        let data = await Industry.findOne({ slug, isActive: true })
            .populate("author lastEditedAuthor", "name email")
            .lean();
            
        if (!data) {
            console.log('getIndustryBySlug: Industry not found');
            return { success: false, message: "Industry not found", data: null };
        }
        
        console.log('getIndustryBySlug: Found industry:', (data as any)?.title || 'Unknown');
        return { 
            success: true, 
            message: "Industry fetched successfully", 
            data 
        };
    } catch (error) {
        console.error('getIndustryBySlug error:', error);
        return { 
            success: false, 
            message: "Something went wrong please try again after sometime",
            data: null
        };
    }
}

const addIndustry = async (data: any) => {
    try {
        console.log('addIndustry: Connecting to database...');
        await ConnectDb();
        
        console.log('addIndustry: Creating new industry...');
        let newIndustry = new Industry(data);
        await newIndustry.save();
        
        console.log('addIndustry: Industry created successfully');
        return { success: true, message: "Industry added successfully" };
    } catch (error) {
        console.error('addIndustry error:', error);
        return { 
            success: false, 
            message: "Something went wrong please try again after sometime" 
        };
    }
}

const updateIndustry = async (id: string, data: any) => {
    try {
        console.log('updateIndustry: Connecting to database...');
        await ConnectDb();
        
        console.log('updateIndustry: Updating industry with ID:', id);
        let updatedIndustry = await Industry.findByIdAndUpdate(id, data, { new: true });
        
        if (!updatedIndustry) {
            console.log('updateIndustry: Industry not found');
            return { success: false, message: "Industry not found" };
        }
        
        console.log('updateIndustry: Industry updated successfully');
        return { 
            success: true, 
            message: "Industry updated successfully", 
            data: updatedIndustry 
        };
    } catch (error) {
        console.error('updateIndustry error:', error);
        return { 
            success: false, 
            message: "Something went wrong please try again after sometime" 
        };
    }
}

const deleteIndustry = async (id: string) => {
    try {
        console.log('deleteIndustry: Connecting to database...');
        await ConnectDb();
        
        console.log('deleteIndustry: Deleting industry with ID:', id);
        let deletedIndustry = await Industry.findByIdAndDelete(id);
        
        if (!deletedIndustry) {
            console.log('deleteIndustry: Industry not found');
            return { success: false, message: "Industry not found" };
        }
        
        console.log('deleteIndustry: Industry deleted successfully');
        return { success: true, message: "Industry deleted successfully" };
    } catch (error) {
        console.error('deleteIndustry error:', error);
        return { 
            success: false, 
            message: "Something went wrong please try again after sometime" 
        };
    }
}

// Category CRUD operations
const getIndustryCategories = async () => {
    try {
        console.log('getIndustryCategories: Connecting to database...');
        await ConnectDb();
        
        console.log('getIndustryCategories: Fetching active categories...');
        let data = await IndustryCategory.find({ isActive: true })
            .populate("author lastEditedAuthor", "name email")
            .sort({ order: 1, createdAt: -1 })
            .lean();
            
        console.log('getIndustryCategories: Found', data?.length || 0, 'categories');
        
        return { 
            success: true, 
            message: "Industry categories fetched successfully", 
            data: data || [] 
        };
    } catch (error) {
        console.error('getIndustryCategories error:', error);
        return { 
            success: false, 
            message: "Something went wrong please try again after sometime",
            data: []
        };
    }
}

const getAllIndustryCategories = async () => {
    try {
        console.log('getAllIndustryCategories: Connecting to database...');
        await ConnectDb();
        
        console.log('getAllIndustryCategories: Fetching all categories...');
        let data = await IndustryCategory.find()
            .populate("author lastEditedAuthor", "name email")
            .sort({ order: 1, createdAt: -1 })
            .lean();
            
        console.log('getAllIndustryCategories: Found', data?.length || 0, 'categories');
        
        return { 
            success: true, 
            message: "All industry categories fetched successfully", 
            data: data || [] 
        };
    } catch (error) {
        console.error('getAllIndustryCategories error:', error);
        return { 
            success: false, 
            message: "Something went wrong please try again after sometime",
            data: []
        };
    }
}

const addIndustryCategory = async (data: any) => {
    try {
        console.log('addIndustryCategory: Connecting to database...');
        await ConnectDb();
        
        console.log('addIndustryCategory: Creating new category...');
        let newCategory = new IndustryCategory(data);
        await newCategory.save();
        
        console.log('addIndustryCategory: Category created successfully');
        return { success: true, message: "Industry category added successfully" };
    } catch (error) {
        console.error('addIndustryCategory error:', error);
        return { 
            success: false, 
            message: "Something went wrong please try again after sometime" 
        };
    }
}

const updateIndustryCategory = async (id: string, data: any) => {
    try {
        console.log('updateIndustryCategory: Connecting to database...');
        await ConnectDb();
        
        console.log('updateIndustryCategory: Updating category with ID:', id);
        let updatedCategory = await IndustryCategory.findByIdAndUpdate(id, data, { new: true });
        
        if (!updatedCategory) {
            console.log('updateIndustryCategory: Category not found');
            return { success: false, message: "Industry category not found" };
        }
        
        console.log('updateIndustryCategory: Category updated successfully');
        return { 
            success: true, 
            message: "Industry category updated successfully", 
            data: updatedCategory 
        };
    } catch (error) {
        console.error('updateIndustryCategory error:', error);
        return { 
            success: false, 
            message: "Something went wrong please try again after sometime" 
        };
    }
}

const deleteIndustryCategory = async (id: string) => {
    try {
        console.log('deleteIndustryCategory: Connecting to database...');
        await ConnectDb();
        
        console.log('deleteIndustryCategory: Deleting category with ID:', id);
        let deletedCategory = await IndustryCategory.findByIdAndDelete(id);
        
        if (!deletedCategory) {
            console.log('deleteIndustryCategory: Category not found');
            return { success: false, message: "Industry category not found" };
        }
        
        console.log('deleteIndustryCategory: Category deleted successfully');
        return { success: true, message: "Industry category deleted successfully" };
    } catch (error) {
        console.error('deleteIndustryCategory error:', error);
        return { 
            success: false, 
            message: "Something went wrong please try again after sometime" 
        };
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