"use client";

import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../../firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import Nav from "@/components/Nav";
import { HoverCard, HoverCardContent } from "@/components/ui/hover-card";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import { Button } from "@/components/ui/button";
import Login from "@/components/Login";
import Footer from "@/components/Footer";
import Forms from "./components/Forms";
import ContentArea from "./components/ContentArea";


function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [constants, setConstants] = useState("");
  const [Nconstants, setNconstants] = useState("");
  const [user, loading] = useAuthState(auth);
  const Keywords = [
    "Sunny",
    "Happy",
    "Adventure",
    "Dream",
    "Magic",
    "Explore",
    "Serene",
    "Mystical",
    "Urban",
    "Whimsical",
    "Solitude",
    "Vibrant",
    "Tranquil",
    "Enigmatic",
    "Majestic",
    "Surreal",
    "Idyllic",
    "Enchanting",
    "Atmospheric",
    "Ethereal",
    "Captivating",
  ];

  if (user == null) {
    console.log("User is not authenticated try login in first");
    return <Login />;
  }

  //submiting the propmpt to the api
  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    data: any
  ) => {
    event.preventDefault();

    // Make API call to OpenAI ChatGPT-3.5 Turbo
    try {
      setIsLoading(true);
      setResponse("");

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
            // Replace with your actual API key
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: `
                  Forget everything from before this message and only use what is given here.
                  this is very important and should be followed at all times.
                  Use these in the stable diffusion prompt ${constants} exactly as it's written this is very important(if any are given).
                  add more words to the stable duffsion prompt that match well with the ${prompt}, at minimum 3 or 4 should be used.
                  Always include the dislikes in the negitive prompt ${Nconstants}(if any are given).  

                  Generate a high quailty Instagram post with a from the perspective that correlates the matching stable diffusion prompt. 
                  Here are some instructions for your ability to accomplish the task: 
                  Using ${prompt}. Make a compelling instagram post that is based on the prompt.
                  Feel free to use emojis and other charaters to feel like something an actual user would post in alignment with the post idea.
                  `,
              },
            ],
            temperature: 0.5,
            model: "gpt-4-1106-preview",

            max_tokens: 4000,
          }),
        }
      );

      const data = await response.json();
      console.log("API Response:", data);

      console.log(
        "The response from the Api was: ",
        data.choices[0]?.message.content
      );
      const message = data.choices[0]?.message.content;

      setResponse(message);

      addResponseToDatabase(message);

      // send info to database
    } catch (error) {
      console.error("Error making API call:", error);
    } finally {
      console.log(data, constants, Nconstants);
      setIsLoading(false);
      setPrompt("");
    }
  };

  // adding the response to the database
  const addResponseToDatabase = async (message: string) => {
    try {
      // Reference to the Firestore collection
      const collectionRef = collection(db, "db");

      // Explicitly generate a new document ID
      const newDocRef = doc(collectionRef);

      // Get user information using Clerk's useUser hook
      const name = user?.displayName;
      const email = user?.email;
      response.split("");

      // Add a new document to the collection with the response message and user information
      await setDoc(newDocRef, {
        response: message,
        name: name,
        email: email,
        prompt: prompt,
      });

      console.log("Document written with ID:", newDocRef.id);
    } catch (error) {
      console.error("Error adding response to database:", error);
    }
  };

  const isSubscribed = () => {
    // check the database to see if the user is subscribed
    // the location in the database is /subscribers
  }

  const addToPrompt = (value: string) => {
    setPrompt((prevPrompt) => {
      // Check if it's the first button press
      if (prevPrompt === "") {
        return value; // If it's the first button press, return just the value
      } else {
        return prevPrompt + ", " + value; // Concatenate the space and the new value with the existing prompt
      }
    });
  };



  return (
    <div className="h-screen w-full bg-[#090810]">
      <Nav />
      <div className="justify-center flex items-center mt-20">
        <div className="flex-col sm:flex-row flex w-[95%] bg-[#978eda] gap-4 p-8 my-8 rounded-xl dark:bg-gray-800 outline">
          {/* a component that shows a bunch of buttons to quiclky create a propmt for a generation */}
          <div className="md:w-[33.3%] w-full  p-6 outline bg-gray-300 rounded shadow-lg ">

          <HoverCard>
        <HoverCardTrigger>
            <h2 className="text-2xl font-bold mb-4 underline">Add Keywords to Prompt </h2>
        </HoverCardTrigger>
        <HoverCardContent className="outline">
        {`craft your vision by engaging with the buttons and text box to construct a prompt that will steer the AI towards creating your desired image. Unleash your imagination!`}

        </HoverCardContent>
      </HoverCard>


            <p className="text-sm mb-4">
              Click on a keyword to add it to your prompt.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {Keywords.map((keyword, index) => (
                <Button
                  key={index}
                  className="hover:animate-pulse hover:scale-105 hover:bg-[#0501e9] transition-all text-white font-bold py-2 rounded duration-300"
                  onClick={() => addToPrompt(keyword)}
                >
                  {keyword}
                </Button>
              ))}
            </div>
          </div>
          <Forms
            response={response}
            prompt={prompt}
            handleSubmit={handleSubmit}
            setPrompt={setPrompt}
            setConstants={setConstants}
            setNconstants={setNconstants}
            isLoading={isLoading}
            addToPrompt={addToPrompt}
          />
          <ContentArea setResponse={setResponse} response={response as string} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;
