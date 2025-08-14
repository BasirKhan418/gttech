import { NextResponse, NextRequest } from "next/server";
import { getIndustries, addIndustry, updateIndustry, deleteIndustry } from "../../../../repository/db/industry";
import { cookies } from "next/headers";
import VerifyJwt from "../../../../utils/VerifyJwt";
import { finduser } from "../../../../repository/db/auth";

export const GET = async (req: NextRequest) => {
    try {
        let response = await getIndustries();
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong please try again after sometime" });
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
        
        // Generate slug from title
        const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        let response = await addIndustry({ 
            ...body, 
            slug,
            lastEditedAuthor: userdata.data._id, 
            author: userdata.data._id 
        });
        return NextResponse.json({ success: true, message: "Industry added successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong please try again after sometime" });
    }
}

export const PUT = async (req: NextRequest) => {
    try {
        let getobj = await cookies();
        let token = getobj.get("token");
        let resultjst = await VerifyJwt(token?.value ?? "");
        //@ts-ignore
        const userdata = await finduser(resultjst?.data?.email);
        
        let body = await req.json();
        
        // Generate slug from title if title is being updated
        if (body.title) {
            body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        
        let response = await updateIndustry(body.id, { ...body, lastEditedAuthor: userdata.data._id });
        return NextResponse.json({ success: true, message: "Industry updated successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong please try again after sometime" });
    }
}

export const DELETE = async (req: NextRequest) => {
    try {
        const body = await req.json();
        let response = await deleteIndustry(body.id);
        return NextResponse.json({ success: true, message: "Industry deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong please try again after sometime" });
    }
}
