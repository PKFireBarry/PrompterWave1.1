import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../../../firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Meteors } from "@/components/meteors";
import { BackgroundGradient } from "@/components/background-gradient";

function Forms({
  response,
  handleSubmit,
  setPrompt,
  setConstants,
  setNconstants,
  isLoading,
  prompt,
  addToPrompt,
}: {
  response: string;
  handleSubmit: Function; // Adjust the type accordingly
  setPrompt: Function; // Adjust the type accordingly
  setConstants: Function; // Adjust the type accordingly
  setNconstants: Function; // Adjust the type accordingly
  isLoading: boolean;
  prompt: string;
  addToPrompt: Function; // Adjust the type accordingly
  
}) {
  const [user, loading] = useAuthState(auth);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const logSubscribersData = async () => {
    // Create a reference to the subscribers collection
    const subscribersRef = collection(db, "subscribers");
    try {
      // Get all documents within the subscribers collection
      const querySnapshot = await getDocs(subscribersRef);
      // Loop through each document
      for (const doc of querySnapshot.docs) {
        // Check if the document's ID matches the user's email
        if (doc.id === user?.email) {
          // User is in the subscribers list
          console.log("User is logged as a subscriber");
          setIsSubscribed(true);
          return true; // Break out of the loop
        } else {
          console.log("This User Isnt A Pro Sub");
        }
      }
    } catch (error) {
      console.error("Error getting subscribers data: ", error);
    }
    // If the loop finishes without finding a match, set isSubscribed to false
    setIsSubscribed(false);
    return false;
  };

  // Call the function to log subscribers data
  logSubscribersData();

  return (
    <form
      onSubmit={(event) => handleSubmit(event, response)}
      className="md:w-[33.3%] w-full p-6 outline bg-gray-300 rounded shadow-lg"
    >
      <div>
        <HoverCard>
          <HoverCardTrigger>
            <h1 className="text-5xl mb-6 hover:text-[#0501e9]  hover:animate-pulse transition-colors flex justify-center text-center underline  font-bold">
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
          </HoverCardTrigger>
          <HoverCardContent className="outline">
            Welcome to the Dashboard! Here, you have two options: you can either
            opt for a random selection without providing a prompt, or if you
            have a specific idea in mind, use the text box below to guide the AI
            in generating the desired image. Your creativity is the limit!
          </HoverCardContent>
        </HoverCard>
      </div>
      <div className="flex flex-col gap-4">
        {/* a component that shows a bunch of buttons to quiclky create a propmt for a generation */}

        <div className="flex flex-col gap-2">
          <label
            htmlFor="input-field"
            className="text-lg font-semibold text-gray-800"
          >
            Prompt Concept
          </label>
          <input
            id="input-field"
            value={prompt as string} // this should be fixed by TS
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt idea"
            className="p-3 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {isSubscribed ? (
          <div>
            <div className="flex w-full justify-center items-center flex-col gap-2">
              <Collapsible>
                <CollapsibleTrigger>
                  {" "}
                  <label
                    htmlFor="input-field-2"
                    className="hover:underline text-lg font-semibold text-gray-800"
                  >
                    Variables or Embeddings?
                  </label>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <textarea
                    id="input-field-2"
                    onChange={(e) => setConstants(e.target.value)}
                    placeholder="Enter your Constants"
                    className="p-3 bg-white w-full border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={7}
                  />
                </CollapsibleContent>
              </Collapsible>
            </div>

            <div className="flex justify-center items-center  flex-col gap-2">
              <Collapsible>
                <CollapsibleTrigger className="">
                  <label
                    htmlFor="input-field-3"
                    className="hover:underline text-lg font-semibold text-gray-800"
                  >
                    Negative Prompt?
                  </label>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <textarea
                    id="input-field-3"
                    onChange={(e) => setNconstants(e.target.value)}
                    placeholder="Enter your Negative Constants"
                    className="p-3 bg-white border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={7}
                  />
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center ">
            <BackgroundGradient className="rounded-[22px] max-w-sm p-4 sm:p-10 bg-white dark:bg-zinc-900">
              <h2 className="text-xl font-semibold">Upgrade to Pro</h2>
              <p className="text-gray-600 mb-6">
                Unlock premium features by upgrading to Pro mode.
              </p>
              <a
                className="bg-zinc-900 text-white px-4 py-2 rounded-xl hover:bg-zinc-950"
                href="https://prompter-wave.vercel.app/plans"
              >
                Plans
              </a>
            </BackgroundGradient>
          </div>
        )}

        <div className="flex w-full h-full pt-4 mt-4 justify-center items-center">
          <Button
            className="px-4 py-2 w-full rounded-xl text-lg font-semibold text-white shadow-md hover:bg-[#0501e9] focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="submit"
            disabled={isLoading}
          >
            {!isLoading ? "Generate" : "Please Wait"}
          </Button>
        </div>
      </div>
    </form>
  );
}

export default Forms;
