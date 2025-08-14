import ConnectDb from "../../middlewares/connectdb";
import Career from "../../models/Career";

const getCareers = async () => {
    try {
        await ConnectDb();
        let data = await Career.find()
            .populate("author lastEditedAuthor")
            .sort({ createdAt: -1 });
        return { success: true, message: "Career postings fetched successfully", data };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const addCareer = async (data: any) => {
    try {
        await ConnectDb();
        let newCareer = new Career(data);
        await newCareer.save();
        return { success: true, message: "Career posting added successfully" };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const updateCareer = async (id: string, data: any) => {
    try {
        await ConnectDb();
        let updatedCareer = await Career.findByIdAndUpdate(id, data, { new: true });
        if (!updatedCareer) {
            return { success: false, message: "Career posting not found" };
        }
        return { success: true, message: "Career posting updated successfully", data: updatedCareer };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const deleteCareer = async (id: string) => {
    try {
        await ConnectDb();
        let deletedCareer = await Career.findByIdAndDelete(id);
        if (!deletedCareer) {
            return { success: false, message: "Career posting not found" };
        }
        return { success: true, message: "Career posting deleted successfully" };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

export { getCareers, addCareer, updateCareer, deleteCareer };