'use client'

import React, { useState, useEffect } from 'react';
import { auth, db, initFirebase } from '../../../firebase'; 
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import Link from 'next/link';
import { DatabaseIcon } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';


function Page() {
  initFirebase() // Initialize Firebase (only run once)
  const [user, loading] = useAuthState(auth); // State to manage user authentication
  const [isLoading, setIsLoading] = useState(false); // State to track loading state

  // Function to add user data to the database



  const addUserToDatabase = async (userData: { name: string; joinedAt: Date; }) => {
    try {
      setIsLoading(true); // Start loading

      // Check if user is authenticated
      if (!user?.email) throw new Error('Not Authenticated');
      const userDocRef = doc(db, `subscribers/${user.email}`);
      const userDocSnapshot = await getDoc(userDocRef);

      // Check if user already exists in the database
      if (userDocSnapshot.exists()) {
        console.log(user?.email," is already exists subscribed");
        throw new Error('User is already subscribed');
      }
  
      // Add user data to the database
      await setDoc(userDocRef, userData);
      console.log('User data added successfully');
    } catch (error) {
      console.error('Error adding user data: ', (error as Error).message);
    } 
  };

  useEffect(() => {
    if (!user) {
      // User is not logged in, redirect to home page
      window.location.assign('/');
      return; // Stop further execution of the useEffect hook
    }
  
    const userData = {
      name: user.displayName || "Anonymous",
      joinedAt: new Date(),
    };
  
    addUserToDatabase(userData);
  
    const delay = setTimeout(() => {
      setIsLoading(false);
      window.location.assign('/');
    }, 3000);
  
    return () => clearTimeout(delay);
  }, [user, addUserToDatabase]); 
  
  

  return (
    <>
      <Nav/>    
    <div className='h-full w-full flex justify-center items-center'>

      <div className="flex flex-col min-h-[100dvh]">
      <div className="flex flex-col min-h-[100dvh]">
        <div className="flex items-center justify-center min-h-[100vh] px-4 text-center md:px-6">
          <div className="space-y-4">
            <div className="flex w-full justify-center items-center space-x-2">
              <DatabaseIcon className="h-6 w-6" />
              <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl">PrompterWave</h1>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl">Welcome to Pro!</h1>
              <div className="max-w-[600px] mx-auto text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Your data is secure with us. Click continue to access the platform.
                <br/>  
                  <div className='font-bold'>
                  {isLoading ? 'Adding a new user...' : 'OK! youre all set welcome to Pro Mode!'}
                  </div>      
              </div>
      <button className='items-center' disabled={isLoading || loading}>

      </button>               
            </div>
            <Link
              className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
              href="/dashboard"
            >

              Continue to Dashboard
            </Link>
            
          </div>
          
        </div>
        
      </div>
    </div>
    
    </div>
        <Footer/>
    </>

  );
}

export default Page;
