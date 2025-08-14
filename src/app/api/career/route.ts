import { NextResponse, NextRequest } from "next/server";
import { getCareers, addCareer, updateCareer, deleteCareer } from "../../../../repository/db/career";
import { cookies } from "next/headers";
import VerifyJwt from "../../../../utils/VerifyJwt";
import { finduser } from "../../../../repository/db/auth";

export const GET = async (req: NextRequest) => {
    try {
        let response = await getCareers();
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
        let response = await addCareer({ ...body, lastEditedAuthor: userdata.data._id, author: userdata.data._id });
        return NextResponse.json({ success: true, message: "Job posting added successfully" });
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
        let response = await updateCareer(body.id, { ...body, lastEditedAuthor: userdata.data._id });
        return NextResponse.json({ success: true, message: "Job posting updated successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong please try again after sometime" });
    }
}

export const DELETE = async (req: NextRequest) => {
    try {
        const body = await req.json();
        let response = await deleteCareer(body.id);
        return NextResponse.json({ success: true, message: "Job posting deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong please try again after sometime" });
    }
}