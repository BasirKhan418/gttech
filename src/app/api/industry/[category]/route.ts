import { NextResponse, NextRequest } from "next/server";
import { getIndustriesByCategory } from "../../../../../repository/db/industry";

export const GET = async (req: NextRequest, { params }: { params: { category: string } }) => {
    try {
        const category = params.category;
        let response = await getIndustriesByCategory(category);
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong please try again after sometime" });
    }
}