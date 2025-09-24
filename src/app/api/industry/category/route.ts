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
        console.log('Category GET API called');
        const url = new URL(req.url);
        const includeInactive = url.searchParams.get('all') === 'true';
        
        console.log('Include inactive:', includeInactive);
        
        let response = includeInactive ? 
            await getAllIndustryCategories() : 
            await getIndustryCategories();
            
        console.log('Category response:', response);
        return NextResponse.json(response);
    } catch (error) {
        console.error('Category GET error:', error);
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
        
        // Validate required fields
        if (!body.name || !body.description) {
            return NextResponse.json({ 
                success: false, 
                message: "Name and description are required" 
            }, { status: 400 });
        }
        
        // Generate slug from name
        const slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        let response = await addIndustryCategory({ 
            ...body, 
            slug,
            lastEditedAuthor: userdata.data._id, 
            author: userdata.data._id,
        });
        
        return NextResponse.json({ success: true, message: "Industry category added successfully" });
    } catch (error) {
        console.error('Category POST error:', error);
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
        
        if (!body.id) {
            return NextResponse.json({ 
                success: false, 
                message: "Category ID is required" 
            }, { status: 400 });
        }
        
        // Generate slug from name if name is being updated
        if (body.name) {
            body.slug = body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        
        let response = await updateIndustryCategory(body.id, { ...body, lastEditedAuthor: userdata.data._id });
        return NextResponse.json({ success: true, message: "Industry category updated successfully" });
    } catch (error) {
        console.error('Category PUT error:', error);
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
                message: "Category ID is required" 
            }, { status: 400 });
        }
        
        let response = await deleteIndustryCategory(body.id);
        return NextResponse.json({ success: true, message: "Industry category deleted successfully" });
    } catch (error) {
        console.error('Category DELETE error:', error);
        return NextResponse.json({ 
            success: false, 
            message: "Something went wrong please try again after sometime" 
        }, { status: 500 });
    }
}