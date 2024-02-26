import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { motion } from 'framer-motion'
import React from 'react'
import { auth, db } from "../../../../firebase";
import { collection, doc, setDoc } from "firebase/firestore";




function Forms({ response, handleSubmit, setPrompt, setConstants, setNconstants, isLoading, prompt, addToPrompt, user }: { 
  response: string, 
  handleSubmit: Function, // Adjust the type accordingly
  setPrompt: Function, // Adjust the type accordingly
  setConstants: Function, // Adjust the type accordingly
  setNconstants: Function, // Adjust the type accordingly
  isLoading: boolean, 
  prompt: string, 
  addToPrompt: Function, // Adjust the type accordingly
  user: any
}) {


  const isSubscribed = () => {
    // check the database to see if the user that is logged in is subscribed
    // the location in the database is /subscribers
    
    return (<>
    
    </>)
  }

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
                                    style={{ display: 'inline-block' }}
                                    initial={{ y: 0 }}
                                    className=''
                                    animate={{ y: [0, -10, 0], transition: { duration: 2.5, repeat: Infinity, delay: index * 0.1 } }}
                                >
                                    {letter}
                                </motion.span>
                            ))}
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

{/* a component that shows a bunch of buttons to quiclky create a propmt for a generation */}



<div className="flex flex-col gap-2">
<label htmlFor="input-field" className="text-lg font-semibold text-gray-800">
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


<div className="flex w-full justify-center items-center flex-col gap-2">
<Collapsible>
<CollapsibleTrigger>      <label htmlFor="input-field-2" className="hover:underline text-lg font-semibold text-gray-800">
Variables or Embeddings?
</label></CollapsibleTrigger>
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
<CollapsibleTrigger className=""><label htmlFor="input-field-3" className="hover:underline text-lg font-semibold text-gray-800">
Negative Prompt?
</label></CollapsibleTrigger>
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
<div className="flex w-full h-full pt-4 mt-4 justify-center items-center">
<Button
className="px-4 py-2 w-full rounded-xl text-lg font-semibold text-white shadow-md hover:bg-[#0501e9] focus:outline-none focus:ring-2 focus:ring-blue-500"
type="submit"
disabled={isLoading}
>
{!isLoading ? 'Generate' : 'Please Wait'}

</Button>

</div>

</div>



  </form>
  )
}

export default Forms