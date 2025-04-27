'use client';

import { Search, Home } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Entry {
  title: string;
  content: string;
  timestamp: string;
}

export default function CatalogsPage() {
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    fetch('/database/text.json')
      .then(response => response.json())
      .then(data => setEntries(data.entries || []))
      .catch(error => console.error('Error loading entries:', error));
  }, []);

  const rotations = [
    'rotate-[-2deg]',
    'rotate-[2deg]',
    'rotate-[-1deg]',
    'rotate-[1deg]',
    'rotate-[-1.5deg]',
    'rotate-[1.5deg]',
  ];

  return (
    <main className="p-4 bg-white min-h-screen text-black">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6">
        <Search className="w-6 h-6" />
        <h1 className="text-3xl font-bold text-center">Entries</h1>
        <Home className="w-6 h-6" />
      </div>

      {/* Grid of cards */}
      <div className="grid grid-cols-2 gap-6">
        {entries.map((entry, index) => (
          <div
            key={index}
            className={`aspect-square rounded-3xl overflow-hidden bg-white shadow-md transform ${rotations[index % rotations.length]} hover:scale-105 transition-transform duration-200 flex flex-col`}
          >
            {/* Image section */}
            <div className="h-[60%] w-full relative overflow-hidden">
              <img
                src="/sausalito.jpeg"
                alt={entry.title}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Text section */}
            <div className="flex-1 p-3 flex flex-col justify-center">
              <h2 className="text-base font-semibold mb-1 truncate">
                {entry.title}
              </h2>
              <p className="text-xs text-gray-600 leading-snug line-clamp-2">
                {entry.content}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(entry.timestamp).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
