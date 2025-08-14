import { NextResponse, NextRequest } from "next/server";
import { getIndustryBySlug } from "../../../../../../repository/db/industry";

export const GET = async (req: NextRequest, { params }: { params: { slug: string } }) => {
    try {
        const slug = params.slug;
        let response = await getIndustryBySlug(slug);
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ success: false, message: "Something went wrong please try again after sometime" });
    }
}