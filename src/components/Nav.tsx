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
import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  getAuth,
} from "firebase/auth";
import { auth, initFirebase } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth"; // Import useAuthState hook
import { ModeToggle } from "./ModeToggle";
import { getFunctions, httpsCallable } from "firebase/functions";
import { FirebaseApp } from "firebase/app";
import Link from "next/link";

function Nav() {
  // Array containing route information
  const routes = [
    { label: "Home", path: "/home" },
    { label: "Dashboard", path: "/dashboard" },
    { label: "Archive", path: "/archive" },
    { label: "Plans", path: "/plans" },
  ];

  const provider = new GoogleAuthProvider();
  const app = initFirebase();
  const [user] = useAuthState(auth); // Get the user's authentication state
  const email = user?.email;

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
      console.log(result); // Once signed in, you can access the user information
    } catch (error) {
      console.error(error);
    }
  };

  //stripe customer portal redirect
  const getStripePortalUrl = async (app: FirebaseApp): Promise<string> => {
    const auth = getAuth(app);
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");
    if (!email) throw new Error("User email not found");
    let dataWithUrl: any;
    try {
      const functions = getFunctions(app, "us-central1");
      const functionRef = httpsCallable(
        functions,
        "ext-firestore-stripe-payments-createPortalLink"
      );
      const { data } = await functionRef({
        customerId: user?.uid,
        returnUrl: window.location.origin,
      });
      // Add a type to the data
      dataWithUrl = data as { url: string };
      console.log("Reroute to Stripe portal: ", dataWithUrl.url);
      window.location.assign(dataWithUrl.url);
    } catch (error) {
      console.error(error);
    }
    return new Promise<string>((resolve, reject) => {
      if (dataWithUrl.url) {
        resolve(dataWithUrl.url);
      } else {
        reject(new Error("No url returned"));
      }
    });
  };

  return (
    <div className="sticky h-[1px] z-40 ml-4 w-full top-4 right-10 flex items-start ">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Menu</Button>
        </SheetTrigger>
        <SheetContent className="bg-[#978eda]">
          <SheetHeader>
            <SheetTitle>
              <HoverCard>
                <HoverCardTrigger>
                  <div className="flex justify-evenly">
                    <p className="text-3xl underline">Menu</p>
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="outline text-sm">
                  To navigate the website efficiently, utilize the navigation
                  menu by clicking on its options located below
                </HoverCardContent>
              </HoverCard>
              {/*<ModeToggle/>*/}
            </SheetTitle>
          </SheetHeader>
          <div className="grid gap-4 py-8">
            {routes.map((route, index) => (
              <div
                className="nav-item grid grid-cols-4 items-center gap-4 transition duration-300 ease-in-out transform hover:scale-105"
                key={index}
              >
                <Label htmlFor={`route-${index}`} className="text-left">
                  <a
                    href={route.path}
                    className="text-black text-xl hover:text-blue-700"
                  >
                    {route.label}
                  </a>
                </Label>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4">
            {user ? ( // if user is logged in show this
              <Button
                className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                onClick={() => getStripePortalUrl(app)}
              >
                Manage Payments
              </Button>
            ) : (
              <Button
                className="button-style hidden mx-2 bg-gray-900 text-gray-50 cursor-not-allowed"
                disabled={true}
              >
                Please log in
              </Button>
            )}

            {/* Conditionally render login/logout buttons */}
            {user ? (
              <Button
                className="hover:animate-pulse hover:bg-blue-700"
                onClick={handleSignOut}
              >
                Logout
              </Button>
            ) : (
              <Button
                className="hover:animate-pulse hover:bg-blue-700"
                onClick={handleLogin}
              >
                Login
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default Nav;
