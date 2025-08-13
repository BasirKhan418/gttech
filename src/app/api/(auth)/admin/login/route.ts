import { NextResponse, NextRequest } from "next/server";
import { finduser } from "../../../../../../repository/db/auth";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import CryptoJS from "crypto-js";
export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        //intializing cookies
        const cookieObj = await cookies();
        const data = await req.json();
        const { email, password } = data;
        const result = await finduser(email);
        
        console.log("User found:", result);
        if (!result.success) {
            console.error("Error finding user:", result.message);
            return NextResponse.json({ success: false, message: "Admin does not exists!" }, { status: 500 });
        }

        let decryptpss = CryptoJS.AES.decrypt(result.data.password, process.env.CRYPTOJS_SECRET || "").toString(CryptoJS.enc.Utf8);

        if (decryptpss !== password) {
            return NextResponse.json({ success: false, message: "Invalid credentials!" }, { status: 401 });
        }
        const token = jwt.sign({ email, name: result.data.name, userid: result.data._id }, process.env.JWT_SECRET || "");
        //setting cookies
        cookieObj.set('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
        });
        return NextResponse.json({ success: true, message: "Login successful!", token });
    }
    catch (err) {
        console.error("Error during login:", err);
        return NextResponse.json({ success: false, message: "Error processing request. Please try again later." }, { status: 500 });
    }

}