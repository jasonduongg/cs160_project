'use client';

import { Search, Home } from 'lucide-react';

export default function CatalogsPage() {
  const entries = Array(6).fill(null);

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
        {entries.map((_, index) => (
          <div
            key={index}
            className={`aspect-square rounded-3xl overflow-hidden bg-white shadow-md transform ${rotations[index % rotations.length]} hover:scale-105 transition-transform duration-200 flex flex-col`}
          >
            {/* Image section */}
            <div className="h-[60%] w-full relative overflow-hidden">
              <img
                src="/sausalito.jpeg"
                alt="Entry"
                className="object-cover w-full h-full"
              />
            </div>

            {/* Text section */}
            <div className="flex-1 p-3 flex flex-col justify-center">
              <h2 className="text-base font-semibold mb-1 truncate">
                Entry
              </h2>
              <p className="text-xs text-gray-600 leading-snug line-clamp-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
