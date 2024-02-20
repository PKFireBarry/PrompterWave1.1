import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import React from 'react'

function Team() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800 rounded-lg outline mb-4">
    <div className="container px-4 md:px-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl underline">The Team</h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Meet the dedicated team behind PrompterWave.
          </p>
        </div>
      </div>
      <div className=" justify-center flex grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 py-12">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage alt="John Doe" src="/placeholder-avatar.jpg" />
            <AvatarFallback className='bg-blue-200'>DG</AvatarFallback>
          </Avatar>
          <h3 className="text-xl font-bold">Darion George</h3>
          <p className="text-gray-500">Dev</p>
        </div>

      </div>
    </div>
  </section>
  )
}

export default Team