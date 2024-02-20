import React from "react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { signInWithPopup, signOut, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";
import { useAuthState } from 'react-firebase-hooks/auth'; // Import useAuthState hook
import { ModeToggle } from "./ModeToggle";

function Nav() {
  // Array containing route information
  const routes = [
    { label: "Home", path: "/home" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Archive", path: "/archive" },    
    { label: "Upgrade", path: "/plans" },   
  ];

  const provider = new GoogleAuthProvider();

  const [user] = useAuthState(auth); // Get the user's authentication state

  // Signout 
  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Sign in with a popup window
   const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider); // You need to define 'provider' based on the authentication method you want to use
      console.log(result) // Once signed in, you can access the user information
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="sticky h-[1px] ml-4 w-full top-4 right-10 flex items-start ">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Menu</Button>
        </SheetTrigger>
        <SheetContent className="bg-[#978eda]">
          <SheetHeader>
            <SheetTitle >
              <HoverCard>
                <HoverCardTrigger>
                  <div className="flex justify-evenly">
                  <p className="text-3xl underline">Menu</p>
                                     
                  </div>

                </HoverCardTrigger>
                <HoverCardContent className="outline text-sm">
                To navigate the website efficiently, utilize the navigation menu by clicking on its options located below
                </HoverCardContent>
              </HoverCard>
              <ModeToggle/> 
            </SheetTitle>
          </SheetHeader>
          <div className="grid gap-4 py-8">
            {routes.map((route, index) => (
              <div className="grid grid-cols-4 items-center gap-4" key={index}>
                <Label htmlFor={`route-${index}`} className="text-left">
                  <a href={route.path}>{route.label}</a>
                </Label>
              </div>
            ))}
          </div>
          {/* Conditionally render login/logout buttons */}
          {user ? (
            <Button onClick={handleSignOut}>Logout</Button>
          ) : (
            <Button onClick={handleLogin}>Login</Button>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Nav;

