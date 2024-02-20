import React from 'react'

function Contact() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 rounded-lg bg-white outline mb-4">
    <div className="container px-4 md:px-6">
      <div className="flex flex-col items-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold underline tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
            Contact Us
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Have questions or want to get in touch? Reach out to us through the following channels:
          </p>
          <div className="flex flex-col space-y-2 mt-4">
            <div className="flex items-center space-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-blue-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M22 12h-6m-6 0H2"
                ></path>
              </svg>
              <span className="text-gray-500">Email: info@prompterwave.com</span>
  
            </div>
            <div className="flex items-center space-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-green-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
              <span className="text-gray-500">Phone: +1 (123) 456-7890</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}

export default Contact