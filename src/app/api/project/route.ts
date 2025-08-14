import { NextResponse, NextRequest } from "next/server";
import { getProjects, addProject, updateProject, deleteProject } from "../../../../repository/db/project";
import { cookies } from "next/headers";
import VerifyJwt from "../../../../utils/VerifyJwt";
import { finduser } from "../../../../repository/db/auth";

export const GET = async (req: NextRequest) => {
    try {
        let response = await getProjects();
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
        let response = await addProject({ ...body, lastEditedAuthor: userdata.data._id, author: userdata.data._id });
        return NextResponse.json({ success: true, message: "Project added successfully" });
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
        let response = await updateProject(body.id, { ...body, lastEditedAuthor: userdata.data._id });
        return NextResponse.json({ success: true, message: "Project updated successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong please try again after sometime" });
    }
}

export const DELETE = async (req: NextRequest) => {
    try {
        const body = await req.json();
        let response = await deleteProject(body.id);
        return NextResponse.json({ success: true, message: "Project deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong please try again after sometime" });
    }
}