import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide a username"],
        unique: true
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please provide a password"]
    },
    isVerified:{
        type: Boolean,
        default: false//User is not verified by default
    },
    isAdmin:{
        type: Boolean,
        default: false
    },
    forgotPasswordCode: {
        type: Number,
        required: false
    },
    verifyToken:String,
    verifyTokenExpiry:Date,
})

const User = mongoose.models.users || mongoose.model("users", userSchema);

export default User;