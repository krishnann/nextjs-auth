'use client';
import {useEffect, useState} from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { set } from 'mongoose';
  
// Make sure your API route is at src/app/api/users/resetpassword/route.ts
const forgotPasswordPage = () => {
  const router = useRouter();

  // const [resetPasswordDetails, setResetPasswordDetails] = useState({
  //   emailId: "",
  //   code: 0,
  // });

  const [emailId, setEmailId] = useState("");
  
  const [code, setCode] = useState(0);

  const [buttonEmailDisabled, setButtonEmailDisabled] = useState(false);

  const [loading, setLoading] = useState(false);

  const [isEmailSent, setIsEmailSent] = useState(false);

  const onSubmit = async()=>{
    try {
      setLoading(true);
      console.log('Email to reset password: ', emailId);
      const response = await axios.post("/api/users/resetpasswordemail", { emailId });
    //   router.push("/profile");
    if (response.data.success) {
        setLoading(false);
        toast.success("Reset password code sent to your email!");
        console.log("Reset password code sent successfully: ", response.data);
        setIsEmailSent(true)
      }
    } catch (error:any) {
      setLoading(false);
      toast.error("Reset password for submission failed: " + error.message);
      console.error("Reset password for submission failed: - ERROR:: ", error.message);
    }
  }

  const handleResetPasswordCode = async () => {
    try {
      const response = await axios.post("/api/users/resetpasswordcode", { emailId, code });
      if (response.data.success) {
        setLoading(false);
        toast.success("Reset password code verified successfully!");
        console.log("Reset password code verified successfully: ", response.data);
        // Redirect to the reset password page
        router.push("/resetpassword");
      }
    } catch (error:any) {
      setLoading(false);
      toast.error("Reset password code verification failed: " + error.message);
      console.error("Reset password code verification failed - ERROR:: ", error.message);
    }
  }

  // Enable/Disabled the email button of the email id submission form
  useEffect(() => {
    if (emailId) {
      setButtonEmailDisabled(false);
    } else {
      setButtonEmailDisabled(true);
    }
  }, [emailId]);

  return (
     <div>
      <div className='max-w-md mx-auto my-10 p-5 border rounded-lg shadow-lg bg-zinc-900'>
      <h1 className="text-2xl font-bold mb-4">Password Reset</h1>
      <div className={`mb-4 ${isEmailSent ? 'hidden' : ''}`}>
      <p className='mb-4'>Enter the email address or mobile phone number associated with your Amazon account.</p>
      <div className="mb-4">
        <label className="block mb-2">Email</label>
        <input
          type="email"
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
          className="border p-2 w-full"
        />
      </div>
      <button
        onClick={onSubmit}
        disabled={buttonEmailDisabled || loading}
        className={`bg-blue-500 text-white px-4 py-2 w-full rounded-3xl cursor-pointer ${buttonEmailDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? "Sending email..." : "Send Reset Code"}
      </button>
      </div>
      {/* Form to enter the reset password code sent to the email of the user */}
      <div className={`mb-4 ${isEmailSent ? '' : 'hidden'}`}>
        <p className='mb-4'>A reset password code has been sent to your email.</p>
        <div className="mb-4">
          <label className="block mb-2">Code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(Number(e.target.value))}
            className="border p-2 w-full"
          />
        </div>
        <button
          onClick={handleResetPasswordCode}
          disabled={loading}
          className={`bg-blue-500 text-white px-4 py-2 w-full rounded-3xl cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          { loading ? "Verifying..." : "Verify Code"}
        </button>
      </div>
 
    </div>
    </div>
  )
}

export default forgotPasswordPage