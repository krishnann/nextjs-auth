'use client';
import {useEffect, useState} from 'react'
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { set } from 'mongoose';
  
const login = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [loading, setLoading] = useState(false);

  const onLogin = async()=>{
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      console.log("LogIn response: ", response.data);
      toast.success("LogIn successful!");
      router.push("/profile");
    } catch (error:any) {
      setLoading(false);
      toast.error("Login failed: " + error.message);
      console.error("Login failed - ERROR:: ", error.message);
    }
  }

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 7) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
       <div>
      <div className='max-w-md mx-auto my-10 p-5 border rounded-lg shadow-lg bg-zinc-900'>
      <h1 className="text-2xl font-bold mb-4">{loading ? "Loading..." : "LogIn"}</h1>
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
        onClick={onLogin}
        disabled={buttonDisabled || loading}
        className={`bg-blue-500 text-white p-2 rounded ${buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? "Logging in..." : "Log In"}
      </button>
        <div className='my-10 p-5 border rounded-lg shadow-lg bg-zinc-900'>
        <p className='text-sm'>Doesn't have an account? <a href="/signup" className='text-blue-500'>Sign Up</a></p>
        </div>
      </div>
 
    </div>
  )
}

export default login