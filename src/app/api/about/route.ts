import { NextResponse, NextRequest } from "next/server";
import { getAbout,updateAbout,addAbout } from "../../../../repository/db/about";
import { cookies } from "next/headers";
import { finduser } from "../../../../repository/db/auth";
import VerifyJwt from "../../../../utils/VerifyJwt";

export const GET = async (req: NextRequest) => {
    try {
        let response = await getAbout();
        return NextResponse.json(response);
    }
    catch (error) {
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

        // Check if about document already exists
        let existingAbout = await getAbout();
        if (existingAbout.success && existingAbout.data.length > 0) {
            return NextResponse.json({ success: false, message: "About page already exists. Use PUT method to update." });
        }

        let body = await req.json();
        let response = await addAbout({ ...body, lastEditedAuthor: userdata.data._id, author: userdata.data._id });
        return NextResponse.json({ success: true, message: "About page created successfully" });
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

        // Get existing about document
        let existingAbout = await getAbout();
        if (!existingAbout.success || existingAbout.data.length === 0) {
            return NextResponse.json({ success: false, message: "No about page exists. Use POST method to create." });
        }

        let body = await req.json();
        // Update the existing document (assuming there's only one about document)
        let aboutId = existingAbout.data[0]._id;
        let response = await updateAbout(aboutId, { ...body, lastEditedAuthor: userdata.data._id });
        return NextResponse.json({ success: true, message: "About page updated successfully" });
    }
    catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong please try again after sometime" });
    }
}