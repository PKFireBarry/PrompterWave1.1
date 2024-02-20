"use client";

import Nav from "@/components/Nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import React from "react";
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
import Contact from "./components/Contact";
import TimeLine from "./components/TimeLine";
import Team from "./components/Team";
import About from "./components/About";
import Footer from "@/components/Footer";
import { motion } from 'framer-motion';

function Page() {
  const [user, loading] = useAuthState(auth);
  const email = user?.email;

  //Logic for adding a new subscriber
  const handleSubscribe = async (url: string) => {
    try {
      const collectionRef = collection(
        db,
        `customers/${user?.uid}/checkout_sessions`
      );
      const docRef = await addDoc(collectionRef, {
        price: "price_1Ok1duLKGV5ROCJ9QmQ0utKU",
        success_url: "http://localhost:3000/subbed",
        cancel_url: "http://localhost:3000/home",
      });

      // Set up a listener for changes to the document
      const unsubscribe = onSnapshot(
        docRef,
        (doc) => {
          if (doc.exists()) {
            const data = doc.data();
            if (data && data.url) {
              // We have a Stripe Checkout URL, let's redirect.
              window.location.assign(data.url);
            }
          } else {
            console.log("Document does not exist");
          }
        }
      );

      // Don't forget to unsubscribe when you no longer need the listener to prevent a memory leak
      return unsubscribe;
    } catch (error) {
      console.error(error);
      setError("An error occurred while subscribing.");
    }
  };

  return (
    <div className="">
      <Nav />
      <div className="flex h-screen flex-col justify-center items-center bg-[#978eda]">
        <header className="px-4 lg:px-6 h-14 flex items-center">
          <Link className="flex items-center justify-center" href="#">
            <span className="sr-only">Prompter Wave</span>
          </Link>
        </header>
        <main className="flex-1 w-full ">
          <About />
          <div className="grid gap-6 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-2 xl:grid-cols-2xl">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
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
                        <CheckIcon className="w-4 h-4 mr-2 inline-block" />
                        20 Prompt Generations Per month
                      </li>
                      <li>
                        <CheckIcon className="w-4 h-4 mr-2 inline-block" />
                        Set custom prompt constants
                      </li>
                      <li>
                        <CheckIcon className="w-4 h-4 mr-2 inline-block" />
                        Archive access with editing
                      </li>
                    </ul>
                    <div >
                      <Button
                        onClick={handleSubscribe as any}
                        className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                      >
                        Sign up for free
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <div className="grid m-4 outline rounded-xl">
                <Card>
                  <CardHeader className="pb-6">
                    <CardTitle>Pro</CardTitle>
                    <div>$3/month</div>
                    <CardDescription>
                      For professional developers and teams
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <ul className="grid gap-2">
                      <li>
                        <CheckIcon className="w-4 h-4 mr-2 inline-block" />
                        Unlimited Prompt Generations
                      </li>
                      <li>
                        <CheckIcon className="w-4 h-4 mr-2 inline-block" />
                        Set custom prompt constants
                      </li>
                      <li>
                        <CheckIcon className="w-4 h-4 mr-2 inline-block" />
                        Archive access with editing
                      </li>
                    </ul>
                    <div >
                      <Button
                        onClick={handleSubscribe as any}
                        className="inline-flex h-9 items-center justify-center rounded-md bg-gray-900 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
                      >
                        Signup for just $3
                      </Button>
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

function setError(arg0: string) {
  throw new Error("Function not implemented.");
}
