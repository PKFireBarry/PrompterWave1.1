import React from 'react'
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarShortcut,
    MenubarTrigger,
  } from "@/components/ui/menubar"

  import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuIndicator,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
  } from "@/components/ui/navigation-menu"
  
  import { Separator } from "@/components/ui/separator"

  
function Footer() {
  return (
    <>

    <div className='hidden md:flex sticky h-[1px]  items-center justify-center  mb-4 w-full '>

    <div className='bg-gray-200 outline rounded-xl p-4'>
      <div className="">
        <h4 className="text-sm font-medium leading-none">PrompterWave</h4>
        <p className="text-sm text-muted-foreground">
          Made with <a href=''>Next.js</a>, <a href=''>shadcn/ui</a>, and <a href=''>OpenAI</a>.
        </p>
      </div>
      <Separator className="my-2" />
      <div className="flex justify-evenly items-center space-x-4 text-sm">
        <a href='https://github.com/PKFireBarry'>Github</a>
        <Separator orientation="vertical" />
        <a href='https://www.linkedin.com/in/darion-george/'> My Linkedin</a>
        <Separator orientation="vertical" />
        <a href='https://huggingface.co/docs/diffusers/v0.14.0/en/stable_diffusion'>Stable Diffusion</a>
        <Separator orientation="vertical" />
        <a href='/plans'>About</a>
      </div>
    </div>

    <div/>
  </div>
  </>
  )
}

export default Footer