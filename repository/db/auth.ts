import { asyncWrapProviders } from "async_hooks";
import Admin from "../../models/Admin";
import ConnectDb from "../../middlewares/connectdb";
const finduser = async (email:string) => {
  try {
    await ConnectDb();
    const user = await Admin.findOne({ email });
    if (user == null) {
        return { success: false, message: "User not found" ,data:null};
    }
    return { success: true, data: user };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {success: false, message: `Error finding user: ${errorMessage}`};
  }
};

//create user

const CreateUser=async(email:string,name:string,username:string,password:string,img:string,phone:string)=>{
try{
  await ConnectDb();
  const user = new Admin({ email, name, username, password, img, phone });
  await user.save();
  return {success: true, data: user};
}
catch(err){
  const errorMessage = err instanceof Error ? err.message : String(err);
  return {success: false, message: `Error creating user: ${errorMessage}`};
}
}


export { finduser, CreateUser };
