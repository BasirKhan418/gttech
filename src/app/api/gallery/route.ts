import { NextResponse, NextRequest } from "next/server";
import { getGallery, addGallery, updateGallery, deleteGallery } from "../../../../repository/db/gallery";
import { cookies } from "next/headers";
import VerifyJwt from "../../../../utils/VerifyJwt";
import { finduser } from "../../../../repository/db/auth";

export const GET = async (req: NextRequest) => {
    try {
        let response = await getGallery();
        return NextResponse.json({ success: true, data: response.data });
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
        let response = await addGallery({ ...body, lastEditedAuthor: userdata.data._id, author: userdata.data._id });
        return NextResponse.json({ success: true, message: "Gallery item added successfully" });
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
        let response = await updateGallery(body.id, { ...body, lastEditedAuthor: userdata.data._id });
        return NextResponse.json({ success: true, message: "Gallery item updated successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong please try again after sometime" });
    }
}

export const DELETE = async (req: NextRequest) => {
    try {
        const body = await req.json();
        let response = await deleteGallery(body.id);
        return NextResponse.json({ success: true, message: "Gallery item deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong please try again after sometime" });
    }
}