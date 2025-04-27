'use client';

import { useState } from 'react';
import { FaMicrophone } from 'react-icons/fa';
import Navbar from '@/components/Navbar';

export default function Home() {
  const [message, setMessage] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = async () => {
    if (!message.trim() || !title.trim()) return;

    try {
      const response = await fetch('/api/save-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, title }),
      });

      if (response.ok) {
        setMessage('');
        setTitle('');
      } else {
        console.error('Failed to save message');
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Navbar title="Home" />
      <div className="flex-1 bg-gray-400 mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-black mb-4">
          </h1>
          <p className="text-xl text-black max-w-2xl mx-auto">
            Welcome to Your Digital Assistant
          </p>
        </div>
      </div>

      <p>{message}</p>

      <div className='h-12 bg-gray-200 w-full flex mb-2'>
        <input
          type="text"
          placeholder="Enter title..."
          className='text-black w-full h-full px-4'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className='h-12 bg-gray-200 w-full flex'>
        <input
          type="text"
          placeholder="Type your message..."
          className='text-black w-full h-full px-4'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmit();
            }
          }}
        />
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 hover:bg-blue-600 transition-colors"
        >
          Submit
        </button>
      </div>
    </div>
  );
}
