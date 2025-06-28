'use client';
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import {connectDB} from "@/dbConfig/dbConfig";

//connect to the db
connectDB();

export default function verifyEmailPage() {
  //get the token from the URL ?token=<token>
  // const searchParams = new URLSearchParams(window.location.search);
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const [error, setError] = useState(false);
  // const token = searchParams.get("token");

   //Resend verification will send and email to the user again with verification link having a token
  // This function will be called when the user clicks on the resend verification link button
  const resendVerificationLink = async () => {
    console.log("Resending verification link for token: ", token);
    /*TODO:: If verification email is sent then set a state having a boolean parameter.
     if true then show message verification email is sent to registerd email address
    */
    try {
      const response = await axios.post("/api/users/resendverificationemail", {token});
      if (response.data.success) {      
        console.log("Verification email resent successfully: ", response.data);
        setVerificationEmailSent(true);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error("Error resending verification email: ", err);
      setError(true);
    }
  };
  console.log("Token from URL: ", token);
  const verifyToken = async () => {
    try {
      const response = await axios.post("/api/users/verifyemail", {token});
      if (response.data.success) {
        console.log("Email verified successfully: ", response.data);
        setIsVerified(true);
      } else {
        setError(true);
        console.error("--> Verification failed: ", response.data.error);
        if(response.data.error === "Invalid token"){
          console.log("Token has expired")
        }
      }
    } catch (error: any) {
      console.error("Error verifying email: ", error.response.data);
    }
  };

  // This will take the token from url when the component mounts
  useEffect(() => {
    const tokenFromURL = searchParams.get("token");
    // const urlToken = window.location.search.split("=")[1];
    // setToken(urlToken || "");
    if (tokenFromURL) {
      console.log("Token from URL: ", tokenFromURL);
      setToken(tokenFromURL);
    } else {
      console.error("No token found in the URL.");
      //gets the user details from db
    }
  }, []);

  // Once the token is set it will verify the token
  useEffect(() => {
    if (token.length > 0) {
      verifyToken();
    }
  }, [token]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">

      <h1 className="text-4xl py-2">Verify Email</h1>
      <h2 className="p-2 bg-orange-500 text-black">{token ? `${token}` : "no token"}</h2>

      {isVerified && (
        <div>
          <h2 className="text-2xl">Email Verified</h2>
          <Link href="/login" className='bg-blue-500 text-white p-2 rounded-lg'>
            Login
          </Link>
        </div>
      )}
      {verificationEmailSent && (
        <div>
          <h2>Verification email is re-sent on the registered email address</h2>
          <p>Please verify your account and then try to <Link href="/login">login</Link> again</p>
        </div>
      )}
      {!isVerified && (
        <div className='text-center'>
          <h2 className="text-2xl text-red-600 py-2">Your verification link is expired</h2>
          <button type='button' className='bg-blue-500 text-white p-2 rounded-lg' id='resend-verification-btn' onClick={resendVerificationLink}>
            Resend Verification link
          </button>
        </div>
      )}
    </div>
  )
}
