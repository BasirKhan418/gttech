import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getContent,createContent,updateContent,deleteContent } from "../../../../repository/db/content";
import { cookies } from "next/headers";
import VerifyJwt from "../../../../utils/VerifyJwt";
import { finduser } from "../../../../repository/db/auth";
//fetch all content

export const GET = async (req: NextRequest, res: NextResponse) => {
    try {
        const content = await getContent();
        if (content.success) {
            return NextResponse.json({ success: true, data: content.data }, { status: 200 });
        }
        return NextResponse.json({ success: false, message: "Error fetching content. Please try again later." }, { status: 500 });
    } catch (err: any) {
        console.log("error is ", err.message);
        return NextResponse.json({ success: false, message: "Error processing request. Please try again later." }, { status: 500 });
    }
}

export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        let getobj = await cookies();
        let token = getobj.get("token");
        let resultjst = await VerifyJwt(token?.value ?? "");
        //@ts-ignore
        const userdata = await finduser(resultjst?.data?.email);

        const data  =await req.json();
        const content = await createContent({...data,lastEditedAuthor: userdata.data._id,author: userdata.data._id});
        console.log("Content created:", content);
        if (content.success) {
            return NextResponse.json({ success: true, data: content.data }, { status: 201 });
        }
        return NextResponse.json({ success: false, message: "Error creating content. Please try again later." }, { status: 500 });
    } catch (err: any) {
        console.log("error is ", err.message);
        return NextResponse.json({ success: false, message: "Error processing request. Please try again later." }, { status: 500 });
    }
}


export const PUT = async (req: NextRequest, res: NextResponse) => {
    try{
        const data = await req.json();
         let getobj = await cookies();
        let token = getobj.get("token");
        let resultjst = await VerifyJwt(token?.value ?? "");
        //@ts-ignore
        const userdata = await finduser(resultjst?.data?.email);
        const content = await updateContent(data.id,{...data,lastEditedAuthor: userdata.data._id});
        if (content.success) {
            return NextResponse.json({ success: true, data: content.data }, { status: 200 });
        }
        return NextResponse.json({ success: false, message: "Error updating content. Please try again later." }, { status: 500 });
    }
    catch(err: any) {
        return NextResponse.json({ success: false, message: "Error processing request. Please try again later." }, { status: 500 });
    }
}


export const DELETE = async (req: NextRequest, res: NextResponse) => {
    try{
        const data = await req.json();
        //@ts-ignore
        const content = await deleteContent(data.id);
        if (content.success) {
            return NextResponse.json({ success: true, message:"Content deleted successfully." }, { status: 200 });
        }
        return NextResponse.json({ success: false, message: "Error deleting content. Please try again later." }, { status: 500 });
    }
    catch(err: any) {
        return NextResponse.json({ success: false, message: "Error processing request. Please try again later." }, { status: 500 });
    }
}