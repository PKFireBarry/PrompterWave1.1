import React from 'react'

function About() {
  return (
    <section className="m-4 flex justify-center py-12 md:py-24 lg:py-32 rounded-lg bg-white outline mb-4">
    <div className="container px-4 md:px-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold underline tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
            About PrompterWave
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
          The journey of Prompter Wave began with a personal struggle a challenge I faced in achieving good stable diffusion prompts. 
          While I excelled in using the software, I couldn&apos;t create captivating images. I found myself lacking the creative spark to generate interesting subjects that aligned seamlessly with my initial concepts. 
          This gap between imagination and execution led me to envision a solution, and that&apos;s how Prompter Wave came into existence.
          This platform serves as a dedicated space to brainstorm ideas, refine concepts, and ultimately achieve the perfect balance between creativity and promptability in Stable Diffusion models.
          </p>

          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl mt-4 dark:text-gray-400">
          


          </p>
        </div>
      </div>
    </div>
  </section>
  )
}

export default About