import {connectDB} from "@/dbConfig/dbConfig"
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/userModel";
import { sendEmail } from '@/helpers/mailer';

connectDB();

export async function POST(request: NextRequest) {
try {
    const reqBody = await request.json();
    const {token} = reqBody
    const user = await User.findOne({verifyToken:token});//TODO:Check if the expiry of the token has epxired
    console.log("User = ", user);
    if (!user) {
        return NextResponse.json({error: "User not found"}, {status: 404});
    }
    // TODO: Send verification email
    await sendEmail({email: user.email, emailType: "VERIFY", userId: user._id});
    return NextResponse.json({success: true});
} catch (error:any) {
    console.error("Error in resend verification email: ", error);
    return NextResponse.json({error: error.message}, {status: 500});
}
}
