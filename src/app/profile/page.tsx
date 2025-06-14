'use client';
import axios from 'axios'
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react'

interface UserData {
  username: string;
}

export default function ProfilePage() {
  //display the details of the user
  //fetch the user details from the server using the token
  //use the token to get the user details from the server
  const router = useRouter();
  const [data, setData] = useState<UserData>();
  const fetchUserDetails = async () => {
    try {
      const response = await axios.post('/api/users/aboutme');
      console.log("User details: ", response.data);
      setData(response.data.data);
    } catch (error) {
      console.error("Error fetching user details: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get('/api/users/logout');
      // Optionally, redirect to login page or show a message
      router.push('/login');
    } catch (error) {
      console.error("Error during logout: ", error);
    }
  };

  useEffect(() => {
    // Automatically fetch user details when the component mounts
    fetchUserDetails();
  }, []);

  return (
    <div>
      <div className="max-w-md mx-auto my-10 p-5 border rounded-lg shadow-lg bg-zinc-900">
        <h1 className="text-4xl">Profile Page</h1>
        <p className="mt-4">Welcome to your profile!</p>
        {
          data && (
            <div className='flex items-center justify-between mt-4'>
              <div className='flex items-center'>
              <div className='w-14 h-14 mr-2 rounded-full bg-purple-800 flex items-center justify-center'>
                <span className='text-2xl font-bold'>{data.username.charAt(0).toUpperCase()}</span>
              </div>
              <h2>{data.username}</h2>
              </div>

              <button
                className='ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                onClick={() => {
                  // Handle logout logic here
                  console.log("Logout clicked");
                  handleLogout()
                }}
              >
                Logout
              </button>
            </div>
          )
        }
      </div>
    </div>
  )
}