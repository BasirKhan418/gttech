import { NextResponse, NextRequest } from "next/server";
import { 
    getIndustryCategories, 
    getAllIndustryCategories,
    addIndustryCategory, 
    updateIndustryCategory, 
    deleteIndustryCategory 
} from "../../../../../repository/db/industry";
import { cookies } from "next/headers";
import VerifyJwt from "../../../../../utils/VerifyJwt";
import { finduser } from "../../../../../repository/db/auth";

export const GET = async (req: NextRequest) => {
    try {
        const url = new URL(req.url);
        const includeInactive = url.searchParams.get('all') === 'true';
        
        let response = includeInactive ? 
            await getAllIndustryCategories() : 
            await getIndustryCategories();
            
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
        
        // Generate slug from name
        const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        let response = await addIndustryCategory({ 
            ...body, 
            slug,
            lastEditedAuthor: userdata.data._id, 
            author: userdata.data._id 
        });
        return NextResponse.json({ success: true, message: "Industry category added successfully" });
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
        
        // Generate slug from name if name is being updated
        if (body.name) {
            body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        
        let response = await updateIndustryCategory(body.id, { ...body, lastEditedAuthor: userdata.data._id });
        return NextResponse.json({ success: true, message: "Industry category updated successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong please try again after sometime" });
    }
}

export const DELETE = async (req: NextRequest) => {
    try {
        const body = await req.json();
        let response = await deleteIndustryCategory(body.id);
        return NextResponse.json({ success: true, message: "Industry category deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong please try again after sometime" });
    }
}