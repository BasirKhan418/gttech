import { NextResponse ,NextRequest} from "next/server";
import { cookies } from "next/headers";
export async function GET(request: NextRequest) {
    try {
        let cookieObj = await cookies();
        cookieObj.delete("token");
        return NextResponse.json({ message: 'Logout successful',success:true }, { status: 200 });
    } catch (error) {
        console.error('Logout error:', error);
        return NextResponse.json({ message: 'Logout failed',success:false }, { status: 500 });
    }
}
