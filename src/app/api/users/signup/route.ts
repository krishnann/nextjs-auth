import {connectDB} from "@/dbConfig/dbConfig"
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/userModel";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connectDB();

//Sign up will get the user registeration details such as username, email, password etc
export async function POST(request: NextRequest) {
try {
    // Get the details of the user and insert it in the db, First check if the user already exisit in the db or not
    const reqBody = await request.json()//{username:"", email:"", password:""}
    const {username, email, password} = reqBody

    console.log("reqBody = ", reqBody);
    console.log("user details = ", username, email)

    const user = await User.findOne({email})//Check if the user already exisit in the DB
    console.log("user ==> ", user);
    if(user) {
        return NextResponse.json({error:"User already exist"}, {status: 400}) 
    }

    // Using bcrypt to hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user and insert it in the users table of the the DB
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    })

    const savedUser = await newUser.save();
    console.log("savedUser = ", savedUser)

    // Send verification email
    await sendEmail({email, emailType: "VERIFY", userId: savedUser._id})

    return NextResponse.json({message:"User registered successfully!", sucess: true, savedUser})

} catch (error: any) {
    return NextResponse.json({error: error.message}, {status: 500})
}
}