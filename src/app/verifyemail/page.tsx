'use client';
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

export default function verifyEmailPage() {
  //get the token from the URL ?token=<token>
  // const searchParams = new URLSearchParams(window.location.search);
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState(false);
  // const token = searchParams.get("token");
  console.log("Token from URL: ", token);
  const verifyToken = async () => {
    try {
      const response = await axios.post("/api/users/verifyemail", {token});
      if (response.data.success) {
        toast.success("Email verified successfully!");
        console.log("Email verified successfully: ", response.data);
        setIsVerified(true);
      } else {
        setError(true);
        console.error("--> Verification failed: ", response.data.error);
        toast.error("Verification failed: " + response.data.error);
      }
    } catch (error: any) {
      console.error("Error verifying email: ", error.response.data);
      toast.error("An error occurred while verifying email.");
    }
  };

  useEffect(() => {
    const tokenFromURL = searchParams.get("token");
    // const urlToken = window.location.search.split("=")[1];
    // setToken(urlToken || "");
    if (tokenFromURL) {
      console.log("Token from URL: ", tokenFromURL);
      setToken(tokenFromURL);
    } else {
      console.error("No token found in the URL.");
      toast.error("No token found in the URL.");
    }
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyToken();
    }
  }, [token]);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">

      <h1 className="text-4xl">Verify Email</h1>
      <h2 className="p-2 bg-orange-500 text-black">{token ? `${token}` : "no token"}</h2>

      {isVerified && (
        <div>
          <h2 className="text-2xl">Email Verified</h2>
          <Link href="/login">
            Login
          </Link>
        </div>
      )}
      {error && (
        <div>
          <h2 className="text-2xl bg-red-500 text-black">Error</h2>
        </div>
      )}
    </div>
  )
}
