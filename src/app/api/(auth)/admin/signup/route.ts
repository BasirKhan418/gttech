import { NextResponse,NextRequest } from "next/server";
import cryptojs from 'crypto-js'
import ConnectDb from "../../../../../../middlewares/connectdb";
import { finduser,CreateUser } from "../../../../../../repository/db/auth";
import SendSignupEmail from "../../../../../../email/auth/SendSignupEmail";
export const POST = async(req: NextRequest, res: NextResponse)=>{
try{
  await ConnectDb();
  const data = await req.json();
  const {email,name,username,password,img,phone}=data;

  const result = await finduser(email);
  if(result.success && result.data){
    return NextResponse.json({success:false,message:"User already exists"});
  }
  const pass= cryptojs.AES.encrypt(password,process.env.CRYPTOJS_SECRET||"").toString();
  const result2 = await CreateUser(email,name,username,pass,img,phone);
  if(!result2.success){
    console.error("Error creating user:", result2.message);
    return NextResponse.json({success:false,message:"Error creating user.Please try again after sometime error is :- "+result2.message});
  }
  //send email here
  SendSignupEmail(email,name,username,password);
  return NextResponse.json({success:true,message:"User signed up successfully"}); 

}
catch(err){
    console.error("Error signing up user:", err);
return NextResponse.json({success:false,message:"Error signing up user.Please try again later"}, {status:500});
}
}