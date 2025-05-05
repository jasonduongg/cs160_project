'use client';

import React, { useEffect, useState } from "react";
import Header from '@/components/Header';
import { Play, Pause } from 'lucide-react';

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
    image: string;
    preview_url: string;
  };
  timestamp: string;
}

export default function Calendar() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    fetch('/database/text.json')
      .then((res) => res.json())
      .then((data) => setEntries(data.entries || []))
      .catch((err) => console.error('Error loading entries:', err));
  }, []);

  useEffect(() => {
    if (selectedEntry?.spotifyTrack?.preview_url) {
      const newAudio = new Audio(selectedEntry.spotifyTrack.preview_url);
      newAudio.addEventListener('ended', () => setIsPlaying(false));
      setAudio(newAudio);
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.removeEventListener('ended', () => setIsPlaying(false));
      }
    };
  }, [selectedEntry?.spotifyTrack?.preview_url]);

  const togglePlay = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Calculate mood summary
  const getMoodSummary = () => {
    if (entries.length === 0) return "No entries yet.";
    
    const moodCounts: Record<string, number> = {};
    entries.forEach(entry => {
      entry.vibes.forEach(vibe => {
        moodCounts[vibe] = (moodCounts[vibe] || 0) + 1;
      });
    });

    const sortedMoods = Object.entries(moodCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    const moodPhrases = sortedMoods.map(([mood, count]) => {
      const percentage = Math.round((count / entries.length) * 100);
      return `${mood} (${percentage}%)`;
    });

    return `You have been feeling ${moodPhrases.join(', ')} lately.`;
  };

  // Calculate average color from recent entries
  const getAverageColor = () => {
    if (entries.length === 0) return '#FFFFFF';
    
    const recentEntries = entries
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 3);

    // Convert hex colors to RGB
    const colors = recentEntries.map(entry => {
      const hex = entry.colorHex.replace('#', '');
      return {
        r: parseInt(hex.substring(0, 2), 16),
        g: parseInt(hex.substring(2, 4), 16),
        b: parseInt(hex.substring(4, 6), 16)
      };
    });

    // Calculate average RGB values
    const avg = colors.reduce((acc, color) => ({
      r: acc.r + color.r,
      g: acc.g + color.g,
      b: acc.b + color.b
    }), { r: 0, g: 0, b: 0 });

    const count = colors.length;
    const avgColor = {
      r: Math.round(avg.r / count),
      g: Math.round(avg.g / count),
      b: Math.round(avg.b / count)
    };

    // Convert back to hex
    return `#${avgColor.r.toString(16).padStart(2, '0')}${avgColor.g.toString(16).padStart(2, '0')}${avgColor.b.toString(16).padStart(2, '0')}`;
  };

  // Sort entries by timestamp
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <main className="relative h-screen w-full overflow-x-hidden bg-[#f9f9f6] text-gray-800 flex flex-col p-4">
      <Header showBack={true} />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[384px] mx-auto">
          <div 
            className="text-center mb-6 p-4 rounded-lg shadow-sm"
            style={{ 
              backgroundColor: `${getAverageColor()}20`,
              border: `1px solid ${getAverageColor()}40`
            }}
          >
            <p className="text-gray-700">{getMoodSummary()}</p>
          </div>
          
          <h1 className="text-2xl font-bold mb-4">Mood Tracker</h1>
          
          {/* Mood Grid */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {sortedEntries.map((entry, index) => (
              <div
                key={entry.id}
                className="aspect-square rounded-lg cursor-pointer transition-all duration-200 hover:scale-105 shadow-md"
                style={{ backgroundColor: entry.colorHex }}
                onClick={() => setSelectedEntry(entry)}
              />
            ))}
          </div>

          {/* Selected Entry Details */}
          {selectedEntry && (
            <div 
              className="rounded-xl p-4 shadow-md"
              style={{ 
                backgroundColor: `${selectedEntry.colorHex}20`,
                border: `1px solid ${selectedEntry.colorHex}40`
              }}
            >
              <h2 className="text-xl font-semibold mb-2">{selectedEntry.title}</h2>
              <p className="text-gray-600 mb-4">{selectedEntry.content}</p>
              
              {/* Vibes */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedEntry.vibes.map((vibe, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ 
                      backgroundColor: `${selectedEntry.colorHex}40`,
                      color: selectedEntry.colorHex
                    }}
                  >
                    {vibe}
                  </span>
                ))}
              </div>

              {/* Spotify Track */}
              {selectedEntry.spotifyTrack && (
                <div 
                  className="flex items-center gap-4 p-3 rounded-lg"
                  style={{ backgroundColor: `${selectedEntry.colorHex}20` }}
                >
                  <img
                    src={selectedEntry.spotifyTrack.image}
                    alt={selectedEntry.spotifyTrack.name}
                    className="w-12 h-12 rounded"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{selectedEntry.spotifyTrack.name}</p>
                    <p className="text-sm text-gray-600">{selectedEntry.spotifyTrack.artist}</p>
                  </div>
                  {selectedEntry.spotifyTrack.preview_url && (
                    <button
                      onClick={togglePlay}
                      className="p-2 rounded-full text-white transition-colors"
                      style={{ backgroundColor: selectedEntry.colorHex }}
                    >
                      {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
