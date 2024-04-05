"use client";

import Nav from "@/components/Nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import About from "./components/About";
import { motion } from "framer-motion";
import { WavyBackground } from "@/components/wavybackground";
import { getAuth } from "firebase/auth";
import { FirebaseApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import { initFirebase } from "../../../firebase";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function Page() {
  const app = initFirebase();
  const [user, loading] = useAuthState(auth);
  const email = user?.email;
  const [isSubscribed, setIsSubscribed] = useState(false); // State to track subscription status

  // Function to fetch subscription status
  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const status = await subscriptionStatus(app);
        setIsSubscribed(status);
      } catch (error) {
        console.error(error);
      }
    };

    if (user && email) {
      fetchSubscriptionStatus();
    }
  }, [app, user, email]);

  //Logic for adding a new subscriber
  const handleSubscribe = async (url: string) => {
    try {
      const collectionRef = collection(
        db,
        `customers/${user?.uid}/checkout_sessions`
      );
      const docRef = await addDoc(collectionRef, {
        price: "price_1Ok1duLKGV5ROCJ9QmQ0utKU",
        success_url: "https://prompter-wave.vercel.app//subbed",
        cancel_url: "https://prompter-wave.vercel.app//home",
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
          console.log("Document does not exist");
        }
      });

      // Don't forget to unsubscribe when you no longer need the listener to prevent a memory leak
      return unsubscribe;
    } catch (error) {
      console.error(error, "An error occurred while subscribing.");
    }
  };

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

              console.log(
                "Active or trialing subscription found for the current user"
              );
              resolve(true);
            } else {

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

    // Render the unsubscribe button conditionally based on subscription status
    const renderUnsubscribeButton = () => {
      if (user && isSubscribed) {
        return (
            <div className="bg-primary text-primary-foreground hover:bg-primary/90 flex justify-center text-center items-center p-2 rounded-md">
            <AlertDialog>
              <AlertDialogTrigger>Unsubscribe</AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Are you absolutely sure you want to unsubscribe?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will remove your Pro status from our Database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>
                    {" "}
                    <Link
                      className="button-style bg-gray-900 text-gray-50 hover:bg-gray-800"
                      href={"/unsub"}
                    >
                      Unsubscribe
                    </Link>{" "}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            </div>

        );
      } else {
        return null; // If not subscribed or user is not logged in, don't render anything
      }
    };

  return (
    <div className="flex h-screen w-full  min-h-screen overflow-hidden scroll-py-0 flex-col items-center justify-between  bg-[#978eda] dark:bg-gray-800">
      <WavyBackground />
      <Nav />

      <div className="flex h-screen flex-col justify-center items-center z-30 w-screen">
        <header className="px-4 lg:px-6 h-14 flex items-center">
          <Link className="flex items-center justify-center" href="#">
            <span className="sr-only">Prompter Wave</span>
          </Link>
        </header>
        <main className="flex-1 w-full ">
          <About />
          <div className="grid gap-6 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-2 xl:grid-cols-2xl">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid m-4 outline rounded-xl">
                <Card>
                  <CardHeader className="pb-6">
                    <CardTitle>Free</CardTitle>
                    <div>Always free</div>
                    <CardDescription>
                      Good for getting started with Stable Diffusion Prompting
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <ul className="grid gap-2">
                      <li>
                        <CheckIcon className="w-4 h-4 mr-2 inline-block text-green-500" />
                        20 Prompt Generations Per month
                      </li>
                      <li>
                        <CheckIcon className="w-4 h-4 mr-2 inline-block text-green-500" />
                        GPT-4 based LLM
                      </li>
                      <li>
                        <CheckIcon className="w-4 h-4 mr-2 inline-block text-green-500" />
                        Archive access
                      </li>
                    </ul>
                    <div>
                      <Button
                        className="button-style bg-gray-900 text-gray-50 hover:bg-gray-800"
                        disabled={loading}
                      >
                        <a href="/">Sign up for free</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="grid m-4 outline rounded-xl">
                <Card>
                  <CardHeader className="pb-6">
                    <CardTitle>Pro</CardTitle>
                    <div>$1/month</div>
                    <CardDescription>
                      For professional developers and teams
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <ul className="grid gap-2">
                      <li>
                        <CheckIcon className="w-4 h-4 mr-2 inline-block text-green-500" />
                        Unlimited Prompt Generations
                      </li>
                      <li>
                        <CheckIcon className="w-4 h-4 mr-2 inline-block text-green-500" />
                        Set custom Constants or Embeddings
                      </li>
                      <li>
                        <CheckIcon className="w-4 h-4 mr-2 inline-block text-green-500" />
                        Archive access with Editing
                      </li>
                    </ul>
                    <div className="gap-2 flex">
                      {user ? ( // Check if user is logged in
                        <Button
                          onClick={handleSubscribe as any}
                          className="button-style bg-gray-900 text-gray-50 hover:bg-gray-800"
                        >
                          Signup for just $1
                        </Button>
                      ) : (
                        <Button
                          className="button-style bg-gray-900 text-gray-50 cursor-not-allowed"
                          disabled={true}
                        >
                          Please log in to subscribe
                        </Button>
                      )}
                      {renderUnsubscribeButton()} {/* Render the unsubscribe button */}

                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Page;
