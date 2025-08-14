import ConnectDb from "../../middlewares/connectdb";
import GAQ from "../../models/GAQ";

const getGAQs = async () => {
    try {
        await ConnectDb();
        let data = await GAQ.find()
            .populate("processedBy", "name email")
            .sort({ createdAt: -1 });
        return { success: true, message: "GAQ requests fetched successfully", data };
    } catch (error) {
        console.error("Error fetching GAQ requests:", error);
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
};

const addGAQ = async (data: any) => {
    try {
        await ConnectDb();
        let newGAQ = new GAQ(data);
        await newGAQ.save();
        return { success: true, message: "GAQ request submitted successfully", data: newGAQ };
    } catch (error) {
        console.error("Error adding GAQ request:", error);
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
};

const updateGAQ = async (id: string, data: any) => {
    try {
        await ConnectDb();
        let updatedGAQ = await GAQ.findByIdAndUpdate(id, data, { new: true })
            .populate("processedBy", "name email");
        if (!updatedGAQ) {
            return { success: false, message: "GAQ request not found" };
        }
        return { success: true, message: "GAQ request updated successfully", data: updatedGAQ };
    } catch (error) {
        console.error("Error updating GAQ request:", error);
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
};

const deleteGAQ = async (id: string) => {
    try {
        await ConnectDb();
        let deletedGAQ = await GAQ.findByIdAndDelete(id);
        if (!deletedGAQ) {
            return { success: false, message: "GAQ request not found" };
        }
        return { success: true, message: "GAQ request deleted successfully" };
    } catch (error) {
        console.error("Error deleting GAQ request:", error);
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
};

const getGAQById = async (id: string) => {
    try {
        await ConnectDb();
        let gaq = await GAQ.findById(id).populate("processedBy", "name email");
        if (!gaq) {
            return { success: false, message: "GAQ request not found" };
        }
        return { success: true, message: "GAQ request fetched successfully", data: gaq };
    } catch (error) {
        console.error("Error fetching GAQ request:", error);
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
};

const updateGAQStatus = async (id: string, status: string, adminId?: string, adminNotes?: string) => {
    try {
        await ConnectDb();
        
        const updateData: any = { 
            status,
            ...(adminNotes && { adminNotes }),
            ...(adminId && { processedBy: adminId })
        };

        if (status === 'seen' && !await GAQ.findOne({ _id: id, seenAt: { $exists: true } })) {
            updateData.seenAt = new Date();
        }

        if (status === 'processed') {
            updateData.processedAt = new Date();
        }

        let updatedGAQ = await GAQ.findByIdAndUpdate(id, updateData, { new: true })
            .populate("processedBy", "name email");
            
        if (!updatedGAQ) {
            return { success: false, message: "GAQ request not found" };
        }
        
        return { success: true, message: "GAQ status updated successfully", data: updatedGAQ };
    } catch (error) {
        console.error("Error updating GAQ status:", error);
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
};

const getGAQStats = async () => {
    try {
        await ConnectDb();
        
        const totalRequests = await GAQ.countDocuments();
        const pendingRequests = await GAQ.countDocuments({ status: 'pending' });
        const seenRequests = await GAQ.countDocuments({ status: 'seen' });
        const processedRequests = await GAQ.countDocuments({ status: 'processed' });
        const rejectedRequests = await GAQ.countDocuments({ status: 'rejected' });
        
        const solutionRequests = await GAQ.countDocuments({ projectType: 'solution' });
        const consultancyRequests = await GAQ.countDocuments({ projectType: 'consultancy' });
        
        return {
            success: true,
            data: {
                total: totalRequests,
                pending: pendingRequests,
                seen: seenRequests,
                processed: processedRequests,
                rejected: rejectedRequests,
                solutions: solutionRequests,
                consultancy: consultancyRequests
            }
        };
    } catch (error) {
        console.error("Error fetching GAQ stats:", error);
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
};

export { 
    getGAQs, 
    addGAQ, 
    updateGAQ, 
    deleteGAQ, 
    getGAQById, 
    updateGAQStatus, 
    getGAQStats 
};