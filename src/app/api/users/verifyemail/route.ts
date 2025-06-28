import {connectDB} from "@/dbConfig/dbConfig"
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/userModel";

connectDB();

export async function POST(request: NextRequest){
try {
    const reqBody = await request.json();
    const {token} = reqBody
    console.log("token = ", token)
    //$gt: Date.now() - Checks if the current time is greater than the expiry time set for the token
    const user = await User.findOne({verifyToken:token, verifyTokenExpiry: {$gt: Date.now()}});
    if(!user){
        return NextResponse.json({error: "Invalid token"});
    }
    console.log("Verified User = ", user);
    user.isVerified = true,
    user.verifyToken = undefined,
    user.verifyTokenExpiry = undefined

    await user.save()
    return NextResponse.json({message: "User verified successfully!", success: true});
} catch (error:any) {
    return NextResponse.json({error: error.message}, {status: 500})
}
}