import ConnectDb from "../../middlewares/connectdb";
import Address from "../../models/Address";

const getAddresses = async () => {
    try {
        await ConnectDb();
        let data = await Address.find({ isActive: true })
            .populate("author lastEditedAuthor", "name email")
            .sort({ displayOrder: 1, createdAt: -1 });
        return { success: true, message: "Addresses fetched successfully", data };
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const getAllAddresses = async () => {
    try {
        await ConnectDb();
        let data = await Address.find()
            .populate("author lastEditedAuthor", "name email")
            .sort({ displayOrder: 1, createdAt: -1 });
        return { success: true, message: "All addresses fetched successfully", data };
    } catch (error) {
        console.error("Error fetching all addresses:", error);
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const addAddress = async (data: any) => {
    try {
        await ConnectDb();
        let newAddress = new Address(data);
        await newAddress.save();
        return { success: true, message: "Address added successfully" };
    } catch (error) {
        console.error("Error adding address:", error);
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const updateAddress = async (id: string, data: any) => {
    try {
        await ConnectDb();
        let updatedAddress = await Address.findByIdAndUpdate(id, data, { new: true })
            .populate("author lastEditedAuthor", "name email");
        if (!updatedAddress) {
            return { success: false, message: "Address not found" };
        }
        return { success: true, message: "Address updated successfully", data: updatedAddress };
    } catch (error) {
        console.error("Error updating address:", error);
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const deleteAddress = async (id: string) => {
    try {
        await ConnectDb();
        let deletedAddress = await Address.findByIdAndDelete(id);
        if (!deletedAddress) {
            return { success: false, message: "Address not found" };
        }
        return { success: true, message: "Address deleted successfully" };
    } catch (error) {
        console.error("Error deleting address:", error);
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const getAddressById = async (id: string) => {
    try {
        await ConnectDb();
        let address = await Address.findById(id).populate("author lastEditedAuthor", "name email");
        if (!address) {
            return { success: false, message: "Address not found" };
        }
        return { success: true, message: "Address fetched successfully", data: address };
    } catch (error) {
        console.error("Error fetching address:", error);
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const updateDisplayOrder = async (addressUpdates: { id: string, displayOrder: number }[]) => {
    try {
        await ConnectDb();
        
        // Update each address with new display order
        const updatePromises = addressUpdates.map(({ id, displayOrder }) =>
            Address.findByIdAndUpdate(id, { displayOrder }, { new: true })
        );
        
        await Promise.all(updatePromises);
        
        return { success: true, message: "Display order updated successfully" };
    } catch (error) {
        console.error("Error updating display order:", error);
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

export { 
    getAddresses, 
    getAllAddresses, 
    addAddress, 
    updateAddress, 
    deleteAddress, 
    getAddressById,
    updateDisplayOrder 
};