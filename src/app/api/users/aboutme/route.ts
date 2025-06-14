import {connectDB} from "@/dbConfig/dbConfig"
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/userModel";
import { getDataFromToken } from "@/helpers/getDataFromToken";

connectDB();

export async function POST(request: NextRequest) {
    //extract data from token
    const userId = await getDataFromToken(request);
    const user = await User.findOne({_id: userId }).select("-password");
    return NextResponse.json({
        message:"User Found",
        data:user
    });
}