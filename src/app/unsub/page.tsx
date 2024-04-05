"use client";
import React, { useEffect, useState } from "react";
import { auth, db, initFirebase } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { FirebaseApp } from "firebase/app";
import Link from "next/link";
import { DatabaseIcon } from "lucide-react";

function Page() {
  const app = initFirebase();
  const [user, loading] = useAuthState(auth); // State to manage user authentication
  const [isLoading, setIsLoading] = useState(false); // State to track loading state
  const email = user?.email;

  const unsubscribeUser = async () => {
    setIsLoading(true); // Start loading
    try {
      // Check if user is authenticated
      if (!user?.email) throw new Error("Not Authenticated");
      const userDocRef = doc(db, `subscribers/${user.email}`);
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        if (userData.status === "active") {
          // User is currently subscribed, update the status to 'false'
          await updateDoc(userDocRef, { status: "false" });
          console.log(user?.email, " user is now unsubscribed");
          // Redirect to the getPortalURL response URL
          const portalUrl = await getPortalUrl(app);
          window.location.assign(portalUrl);
        } else {
          console.log(user?.email, " user is already unsubscribed");
        }
      } else {
        console.log(user?.email, " user document does not exist");
      }
    } catch (error) {
      console.error("Error changing user data: ", (error as Error).message);
    }
    setIsLoading(false);
  };

  //Logic to check the user's subcription status
  const subscriptionStatus = async (app: FirebaseApp) => {
    // Make sure app is defined
    const user = auth.currentUser;
    const db = getFirestore(app);

    if (!app) throw new Error("Firebase app is not defined");
    if (!user) throw new Error("User not logged in");
    if (!email) throw new Error("User email not found");

    const subscriptionRef = doc(db, "subscribers", email);
    return new Promise<boolean>((resolve, reject) => {
      const unsubscribe = onSnapshot(
        subscriptionRef,
        (doc) => {
          if (doc.exists()) {
            const subscriptionData = doc.data();
            if (subscriptionData && subscriptionData.status === "active") {
              alert("Your Subbed Up!!");
              console.log(
                "Active or trialing subscription found for the current user"
              );
              resolve(true);
            } else {
              alert("Not subbed huh?");
              console.log(
                "No active or trialing subscription found for the current user"
              );
              resolve(false);
            }
          } else {
            alert("Email not found");
            console.log("No subscription found for the current user");
            resolve(false);
          }
          unsubscribe();
        },
        reject
      );
    });
  };

  const getPortalUrl = async (app: FirebaseApp): Promise<string> => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");
    if (!email) throw new Error("User email not found");
    let dataWithUrl: any;
    try {
      const functions = getFunctions(app, "us-central1");
      const functionRef = httpsCallable(
        functions,
        "ext-firestore-stripe-payments-createPortalLink"
      );
      const { data } = await functionRef({
        customerId: user?.uid,
        returnUrl: window.location.origin,
      });
      // Add a type to the data
      dataWithUrl = data as { url: string };
      console.log("Reroute to Stripe portal: ", dataWithUrl.url);
    } catch (error) {
      console.error(error);
    }
    return new Promise<string>((resolve, reject) => {
      if (dataWithUrl.url) {
        resolve(dataWithUrl.url);
      } else {
        reject(new Error("No url returned"));
      }
    });
  };

  useEffect(() => {
    if (!user) {
      // User is not logged in, redirect to home page
      return; // Stop further execution of the useEffect hook
    }
    unsubscribeUser();
  }, [user]);

  return (
    <div className="max-w-[600px] mx-auto text-black md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
      <div className='h-full w-full flex justify-center items-center'>
        <div className="flex flex-col min-h-[100dvh]">
          <div className="flex items-center justify-center min-h-[100vh] px-4 text-center md:px-6">
            <div className="space-y-4">
              <div className="flex w-full justify-center items-center space-x-2">
                <DatabaseIcon className="h-6 w-6" />
                <h1 className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl">Unsubscribing From PrompterWave</h1>
              </div>
              <div className="space-y-2">
                <div className="max-w-[600px] mx-auto  md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed \">

                  <div className='font-semibold my-8'>
                    {isLoading ? 'Unsubscribing...' : 'OK! Redirecting To Remove Your Payment On File!'}
                  </div>
                  <div className="bg-gray-300 rounded-md font-light p-4 mb-8">
                  <p>
                    Click the payments button to be taken to the payment management portal to unlink your payment method if the page doesn&apos;t reload automatically. If unsure about if the process to unsubscribe was successful, click the status button to confirm.
                  </p>
                  
                  </div>

                </div>
                <button
                  className="px-4 py-2 mx-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                  onClick={unsubscribeUser}
                  disabled={isLoading}
                >
                  {isLoading ? 'Unsubscribing...' : 'Manage Payments'}
                </button>
                <button
                  className="px-4 py-2 mx-2  bg-gray-500 text-white rounded hover:bg-gray-600"
                  onClick={() => subscriptionStatus(app)}
                >
                  Status
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Page;
