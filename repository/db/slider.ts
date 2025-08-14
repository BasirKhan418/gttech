import Slider from "../../models/Slider";
import ConnectDb from "../../middlewares/connectdb";


const getSlider = async () => {
    try{
        await ConnectDb();
        let data = await Slider.find({}).populate("author lastEditedAuthor")
            .sort({ createdAt: -1 });
        return { success: true, data };
    }
    catch(err) {
        console.error(err);
        return { success: false, message: "Error fetching slider. Please try again later." };
    }
}

const addSlider = async(data:any)=>{
    try{
        let newSlider = new Slider(data);
        await newSlider.save();
        return { success: true, message: "Slider added successfully." };
    }
    catch(err){
     return { success: false, message: "Error adding slider. Please try again later." };
    }
}

const updateSlider = async (id: string, data: any) => {
    try{
        let update = await Slider.findByIdAndUpdate(id, data, { new: true });
        return { success: true, data: update };
    }
    catch(err){
        return { success: false, message: "Error updating slider. Please try again later." };
    }
}


const deleteSlider = async (id: string) => {
    try{
        await Slider.findByIdAndDelete(id);
        return { success: true, message: "Slider deleted successfully." };
    }
    catch(err){
        return { success: false, message: "Error deleting slider. Please try again later." };
    }
}

export {getSlider, addSlider, updateSlider,deleteSlider}