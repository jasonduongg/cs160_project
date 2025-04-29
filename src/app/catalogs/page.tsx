'use client';

import { Search, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

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
      .then(response => response.json())
      .then(data => setEntries(data.entries || []))
      .catch(error => console.error('Error loading entries:', error));
  }, []);

  const filteredEntries = entries.filter(entry =>
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
    <main className="h-full">
      {/* Top bar */}

      <Navbar title="Entries" />

      <div className="flex flex-col bg-white h-full px-4 pt-4 mb-6">
        {/* Search bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 text-black"
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Grid of cards */}
        <div className="grid grid-cols-2 gap-6">
          {filteredEntries.map((entry, index) => (
            <Link
              href={`/entries/${entry.id}`}
              key={entry.id}
              className={`aspect-square rounded-3xl overflow-hidden bg-white shadow-md transform ${rotations[index % rotations.length]} hover:scale-105 transition-transform duration-200 flex flex-col`}
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
                    hour12: true
                  })}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
