'use client';
import { useState, useRef, useEffect } from "react";

export default function LandingPage() {
    const [hamburgerOpen, setHamburgerOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
          if (menuRef.current && !menuRef.current.contains(event.target)) {
            setHamburgerOpen(false);
          }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, []);
    

    return (
        <main className="p-4 bg-white relative h-full flex flex-col">
            <div className="relative" ref={menuRef}>
            {/* Hamburger Icon */}
            <button
                onClick={() => setHamburgerOpen(!hamburgerOpen)}
                className="p-2 rounded-md hover:bg-gray-200 absolute right-0"
            >
                <div className="relative w-6 h-5">
                <span
                    className={`absolute block h-0.5 w-6 bg-black transform transition duration-300 ease-in-out ${hamburgerOpen ? "rotate-45 top-2.5" : "top-0"}`}
                ></span>
                <span
                    className={`absolute block h-0.5 w-6 bg-black transform transition duration-300 ease-in-out ${hamburgerOpen ? "opacity-0" : "top-2.5"}`}
                ></span>
                <span
                    className={`absolute block h-0.5 w-6 bg-black transform transition duration-300 ease-in-out ${hamburgerOpen ? "-rotate-45 top-2.5" : "top-5"}`}
                ></span>
                </div>
                {/* Use this for not animated one.
                <div className="space-y-1">
                <div className="w-6 h-0.5 bg-black"></div>
                <div className="w-6 h-0.5 bg-black"></div>
                <div className="w-6 h-0.5 bg-black"></div>
                </div>
                */}
            </button>

            {/* Menu Items */}
            {hamburgerOpen && (
                <div className="absolute right-0 mt-8 w-48 rounded-xl shadow-lg bg-gray-100 border p-4 space-y-4">
                <button className="w-full text-left text-gray-500 hover:text-blue-500">Home</button>
                <button className="w-full text-left text-gray-500 hover:text-blue-500">Reflect</button>
                <button className="w-full text-left text-gray-500 hover:text-blue-500">Chat</button>
                <button className="w-full text-left text-gray-500 hover:text-blue-500">Personality</button>
                <button className="w-full text-left text-gray-500 hover:text-blue-500">Profile</button>
                </div>
            )}
            </div>

            {/* Hello text */}
            <div className="flex-grow flex justify-center items-center mb-40">
                <h1 className="text-black text-4xl font-bold">Hello, User.</h1>
            </div>

            {/* Bottom Textarea and Microphone */}
            <div className="absolute bottom-4 left-0 right-0 flex-col justify-center px-4">
                <button className="p-3 mr-2 mb-1 bg-gray-100 border border-gray-300 rounded-full text-white hover:bg-blue-600">
                🎤
                </button>

                <textarea
                placeholder="Start talking to Freud..."
                className="w-full h-25 max-w-md p-3 rounded-[1vw] border border-gray-300 shadow-sm 
                            focus:outline-none focus:ring-2 focus:ring-blue-500
                            bg-gray-100 text-gray-400 resize-none"
                />
            </div>

        </main>
    );

}

