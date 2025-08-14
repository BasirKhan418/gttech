import { NextResponse ,NextRequest} from "next/server";
import { cookies } from "next/headers";
import VerifyJwt from "../../../../../../utils/VerifyJwt";
import { finduser } from "../../../../../../repository/db/auth";

export const GET = async (req: NextRequest) => {
    try{
        let getobj = await cookies();
        let token = getobj.get("token");
        
        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
        }
        
        const resultjst = await VerifyJwt(token?.value ?? "");
        if (!resultjst) {
            return NextResponse.json({ success: false, message: "Unauthorized access" }, { status: 401 });
        }
        
        //@ts-ignore
        const data= await finduser(resultjst?.data?.email);
        if(!data.success){
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }
        // Here you can add logic to verify the token if needed
        return NextResponse.json({ success: true, message: "Health check successful",data:data.data }, { status: 200 });
    }
    catch(err){
        return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
    }
}