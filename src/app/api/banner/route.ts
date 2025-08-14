import { NextResponse,NextRequest } from "next/server";
import { getBanners,addBanner,updateBanner,deleteBanner } from "../../../../repository/db/banner";
import { cookies } from "next/headers";
import { finduser } from "../../../../repository/db/auth";
import VerifyJwt from "../../../../utils/VerifyJwt";
export const GET = async (req: NextRequest) => {
    try{
        let response = await getBanners();
        return NextResponse.json(response);
    }
    catch(error){
        return NextResponse.json({success:false,message:"Something went wrong please try again after sometime"});
    }
}

export const POST = async (req: NextRequest) => {
    try {
         let getobj = await cookies();
                let token = getobj.get("token");
                let resultjst = await VerifyJwt(token?.value ?? "");
                //@ts-ignore
                const userdata = await finduser(resultjst?.data?.email);
        let body = await req.json();
        let response = await addBanner({...body,lastEditedAuthor: userdata.data._id,author: userdata.data._id});
        return NextResponse.json({success:true,message:"Banner added successfully"});
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong please try again after sometime" });
    }
}

export const PUT = async (req: NextRequest) => {
    try{
let getobj = await cookies();
                let token = getobj.get("token");
                let resultjst = await VerifyJwt(token?.value ?? "");
                //@ts-ignore
                const userdata = await finduser(resultjst?.data?.email);
        let body = await req.json();
        let response = await updateBanner(body.id,{...body,lastEditedAuthor: userdata.data._id});
        return NextResponse.json({success:true,message:"Banner updated successfully"});
    }
    catch(error){
        return NextResponse.json({ success: false, message: "Something went wrong please try again after sometime" });
    }
}


export const DELETE = async (req: NextRequest) => {
    try {
        const body = await req.json();
        let response = await deleteBanner(body.id);
        return NextResponse.json({ success: true, message: "Banner deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong please try again after sometime" });
    }
}
