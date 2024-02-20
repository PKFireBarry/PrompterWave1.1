import React from 'react'

function TimeLine() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 rounded-xl bg-white dark:bg-gray-800 outline mb-4">
    <div className="container px-4 md:px-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl underline">Timeline</h2>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            A timeline of major milestones and achievements.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 py-12">
        <div className="flex flex-col items-start space-y-4">
          <div className="text-lg font-bold">2024</div>
          <p className="text-gray-500">We launched LFG.</p>
        </div>
      </div>
    </div>
  </section>
  )
}

export default TimeLine