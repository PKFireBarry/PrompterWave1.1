'use client'

import {getAuth, GoogleAuthProvider, signInWithPopup, signOut} from 'firebase/auth';
import { db, initFirebase } from "../../firebase";
import {useAuthState} from  "react-firebase-hooks/auth";
import { addDoc, collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import Nav from '@/components/Nav';
import Login from '@/components/Login';


initFirebase();
const provider = new GoogleAuthProvider();
const auth = getAuth();

export default function Home() {

const [user, loading] = useAuthState(auth);


  // Sign in with a popup window
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider); // You need to define 'provider' based on the authentication method you want to use
      console.log(result) // Once signed in, you can access the user information
    } catch (error) {
      console.error(error);
    }
  };

  //Logic for adding a new subscriber
    const handleSubscribe = async (url: string) => {
        try {
          const collectionRef = collection(db, `customers/${user?.uid}/checkout_sessions`);
          const docRef = await addDoc(collectionRef, {
            price: 'price_1Ok1duLKGV5ROCJ9QmQ0utKU',
            success_url: 'http://localhost:3000/subbed',
            cancel_url: 'http://localhost:3000',
          });
      
          // Set up a listener for changes to the document
          const unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
              const data = doc.data();
              if (data && data.url) {
                // We have a Stripe Checkout URL, let's redirect.
                window.location.assign(data.url);
              }
            } else {
              console.log('Document does not exist');
            }
          });
          
          // Don't forget to unsubscribe when you no longer need the listener prevents a memory leak
          return unsubscribe;
          
        } catch (error) {
          console.error(error);
          setError('An error occurred while subscribing.');
        }
      };
    

    
  

// loading?
  if  (loading) {
    return <div className="flex w-screen h-screen flex-col items-center justify-center">
    <div className="flex items-center space-x-2">
      <div className="animate-spin h-5 w-5 border-t-2 rounded-full border-b-2 border-black" >
        <div className=" h-4 w-full rounded-full bg-gray-200 dark:bg-gray-50 animate-spin" />
        
      </div>
      
    </div>
    <p className="mt-4 text-black text-lg">
    Please wait...
    </p>
  </div>;
  }
  

  //if thehre is a user display this
  if  (user) {
    window.location.assign('/home')
    
    } 
  


  
// UI if the use is not logged in
  return (
    <Login/>
  );
}
function setError(arg0: string) {
  throw new Error('Function not implemented.');
}

