"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { doc, getDocs, collection, deleteDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Nav from "@/components/Nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Login from "@/components/Login";
import Footer from "@/components/Footer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";



function History() {
  const [history, setHistory] = useState<any[]>([]);
  const [user, loading] = useAuthState(auth);  
  const email = user?.email

  const fetchData = useCallback(async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "db")); // Replace 'Ideas' with your actual collection name
      const data: any = [];

      querySnapshot.forEach((doc) => {
        const entry = { id: doc.id, email, ...doc.data() };

        if (entry.email === email) {
          data.push(entry);
        }
      });

      setHistory(data);
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  }, [email]);

  // Call fetchData within a function or component
  const fetchDataAndDoSomething = useCallback(async () => {
    try {
      const data = await fetchData();
      setHistory(data);
      // Do something with the fetched data
    } catch (error) {
      console.error("Error:", error);
    }
  }, [fetchData]);

  useEffect(() => {
    const fetchDataAndDoSomething = async () => {
      try {
        const data = await fetchData();
        setHistory(data);
        // Do something with the fetched data
      } catch (error) {
        console.error("Error:", error);
      }
    };

    // Call the fetchDataAndDoSomething function when the component mounts
    fetchDataAndDoSomething();
  }, [fetchData]); // Include fetchData in the dependency array

  async function deleteEntry(entryId: any) {
    try {
      await deleteDoc(doc(db, "db", entryId));
      console.log("Entry deleted successfully");
      // Call fetchData to refresh the history after deletion
      fetchDataAndDoSomething();
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  }




  if (!user) {
    console.log('User is not authenticated try login in first');
    return <Login/>
  }


  return (
    <div className="h-screen bg-[#090810] overflow-hidden">
      <Nav />
      <section className="px-8 py-12 md:py-24 lg:py-32 ">
        <div className="container p-4 md:px-6 bg-[#978eda] h-[85%] rounded-2xl">
          <div className="flex flex-col items-center space-y-4 text-center rounded-lg p-4">
            <div className="space-y-2">

              <h1 className="text-3xl m-4 underline font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                Log Archive
              </h1>

              <p className="mx-auto max-w-[700px] text-black md:text-xl dark:text-gray-400">
                Browse through the log entries to check the activities on your account.
              </p>
            </div>
          </div>

          <Carousel className="p-8 my-8">
  <CarouselContent>
    {history.length > 0 ? (
      history.map((entry) => (
        <CarouselItem key={entry.id}>
          <Card className="m-4 bg-gray-100 shadow-lg rounded-xl">
            <CardHeader className="flex items-center justify-between bg-gray-200 py-3 px-6 rounded-t-xl">
              <div className="flex flex-col">
                <h2 className="text-lg font-bold">{`Log Entry: ${entry.id}`}</h2>
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v2H5a1 1 0 100 2h4v2a1 1 0 102 0V8h4a1 1 0 100-2h-4V4a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-600">{entry.name}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v2H5a1 1 0 100 2h4v2a1 1 0 102 0V8h4a1 1 0 100-2h-4V4a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-600">{entry.email}</p>
                  <AlertDialog>
  <AlertDialogTrigger><Button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md">Delete</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete the document
        and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction className="bg-red-700 hover:bg-red-900"  onClick={() => deleteEntry(entry.id)} >Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

                </div>




              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">Prompt:</h3>
                <p className="text-gray-800 text-base font-semibold">{entry.prompt}</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Response:</h3>
                <textarea 
                  rows={13} 
                  defaultValue={entry.response} 
                  className="w-full text-base border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </CardContent>
          </Card>
        </CarouselItem>
      ))
    ) : (
      <div className="flex items-center justify-center h-64">
        <p className="text-lg text-gray-600">No log entries found.</p>
      </div>
    )}
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>

        </div>
        <Footer />
      </section>
    </div>
  );
}

export default History;
