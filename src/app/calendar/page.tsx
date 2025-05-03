'use client';

import React, { useEffect, useState } from "react";
import Header from '@/components/Header';

const weekDays = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];

//TODO: make this procedural?
const LEADING_BLANKS = 4;

interface Entry {
  id: string;
  title: string;
  content: string;
  vibes: string[];
  colorHex: string;

  imagePath?: string;
  spotifyTrack?: {
      id: string;
      name: string;
      artist: string;
      album: string;
      image: string;
      preview_url: string;
  };
  timestamp: string;
}

const createEmptyEntry = (): Entry => ({
  id: '',
  title: '',
  content: '',
  vibes: [],
  colorHex: '',
  timestamp: '',
});

export default function Calendar() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [paddedEntries, setPaddedEntries] = useState<Entry[]>([]);

  useEffect(() => {
    fetch('/database/text.json')
      .then((res) => res.json())
      .then((data) => setEntries(data.entries || []))
      .catch((err) => console.error('Error loading entries:', err));
    
  }, []);


  // Only needed for calendar type, change to slice up to max days for non-calendar
  useEffect(() => {
    if (entries.length > 0) {
      // Only needed if doing calendar style
      const uniqueEntriesByDay = Array.from(
        new Map(
          entries.map((entry) => [
            new Date(entry.timestamp).getDate(), // key: 'YYYY-MM-DD'
            entry,
          ])
        ).values()
      );

      const first_day = new Date(uniqueEntriesByDay[0].timestamp).getDate();

      //const leadingBlanks = Array(LEADING_BLANKS + first_day).fill(createEmptyEntry());

      //31 for max days
      var paddedEntries: Entry[] = Array(31).fill(createEmptyEntry());

      uniqueEntriesByDay.forEach((entry) => {
        paddedEntries[LEADING_BLANKS + new Date(entry.timestamp).getDate()] = entry;
      });

      setPaddedEntries(paddedEntries);
    }
  }, [entries]);


  return (
    <main className="relative h-screen w-full overflow-x-hidden bg-[#f9f9f6] text-gray-800 flex flex-col p-4">  
      <Header showBack={true} />
      <div className="p-6 text-center">
        <h2 className="text-xl font-medium text-left mb-4">
          Hi Sophia! Overall, you’ve been feeling joyous and peaceful lately...
        </h2>
        <h1 className="text-3xl font-bold text-left mb-4">April at a Glance</h1>

        <div className="grid grid-cols-7 text-gray-500 font-medium mb-2">
          {weekDays.map((day) => (
            <div key={day} className="text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {paddedEntries.flat().map((entry, index) => (
            <div
              key={index}
              className="w-10 h-10 rounded-md"
              style={{ backgroundColor: entry.colorHex || "transparent"}}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
