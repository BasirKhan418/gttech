import { NextResponse, NextRequest } from "next/server";
import { getAddresses, getAllAddresses, addAddress, updateAddress, deleteAddress, updateDisplayOrder } from "../../../../repository/db/address";
import { finduser } from "../../../../repository/db/auth";
import VerifyJwt from "../../../../utils/VerifyJwt";
import { cookies } from "next/headers";

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const getAll = searchParams.get("all");
        
        let response;
        if (getAll === "true") {
            response = await getAllAddresses();
        } else {
            response = await getAddresses();
        }
        
        return NextResponse.json({ success: true, data: response });
    } catch (error) {
        console.error("Error in GET addresses:", error);
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

        const data = await req.json();
        
        // Handle display order update
        if (data.action === "updateDisplayOrder") {
            const content = await updateDisplayOrder(data.addressUpdates);
            if (content.success) {
                return NextResponse.json({ success: true, message: "Display order updated successfully" }, { status: 200 });
            }
            return NextResponse.json({ success: false, message: "Error updating display order. Please try again later." }, { status: 500 });
        }
        
        // Handle adding new address
        const content = await addAddress({ 
            ...data, 
            lastEditedAuthor: userdata.data._id, 
            author: userdata.data._id 
        });
        
        console.log("Address created:", content);
        if (content.success) {
            return NextResponse.json({ success: true, message: "Address added successfully" }, { status: 201 });
        }
        return NextResponse.json({ success: false, message: "Error creating address. Please try again later." }, { status: 500 });
    } catch (err: any) {
        console.log("error is ", err.message);
        return NextResponse.json({ success: false, message: "Error processing request. Please try again later." }, { status: 500 });
    }
}

export const PUT = async (req: NextRequest) => {
    try {
        const data = await req.json();
        let getobj = await cookies();
        let token = getobj.get("token");
        let resultjst = await VerifyJwt(token?.value ?? "");
        //@ts-ignore
        const userdata = await finduser(resultjst?.data?.email);
        
        const content = await updateAddress(data.id, { 
            ...data, 
            lastEditedAuthor: userdata.data._id 
        });
        
        if (content.success) {
            return NextResponse.json({ success: true, data: content.data, message: "Address updated successfully" }, { status: 200 });
        }
        return NextResponse.json({ success: false, message: "Error updating address. Please try again later." }, { status: 500 });
    } catch (err: any) {
        console.error("Error in PUT address:", err);
        return NextResponse.json({ success: false, message: "Error processing request. Please try again later." }, { status: 500 });
    }
}

export const DELETE = async (req: NextRequest) => {
    try {
        const data = await req.json();
        const content = await deleteAddress(data.id);
        
        if (content.success) {
            return NextResponse.json({ success: true, message: "Address deleted successfully." }, { status: 200 });
        }
        return NextResponse.json({ success: false, message: "Error deleting address. Please try again later." }, { status: 500 });
    } catch (err: any) {
        console.error("Error in DELETE address:", err);
        return NextResponse.json({ success: false, message: "Error processing request. Please try again later." }, { status: 500 });
    }
}