'use client';
import {useEffect, useState} from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function signupPage() {

  const router = useRouter();

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  // this is to disable the button if the user doesn't fill all the fields
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [loading, setLoading] = useState(false);

  const onSignup = async()=>{
    try {
      setLoading(true);
      const response = await axios.post("/api/users/signup", user);
      console.log("Sign up response: ", response.data);
      toast.success("Sign up successful!");
      router.push("/verify");// user is redirected to the verify page after successful sign up
    } catch (error:any) {
      console.error("Sign up failed - ERROR:: ", error.message);
    }
  }

  useEffect(() => {
    if (user.username.length > 0 && user.email.length > 0 && user.password.length > 7) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div>
      <div className='max-w-md mx-auto my-10 p-5 border rounded-lg shadow-lg bg-zinc-900'>
      <h1 className="text-2xl font-bold mb-4">{loading ? "Loading..." : "Sign Up"}</h1>
      <div className="mb-4">
        <label className="block mb-2">Username</label>
        <input
          type="text"
          value={user.username}
          onChange={(e) => setUser({...user, username: e.target.value})}
          className="border p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Email</label>
        <input
          type="email"
          value={user.email}
          onChange={(e) => setUser({...user, email: e.target.value})}
          className="border p-2 w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Password</label>
        <input
          type="password"
          value={user.password}
          onChange={(e) => setUser({...user, password: e.target.value})}
          className="border p-2 w-full"
        />
      </div>
      <button
        onClick={onSignup}
        disabled={buttonDisabled || loading}
        className={`bg-blue-500 text-white p-2 rounded ${buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
        <div className='my-10 p-5 border rounded-lg shadow-lg bg-zinc-900'>
        <p className='text-sm'>Already have an account? <a href="/login" className='text-blue-500'>Login</a></p>
        </div>
      </div>
 
    </div>
  )
}
