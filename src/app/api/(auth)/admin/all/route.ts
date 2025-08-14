import { NextResponse,NextRequest } from "next/server";
import { fetchAdminsFromDB } from "../../../../../../repository/db/auth";
export const GET = async (req: NextRequest) => {
  try {
    const data = await fetchAdminsFromDB();
    if(!data.success){
        return NextResponse.json({ success: false, message: data.message }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: data.message, admins: data.data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching admins:", error);
    return NextResponse.error();
  }
};
