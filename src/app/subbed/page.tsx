'use client'

import React, { useState, useEffect } from 'react';
import { auth, db } from '../../../firebase'; 
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

function Page() {
  const [user, loading] = useAuthState(auth); // State to manage user authentication
  const [isLoading, setIsLoading] = useState(false); // State to track loading state

  // Function to add user data to the database
  const addUserToDatabase = async (userData: { name: string; joinedAt: Date; }) => {
    try {
      setIsLoading(true); // Start loading

      // Check if user is authenticated
      if (!user) {
        throw new Error('User is not authenticated');
      }
  
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
    if (user) {
      // Run addUserToDatabase function when user is available
      const userData = {
        name: user.displayName || "Anonymous",
        joinedAt: new Date(),
      };
      addUserToDatabase(userData);

      // 3 second delay before redirecting
      const delay = setTimeout(() => {
        // Redirect to home page
        setIsLoading(false);
        window.location.assign('/');
      }, 3000);

      return () => clearTimeout(delay); // Clear timeout on unmount
    }
  }, [user]); // Run when user changes

  return (
    <div className='h-full w-full flex items-center'>
      <button className='items-center' disabled={isLoading || loading}>
        {isLoading ? 'Adding...' : 'All Set!'}
      </button>
      <p>Just hang tight for a second ok?</p>
    </div>
  );
}

export default Page;
