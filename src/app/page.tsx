'use client';

import { useState } from 'react';

import Link from 'next/link';
import { FaMicrophone } from 'react-icons/fa';

export default function Home() {

  const [message, setMessage] = useState("");


  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 bg-gray-400 mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-black mb-4">

          </h1>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Welcome to Your Digital Assistant
          </p>
        </div>

        <ul className="space-y-4">
          <li>
            <Link href="/create" className="block p-4 bg-white text-black rounded-lg shadow hover:shadow-md transition-shadow">
              Create New Entry
            </Link>
          </li>
          <li>
            <Link href="/catalogs" className="block p-4 bg-white text-black rounded-lg shadow hover:shadow-md transition-shadow">
              Browse Catalogs
            </Link>
          </li>
          <li>
            <Link href="/landing" className="block p-4 bg-white text-black rounded-lg shadow hover:shadow-md transition-shadow">
              Landing
            </Link>
          </li>
        </ul>
      </div>

      <p>{message}</p>

      <div className='h-12 bg-gray-200 w-full'>
        <input type="text" placeholder="Type your message..." className='text-black w-full h-full px-4' value={message} onChange={(e) => setMessage(e.target.value)} />
      </div>
    </div>
  );
}
