'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';

export default function CreatePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mood, setMood] = useState<string | null>(null);
  const router = useRouter();
  const menuRef = useRef(null);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  useEffect(() => {
    const savedMood = localStorage.getItem('userMood');
    if (savedMood) setMood(savedMood);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setHamburgerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const moodMessages: Record<string, string> = {
    Good: "You're in a good place — let’s reflect on that positivity.",
    Okay: "Let’s make sense of the in-between. You’re doing just fine.",
    Sad: "It’s okay to bring your feelings here. Let it out gently.",
    Frustrated: "Frustration is fuel for insight. Let’s unpack it together.",
    Reflective: "This is a perfect time to journal. Let’s explore your thoughts.",
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let imagePath = '';
      if (image) {
        const formData = new FormData();
        formData.append('image', image);

        const uploadResponse = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });

        if (uploadResponse.ok) {
          const { imagePath: uploadedPath } = await uploadResponse.json();
          imagePath = uploadedPath;
        } else {
          console.error('Failed to upload image');
          return;
        }
      }

      const response = await fetch('/api/save-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content, imagePath }),
      });

      if (response.ok) {
        router.push('/entries');
      } else {
        console.error('Failed to save entry');
      }
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  return (
<main className="relative min-h-screen bg-[#f9f9f6] text-gray-800 px-4 pt-8 pb-4">
      <Header showBack />

      {mood && (
        <div className="text-sm text-gray-700 italic mt-8 mb-4 px-2">
          {moodMessages[mood] || `You're feeling ${mood.toLowerCase()} — let's explore it.`}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col mt-2 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-black bg-white"
            placeholder="Enter your title"
            required
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px] text-black placeholder:text-black bg-white"
            placeholder="Write your content here..."
            required
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Image
          </label>
          {!imagePreview ? (
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          ) : (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-48 rounded-lg object-cover w-full"
              />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors mt-4"
        >
          Submit
        </button>
      </form>
    </main>
  );
}
