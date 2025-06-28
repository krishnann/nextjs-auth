import {connectDB} from "@/dbConfig/dbConfig"
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/userModel";
import { sendEmail } from '@/helpers/mailer';

connectDB();

export async function POST(request: NextRequest) {
try {
    console.log("Resend verification email API called");
    const reqBody = await request.json();
    console.log("Request body: ", reqBody);
    const { emailId } = reqBody;
    console.log("emailId = ", emailId);
    // const {email} = reqBody
    // console.log("emailID = ", email);
    const user = await User.findOne({email: emailId});//TODO:Check if the expiry of the token has epxired
    console.log("User = ", user);

    if (!user) {
        return NextResponse.json({error: "User not found"}, {status: 404});
    }
    //TODO: Send reset password email
    await sendEmail({email: user.email, emailType: "RESET_PASSWORD", userId: user._id});
    return NextResponse.json({success: true});
} catch (error:any) {
    console.error("Error in resend verification email: ", error);
    return NextResponse.json({error: error.message}, {status: 500});
}
}
