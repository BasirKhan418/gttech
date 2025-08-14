import ConnectDb from "../../middlewares/connectdb";
import Banner from "../../models/Banner";
const getBanners = async()=>{
try{
await ConnectDb();
let data = await Banner.find().find({}).populate("author lastEditedAuthor")
            .sort({ createdAt: -1 });;
return {success:true,message:"Banners fetched successfully",data}
}
catch(error){
return {success:false,message:"Something went wrong please try again after sometime"}
}
}

const addBanner = async(data:any)=>{
    try{
        await ConnectDb();
        let newBanner = new Banner(data);
        await newBanner.save();
        return {success:true,message:"Banner added successfully"}
    }
    catch(error){
        return {success:false,message:"Something went wrong please try again after sometime"}
    }
}

const updateBanner = async (id: string, data: any) => {
    try {
        await ConnectDb();
        let updatedBanner = await Banner.findByIdAndUpdate(id, data, { new: true });
        if (!updatedBanner) {
            return { success: false, message: "Banner not found" };
        }
        return { success: true, message: "Banner updated successfully", data: updatedBanner };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}

const deleteBanner = async (id: string) => {
    try {
        await ConnectDb();
        let deletedBanner = await Banner.findByIdAndDelete(id);
        if (!deletedBanner) {
            return { success: false, message: "Banner not found" };
        }
        return { success: true, message: "Banner deleted successfully" };
    } catch (error) {
        return { success: false, message: "Something went wrong please try again after sometime" };
    }
}



export {getBanners,addBanner,updateBanner,deleteBanner}