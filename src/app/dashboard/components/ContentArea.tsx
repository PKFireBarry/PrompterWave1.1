import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'

function ContentArea({response}:{
  response: string | undefined;
}) {
  return (
    <div className="bg-slate-300 rounded-lg p-2 md:w-[33.3%] w-full outline">
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
      defaultValue={response as string}
      onChange={(e) => response}
      rows={30}
      placeholder="Get ready for an awesome and fully developed idea that's about to make an appearance – I swear! (Response content will show up here....)"
    />
  </div>
  )
}

export default ContentArea