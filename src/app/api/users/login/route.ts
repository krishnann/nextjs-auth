import {connectDB} from "@/dbConfig/dbConfig"
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request: NextRequest) {
try {
    //reqBody will have the object with email and password
    const reqBody = await request.json();
    const {email, password} = reqBody;
    const user = await User.findOne({email});
    if(!user){
        return NextResponse.json({error: "User doesn't exist!"}, {status: 400});
    }

    console.log("User exist");

    const validPassword = await bcrypt.compare(password, user.password);
    // const isVerified = user.isVerified;

    if(!validPassword){
        return NextResponse.json({error: "Check your credentials!"}, { status: 400});
    }
    // else if(!isVerified){
    //     return NextResponse.json({error: "Not Verified!"}, { status: 403});
    // }

    const tokenData = {
        id: user._id,
        username: user.username,
        email: user.email,
    }

    //This code is responsible for generating a JSON Web Token (JWT) for a user, typically after successful authentication. First, it creates a tokenData object containing the user's unique identifier (id), username, and email. These fields will be embedded in the token's payload, allowing the server (and sometimes the client) to identify the user and access their basic information without querying the database on every request.
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, { expiresIn: '1d' });

    const response = NextResponse.json({message:"Logged In Successfully!", success: true});
    //here the token is set and it will expire in 1 day
    response.cookies.set("token", token, {httpOnly: true});

    return response;
} catch (error:any) {
    return NextResponse.json({error: error.message}, {status: 500});
}
}