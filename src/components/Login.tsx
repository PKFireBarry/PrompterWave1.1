import React from 'react';
import { motion } from 'framer-motion';
import Nav from './Nav';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, provider } from '../../firebase';
import { Button } from './ui/button';
import Link from 'next/link';

function Login() {
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
        <main className="">
            <Nav />

            {/* Login UI */}
            <section>
                <div className="flex items-center min-h-screen p-6 sm:p-10  bg-[#978eda]">

                    <div className="mx-auto w-full max-w-sm space-y-4 bg-[#ececf2] rounded-xl outline p-4">
                        <h1 className="text-5xl font-bold pb-8 my-4">
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
                        <div className="space-y-2 items-center flex justify-start flex-col">
                            <h1 className="text-3xl font-bold underline">Log in to your account</h1>
                            <p className="text-gray-500 dark:text-gray-400">Login with google to access your account</p>
                        </div>
                        <div className="space-y-4">
                            <Button onClick={handleLogin} className="w-full hover:animate-pulse hover:bg-blue-700 hover:scale-105 transition-all">Sign in with Google</Button>
                            <div className="text-center text-sm">
                                Don&apos;t have an account?
                                <a className="underline hover:animate-pulse hover:bg-blue-700" onClick={handleLogin}>
                                    <br />
                                    Sign up
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}

export default Login;
