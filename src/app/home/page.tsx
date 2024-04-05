"use client";
import { useEffect, useState } from "react";

import Link from "next/link";

import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { db, auth, initFirebase } from "../../../firebase";

import { motion } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth";
import Nav from "@/components/Nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { CheckCircleIcon, MergeIcon, SparklesIcon } from "lucide-react";

import { WavyBackground } from "@/components/wavybackground";

export default function Home() {
  initFirebase(); // Initialize Firebase (only run once)
  const [history, setHistory] = useState<any[]>([]);
  const [user, loading] = useAuthState(auth);
  const email = user?.email;
  const [scrollY, setScrollY] = useState(0);
  const provider = new GoogleAuthProvider();

  // Signout
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Sign in with a popup window
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider); // You need to define 'provider' based on the authentication method you want to use
      console.log(result); // Once signed in, you can access the user information
    } catch (error) {
      console.error(error);
    }
  };

  async function fetchData() {
    try {
      const querySnapshot = await getDocs(collection(db, "db")); // Replace 'Ideas' with your actual collection name
      const data: any = [];

      querySnapshot.forEach((doc) => {
        const entry = { id: doc.id, response: doc, ...doc.data() };

        // Move the condition inside the loop to filter entries by email
        if (entry) {
          data.push(entry);
        }
      });
      setHistory(data);

      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }

  useEffect(() => {
    // You can update the scrollY state based on your logic
    // For example, scroll down by 125 pixels every second
    const interval = setInterval(() => {
      setScrollY((prevScrollY) => prevScrollY - 50);
    }, 1000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this effect runs once on mount

  useEffect(() => {
    const fetchDataAndDoSomething = async () => {
      try {
        const data = await fetchData();
        setHistory(data);
        // Do something with the fetched data
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Call the fetchDataAndDoSomething function when the component mounts
    fetchDataAndDoSomething();
  }, []);

  return (
    <main className="flex h-screen w-full  min-h-screen overflow-hidden scroll-py-0 flex-col items-center justify-between p-24 bg-[#978eda] dark:bg-gray-800">
      <Nav />
      <WavyBackground />

      <section className="w-full h-screen py-12 md:py-24 lg:py-32 rounded-3xl  z-30">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-6 ">
          <div className="flex flex-col rounded-xl outline bg-[#ececf2] items-center justify-center space-y-4">
            <div className="space-y-2 p-4">
              <motion.h1
                className="text-3xl font-bold  tracking-tighter sm:text-5xl xl:text-6xl/none dark:text-gray-400"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Introducing
              </motion.h1>
              <h1 className="text-6xl font-bold pb-4 my-4 ">
                {Array.from("PrompterWave").map((letter, index) => (
                  <motion.span
                    key={index}
                    style={{ display: "inline-block" }}
                    initial={{ y: 0 }}
                    className=""
                    animate={{
                      y: [0, -10, 0],
                      transition: {
                        duration: 2.5,
                        repeat: Infinity,
                        delay: index * 0.1,
                      },
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </h1>
              <div className="max-w-[600px] p-4 md:text-xl dark:text-gray-400">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="flex items-start mb-8"
                >
                  <MergeIcon className="w-8 h-8 mr-4 mt-1 text-[#251982]" />
                  <span className="text-sm font-semibold text-[#251982] mr-4">
                    Effortless Prompting:
                  </span>
                  <p className="text-sm font-bold">
                    Experience seamless integration and efficient results,
                    allowing you to focus solely on unleashing your creativity.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="flex items-start mb-8"
                >
                  <SparklesIcon className="w-8 h-8 mr-4 mt-1 text-[#251982]" />
                  <span className="text-sm font-semibold text-[#251982] mr-4">
                    Advanced LLM Technology:
                  </span>
                  <p className="text-sm font-bold">
                    Unlock the power of cutting-edge GPT-4 to effortlessly
                    prompt stunning images. Our user-friendly interface ensures
                    ease of use for all skill levels.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  className="flex items-start"
                >
                  <CheckCircleIcon className="w-8 h-8 mr-4 mt-1 text-[#251982]" />
                  <span className="text-sm font-semibold text-[#251982] mr-4">
                    Reliable Results:
                  </span>
                  <p className="text-sm font-bold">
                    Trust in our app&apos;s consistent and reliable performance.
                    Say goodbye to tedious fine-tuning and hello to captivating
                    visuals.
                  </p>
                </motion.div>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="flex flex-col gap-2 min-[400px]:flex-row p-4"
            >
              {user ? (
                <Button
                  className="inline-flex text-lg hover:underline h-10 items-center justify-center rounded-md border border-gray-300 transition-colors hover:animate-pulse hover:bg-blue-700 px-8  font-medium shadow-sm   focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                  onClick={handleSignOut}
                >
                  Logout
                </Button>
              ) : (
                <Button
                  className="inline-flex text-lg hover:underline h-10 items-center justify-center rounded-md border border-gray-300 transition-colors hover:animate-pulse hover:bg-blue-700 px-8  font-medium shadow-sm   focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                  onClick={handleLogin}
                >
                  Login
                </Button>
              )}
              <Link
                className="inline-flex text-lg hover:underline h-10 items-center justify-center rounded-md border border-gray-300 transition-colors hover:animate-pulse hover:bg-blue-700 px-8  font-medium shadow-sm   focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                href="/dashboard"
              >
                Dashboard
              </Link>
              <Link
                className="inline-flex text-lg hover:underline h-10 items-center justify-center rounded-md border border-gray-300 transition-colors hover:animate-pulse hover:bg-blue-700 px-8  font-medium shadow-sm   focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
                href="/plans"
              >
                Pricing
              </Link>
            </motion.div>
          </div>

          <div className="">
            <motion.div
              initial={{ opacity: 0 }}
              transition={{ duration: 3 }} // Adjust duration as needed
              animate={{ opacity: 1 }}
              className="overflow-y-hidden hidden lg:block overflow-x-hidden outline p-12 rounded-xl h-[600px] items-center bg-[#978eda]"
            >
              {" "}
              {history && Array.isArray(history) && history.length > 0 ? (
                history.map((entry: any) => (
                  <motion.div
                    key={entry.id}
                    data-extension-installed={true}
                    transition={{ duration: 3 }} // Adjust duration as needed
                    initial={{ y: 0, opacity: 1 }}
                    animate={{ y: scrollY, opacity: 1 }}
                    drag
                  >
                    <Card
                      key={entry.id}
                      className="relative my-8 outline hover:scale-105 transition overflow-hidden  h-[500px]"
                    >
                      <CardContent className="grid gap-4 text-sm p-6">
                        <div className="flex items-center">
                          <p className="font-semibold text-xl flex min-h-full justify-center items-center">
                            Prompt: {entry.prompt}
                          </p>
                        </div>
                        <div className="flex items-center overflow-y-auto">
                          <textarea
                            rows={15}
                            defaultValue={entry.response}
                            className="w-full h-full text-base flex-grow overflow-y-hidden flex justify-center items-center"
                          ></textarea>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-start overflow-y-hidden"></div>
              )}
            </motion.div>
          </div>
        </div>
      </section>
      <div className="hidden lg:block">
        <Footer />
      </div>
    </main>
  );
}
