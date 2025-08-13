import jwt from 'jsonwebtoken';

const VerifyJwt=async(token:string)=>{
    try{
    const data = jwt.verify(token, process.env.JWT_SECRET || "");
    return { success: true, data };
    }
    catch(err){
    return { success: false, message: "Invalid token." };
    }

}
export default VerifyJwt;