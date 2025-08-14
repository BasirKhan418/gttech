import { NextResponse, NextRequest } from "next/server";
import { getIndustries, addIndustry, updateIndustry, deleteIndustry } from "../../../../repository/db/industry";
import { cookies } from "next/headers";
import VerifyJwt from "../../../../utils/VerifyJwt";
import { finduser } from "../../../../repository/db/auth";

export const GET = async (req: NextRequest) => {
    try {
        console.log('Industry GET API called');
        let response = await getIndustries();
        console.log('Industry response:', response);
        return NextResponse.json(response);
    } catch (error) {
        console.error('Industry GET error:', error);
        return NextResponse.json({ 
            success: false, 
            message: "Something went wrong please try again after sometime",
            data: []
        }, { status: 500 });
    }
}

export const POST = async (req: NextRequest) => {
    try {
        let getobj = await cookies();
        let token = getobj.get("token");
        
        if (!token) {
            return NextResponse.json({ 
                success: false, 
                message: "Unauthorized - No token provided" 
            }, { status: 401 });
        }
        
        let resultjst = await VerifyJwt(token.value);
        
        if (!resultjst.success) {
            return NextResponse.json({ 
                success: false, 
                message: "Unauthorized - Invalid token" 
            }, { status: 401 });
        }
        
        //@ts-ignore
        const userdata = await finduser(resultjst?.data?.email);
        
        if (!userdata.success) {
            return NextResponse.json({ 
                success: false, 
                message: "User not found" 
            }, { status: 404 });
        }
        
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
        console.error('Industry POST error:', error);
        return NextResponse.json({ 
            success: false, 
            message: "Something went wrong please try again after sometime" 
        }, { status: 500 });
    }
}

export const PUT = async (req: NextRequest) => {
    try {
        let getobj = await cookies();
        let token = getobj.get("token");
        
        if (!token) {
            return NextResponse.json({ 
                success: false, 
                message: "Unauthorized - No token provided" 
            }, { status: 401 });
        }
        
        let resultjst = await VerifyJwt(token.value);
        
        if (!resultjst.success) {
            return NextResponse.json({ 
                success: false, 
                message: "Unauthorized - Invalid token" 
            }, { status: 401 });
        }
        
        //@ts-ignore
        const userdata = await finduser(resultjst?.data?.email);
        
        if (!userdata.success) {
            return NextResponse.json({ 
                success: false, 
                message: "User not found" 
            }, { status: 404 });
        }
        
        let body = await req.json();
        
        // Generate slug from title if title is being updated
        if (body.title) {
            body.slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        
        let response = await updateIndustry(body.id, { ...body, lastEditedAuthor: userdata.data._id });
        return NextResponse.json({ success: true, message: "Industry updated successfully" });
    } catch (error) {
        console.error('Industry PUT error:', error);
        return NextResponse.json({ 
            success: false, 
            message: "Something went wrong please try again after sometime" 
        }, { status: 500 });
    }
}

export const DELETE = async (req: NextRequest) => {
    try {
        let getobj = await cookies();
        let token = getobj.get("token");
        
        if (!token) {
            return NextResponse.json({ 
                success: false, 
                message: "Unauthorized - No token provided" 
            }, { status: 401 });
        }
        
        let resultjst = await VerifyJwt(token.value);
        
        if (!resultjst.success) {
            return NextResponse.json({ 
                success: false, 
                message: "Unauthorized - Invalid token" 
            }, { status: 401 });
        }
        
        const body = await req.json();
        
        if (!body.id) {
            return NextResponse.json({ 
                success: false, 
                message: "Industry ID is required" 
            }, { status: 400 });
        }
        
        let response = await deleteIndustry(body.id);
        return NextResponse.json({ success: true, message: "Industry deleted successfully" });
    } catch (error) {
        console.error('Industry DELETE error:', error);
        return NextResponse.json({ 
            success: false, 
            message: "Something went wrong please try again after sometime" 
        }, { status: 500 });
    }
}