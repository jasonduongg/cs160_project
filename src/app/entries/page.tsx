'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import Header from '@/components/Header';

interface Entry {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  imagePath?: string;
}

export default function CatalogsPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/database/text.json')
      .then((res) => res.json())
      .then((data) => setEntries(data.entries || []))
      .catch((err) => console.error('Error loading entries:', err));
  }, []);

  const filteredEntries = entries.filter((entry) =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const rotations = [
    'rotate-[-2deg]',
    'rotate-[2deg]',
    'rotate-[-1deg]',
    'rotate-[1deg]',
    'rotate-[-1.5deg]',
    'rotate-[1.5deg]',
  ];

  return (
    <main className="relative min-h-screen bg-[#f9f9f6] text-gray-800 px-4 pt-8 pb-6">
      <Header showBack={true} />

      {/* Search Bar */}
      <div className="relative mb-6 mt-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search entries..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500 text-black"
        />
      </div>

      {/* Grid of Entry Cards */}
      <div className="grid grid-cols-2 gap-6">
        {filteredEntries.map((entry, index) => (
          <Link
            key={entry.id}
            href={`/entries/${entry.id}`}
            className={`aspect-square rounded-3xl overflow-hidden bg-white shadow-md transform ${rotations[index % rotations.length]} hover:scale-105 hover:rotate-[-2deg] hover:rotate-[2deg] transition-all duration-200 flex flex-col`}
          >
            {/* Image section */}
            <div className="h-[60%] w-full relative overflow-hidden">
              <img
                src={entry.imagePath || '/sausalito.jpeg'}
                alt={entry.title}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Text section */}
            <div className="flex-1 p-3 flex flex-col justify-center">
              <h2 className="text-black font-bold mb-1 truncate">
                {entry.title}
              </h2>
              <p className="text-xs text-gray-600 leading-snug line-clamp-2">
                {entry.content}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(entry.timestamp).toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: true,
                })}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
