import { NextResponse, NextRequest } from "next/server";
import { getGAQs, addGAQ, updateGAQ, deleteGAQ, updateGAQStatus, getGAQStats } from "../../../../repository/db/gaq";
import { cookies } from "next/headers";
import VerifyJwt from "../../../../utils/VerifyJwt";
import { finduser } from "../../../../repository/db/auth";

export const GET = async (req: NextRequest) => {
    try {
        const url = new URL(req.url);
        const statsOnly = url.searchParams.get('stats');
        
        if (statsOnly === 'true') {
            const response = await getGAQStats();
            return NextResponse.json(response);
        }
        
        let response = await getGAQs();
        return NextResponse.json(response);
    } catch (error) {
        console.error("Error in GET /api/gaq:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Something went wrong please try again after sometime" 
        }, { status: 500 });
    }
};

// POST - Create new GAQ request (public endpoint)
export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        
        // Validate required fields
        const { name, email, phone, budget, projectType, requirementsPdf } = body;
        
        if (!name || !email || !phone || !budget || !projectType || !requirementsPdf) {
            return NextResponse.json({
                success: false,
                message: "All fields are required"
            }, { status: 400 });
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({
                success: false,
                message: "Invalid email format"
            }, { status: 400 });
        }
        
        // Validate project type
        if (!['solution', 'consultancy'].includes(projectType)) {
            return NextResponse.json({
                success: false,
                message: "Invalid project type"
            }, { status: 400 });
        }
        
        const response = await addGAQ(body);
        
        if (response.success) {
            return NextResponse.json(response, { status: 201 });
        } else {
            return NextResponse.json(response, { status: 500 });
        }
    } catch (error) {
        console.error("Error in POST /api/gaq:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Something went wrong please try again after sometime" 
        }, { status: 500 });
    }
};

// PUT - Update GAQ request (admin only)
export const PUT = async (req: NextRequest) => {
    try {
        // Verify admin authentication
        const getobj = await cookies();
        const token = getobj.get("token");
        const resultjst = await VerifyJwt(token?.value ?? "");
        
        if (!resultjst.success) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized access"
            }, { status: 401 });
        }
        
        //@ts-ignore
        const userdata = await finduser(resultjst?.data?.email);
        if (!userdata.success) {
            return NextResponse.json({
                success: false,
                message: "Admin user not found"
            }, { status: 401 });
        }
        
        const body = await req.json();
        const { id, status, adminNotes, ...updateData } = body;
        
        if (!id) {
            return NextResponse.json({
                success: false,
                message: "GAQ ID is required"
            }, { status: 400 });
        }
        
        let response;
        
        // If updating status, use special status update function
        if (status) {
            response = await updateGAQStatus(id, status, userdata.data._id, adminNotes);
        } else {
            response = await updateGAQ(id, updateData);
        }
        
        return NextResponse.json(response);
    } catch (error) {
        console.error("Error in PUT /api/gaq:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Something went wrong please try again after sometime" 
        }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest) => {
    try {
        // Verify admin authentication
        const getobj = await cookies();
        const token = getobj.get("token");
        const resultjst = await VerifyJwt(token?.value ?? "");
        
        if (!resultjst.success) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized access"
            }, { status: 401 });
        }
        
        const body = await req.json();
        const { id } = body;
        
        if (!id) {
            return NextResponse.json({
                success: false,
                message: "GAQ ID is required"
            }, { status: 400 });
        }
        
        const response = await deleteGAQ(id);
        return NextResponse.json(response);
    } catch (error) {
        console.error("Error in DELETE /api/gaq:", error);
        return NextResponse.json({ 
            success: false, 
            message: "Something went wrong please try again after sometime" 
        }, { status: 500 });
    }
};