import About from "../../models/About";
import ConnectDb from "../../middlewares/connectdb";

// Get about page data
export const getAbout = async () => {
    try {
        await ConnectDb();
        const aboutData = await About.find({})
            .populate('author', 'name email')
            .populate('lastEditedAuthor', 'name email')
            .sort({ createdAt: -1 });
        
        return {
            success: true,
            data: aboutData,
            message: aboutData.length > 0 ? "About data retrieved successfully" : "No about data found"
        };
    } catch (error) {
        console.error("Error in getAbout:", error);
        return {
            success: false,
            data: [],
            message: "Failed to retrieve about data"
        };
    }
};

// Add new about page (only if none exists)
export const addAbout = async (aboutData: { [x: string]: string | any[]; }) => {
    try {
        await ConnectDb();
        
        // Check if about page already exists
        const existingAbout = await About.findOne({});
        if (existingAbout) {
            return {
                success: false,
                data: null,
                message: "About page already exists. Only one about page is allowed."
            };
        }

        // Validate required fields
        const requiredFields = [
            'title', 'ourstory', 'card1title', 'card1subtitle', 'card1desc', 
            'card1features', 'card2title', 'card2subtitle', 'card2desc', 
            'card2features', 'foundationdesc', 'partners', 'author', 'lastEditedAuthor'
        ];

        for (let field of requiredFields) {
            if (!aboutData[field] || (Array.isArray(aboutData[field]) && aboutData[field].length === 0)) {
                return {
                    success: false,
                    data: null,
                    message: `${field} is required`
                };
            }
        }

        const newAbout = new About(aboutData);
        const savedAbout = await newAbout.save();
        
        // Populate the saved document
        const populatedAbout = await About.findById(savedAbout._id)
            .populate('author', 'name email')
            .populate('lastEditedAuthor', 'name email');

        return {
            success: true,
            data: populatedAbout,
            message: "About page created successfully"
        };
    } catch (error) {
        console.error("Error in addAbout:", error);
        return {
            success: false,
            data: null,
            message: "Failed to create about page"
        };
    }
};

// Update existing about page
export const updateAbout = async (id:string, updateData: { [x: string]: string | any[]; }) => {
    try {
        await ConnectDb();

        // Check if the document exists
        const existingAbout = await About.findById(id);
        if (!existingAbout) {
            return {
                success: false,
                data: null,
                message: "About page not found"
            };
        }

        // Remove fields that shouldn't be updated
        const { author, createdAt, updatedAt, ...updateFields } = updateData;

        // Update the document
        const updatedAbout = await About.findByIdAndUpdate(
            id,
            { 
                ...updateFields,
                // Keep original author, only update lastEditedAuthor
                author: existingAbout.author
            },
            { 
                new: true, 
                runValidators: true 
            }
        ).populate('author', 'name email')
         .populate('lastEditedAuthor', 'name email');

        return {
            success: true,
            data: updatedAbout,
            message: "About page updated successfully"
        };
    } catch (error) {
        console.error("Error in updateAbout:", error);
        return {
            success: false,
            data: null,
            message: "Failed to update about page"
        };
    }
};

// Get about page by ID
export const getAboutById = async (id:string) => {
    try {
        await ConnectDb();
        
        const aboutData = await About.findById(id)
            .populate('author', 'name email')
            .populate('lastEditedAuthor', 'name email');

        if (!aboutData) {
            return {
                success: false,
                data: null,
                message: "About page not found"
            };
        }

        return {
            success: true,
            data: aboutData,
            message: "About data retrieved successfully"
        };
    } catch (error) {
        console.error("Error in getAboutById:", error);
        return {
            success: false,
            data: null,
            message: "Failed to retrieve about data"
        };
    }
};

// Check if about page exists
export const checkAboutExists = async () => {
    try {
        await ConnectDb();
        
        const count = await About.countDocuments({});
        
        return {
            success: true,
            exists: count > 0,
            count: count,
            message: count > 0 ? "About page exists" : "No about page found"
        };
    } catch (error) {
        console.error("Error in checkAboutExists:", error);
        return {
            success: false,
            exists: false,
            count: 0,
            message: "Failed to check about page existence"
        };
    }
};

// Delete about page (optional - in case you need it later)
export const deleteAbout = async (id:string) => {
    try {
        await ConnectDb();

        const deletedAbout = await About.findByIdAndDelete(id);
        
        if (!deletedAbout) {
            return {
                success: false,
                data: null,
                message: "About page not found"
            };
        }

        return {
            success: true,
            data: deletedAbout,
            message: "About page deleted successfully"
        };
    } catch (error) {
        console.error("Error in deleteAbout:", error);
        return {
            success: false,
            data: null,
            message: "Failed to delete about page"
        };
    }
};