"use client"

import { useEffect, useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../../firebase'
import { collection, doc, setDoc } from "firebase/firestore";
import Nav from "@/components/Nav";
import { HoverCard, HoverCardContent } from "@/components/ui/hover-card";
import { HoverCardTrigger } from "@radix-ui/react-hover-card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import Login from "@/components/Login";
import Footer from "@/components/Footer";


    
function Dashboard() {

    const [prompt, setPrompt] = useState("");
    const [response, setResponse] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [constants, setConstants] = useState("");
    const [Nconstants, setNconstants] = useState("");
    const [user, loading] = useAuthState(auth); 




      if (user ==  null) {
        console.log('User is not authenticated try login in first');
        return <Login/>
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
                  Use these in the stable diffusion prompt ${constants} exactly as it's written.
                  add more words to the stable duffsion prompt to match well with the ${prompt}
                  Always include the dislikes in the negitive prompt ${Nconstants}.  
                  Generate a high quailty Instagram post from the perspective that correlates to a matching stable diffusion prompt. 
                  Here are some instructions for your ability to accomplish the task. 
                  Using ${prompt}. Make a compelling instagram post that is based on the prompt.

                  Feel free to use emojis and other charaters to feel like something an actual user would post in alignment with the post idea.
                 
                  Next, You will create a corisponding prompt in stable diffusion for the instagram post to generate an image.
                  Use keyword prompt format for the prompt and the negitive prompt.
                  Dont include hashtags in the stable diffusion prompt.
                  
                               

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
        const name = user?.displayName
        const email = user?.email
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
  
    return (
      <div className="h-screen bg-[#090810]">
        <Nav/>
        <div className="justify-center flex items-center mt-20">
          <div className="flex-col md:flex-row flex w-[75%] bg-[#978eda]  gap-4 p-6 rounded-xl py-12 md:py-24 lg:py-32  dark:bg-gray-800 outline">
            <div>

              
            </div>
            <form
              onSubmit={(event) => handleSubmit(event, response)}
              className="w-[45%] p-6 outline bg-gray-300 rounded shadow-lg"
            >
                <div>
                  <HoverCard>
                  <HoverCardTrigger>
                    <h1 className="text-3xl mb-6 flex justify-center text-center underline  font-bold">
                      PrompterWave
                    </h1>
                  </HoverCardTrigger>
                  <HoverCardContent className="outline">
                    Welcome to the Dashboard! Here, you have two options: you can
                    either opt for a random selection without providing a prompt,
                    or if you have a specific idea in mind, use the text box below
                    to guide the AI in generating the desired image. Your
                    creativity is the limit!
                  </HoverCardContent>
                </HoverCard>
                </div>
              <div className="flex flex-col gap-4">

                <div className="flex flex-col gap-2">
                  <Label
                    htmlFor="input-field"
                    className="text-xl  text-black font-bold"
                  >
                    {" "}
                    Prompt Concept{" "}
                  </Label>
  
                  <Input
                    id="input-field"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your prompt idea here"
                    className="bg-white outline"
                  />
  
                  <HoverCard>
                    <HoverCardTrigger>
                      <Label
                        htmlFor="input-field"
                        className="text-lg  text-black font-bold"
                      >
                        {" "}
                        Prompt Constants{" "}
                      </Label>
                    </HoverCardTrigger>
                    <HoverCardContent className="outline">
    Prompts are crucial components in the realm of Stable Diffusion, acting as the foundational blueprint from which AI algorithms create unique pieces of art. Think of prompt constants like things you want to be consistent throughout many different photographs you wish to create. This can be helpful for keeping a subject the same while altering the environment/location around it.
  </HoverCardContent>
  
  
                  </HoverCard>
    {/*defaultValue={like}*/}
                  <Textarea
                    id="input-field-2"
                    
                  
                    onChange={(e) => setConstants(e.target.value)}
                    placeholder="Enter your Constants"
                    className="bg-white outline"
                    rows={7}
                    
                  />
  
                  <HoverCard>
                    <HoverCardTrigger>
                      <Label
                        htmlFor="input-field"
                        className="text-lg  text-black font-bold out"
                      >
                        {" "}
                        Negitive Prompt Constants{" "}
                      </Label>
                    </HoverCardTrigger>
                    <HoverCardContent className="outline">
    Negative prompts are basically text representations of what you do not want to see in the image you&apos;re trying to generate. The negative prompt is an additional way to nudge Stable Diffusion to give you what you want. A negative prompt removes objects or styles in a way that may not be possible by tinkering with a positive prompt alone.
  </HoverCardContent>
  
                  </HoverCard>
  {/*defaultValue={dislikes}*/}
                  <Textarea
        id="input-field-3"
        
        
        onChange={(e) => setNconstants(e.target.value)}
        placeholder="Enter your Negitive Constants"
        className="bg-white outline"
        rows={7}
      />
                </div>
  
                <Button className="" type="submit">
                  {isLoading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
  
            <div className="bg-slate-300 rounded-lg p-2 w-4/6 outline">
              <HoverCard>
                <HoverCardTrigger>
                  <h2 className="text-3xl font-bold pb-2 underline transition">
                    Content Area
                  </h2>
                </HoverCardTrigger>
                <HoverCardContent className="outline">
                  The response content will be showcased here. If you wish to
                  review previous generations, simply navigate to the{" "}
                  <a className="font-bold text-blue-500" href="/archive">
                    archive
                  </a>{" "}
                  page to retrieve them from the database. You can edit and delete
                  old ideas there as well!
                </HoverCardContent>
              </HoverCard>
              <Textarea
                className=" bg-white outline"
                id="textarea"
                value={response}
                rows={30}
                placeholder="Get ready for an awesome and fully developed idea that's about to make an appearance – I swear! (Response content will show up here....)"
              />
            </div>
          </div>
        </div>
      <Footer/>
        
      </div>
    );
  }
  
  export default Dashboard;
  