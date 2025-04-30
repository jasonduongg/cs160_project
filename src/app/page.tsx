'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Smile, Frown, Meh, Angry, Brain } from 'lucide-react';
import Header from '@/components/Header';

export default function LandingPage() {
  const [mood, setMood] = useState<string | null>(null);

  const moods = [
    { emoji: <Smile className="w-5 h-5" />, label: 'Good' },
    { emoji: <Meh className="w-5 h-5" />, label: 'Okay' },
    { emoji: <Frown className="w-5 h-5" />, label: 'Sad' },
    { emoji: <Angry className="w-5 h-5" />, label: 'Frustrated' },
    { emoji: <Brain className="w-5 h-5" />, label: 'Reflective' },
  ];

  const moodResponses: Record<string, string> = {
    Good: "Glad to hear you're feeling good. Want to capture this mood in writing?",
    Okay: "Even 'okay' days have something to say. What’s been on your mind?",
    Sad: "Sounds like it’s a heavy day. I’m ready to listen, no judgment.",
    Frustrated: "Frustration often hides something deeper. Want to unpack it?",
    Reflective: "You're in a thoughtful state — let’s explore it together.",
  };

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-[#f9f9f6] text-gray-800 flex flex-col items-center justify-between p-6">
      <Header />

      <section className="w-full text-center mt-20">
        <h1 className="text-3xl font-semibold mb-4">Hi there. How are you arriving today?</h1>
        <div className="flex justify-center flex-wrap gap-3">
          {moods.map((m) => (
            <button
              key={m.label}
              onClick={() => {
                setMood(m.label);
                localStorage.setItem('userMood', m.label); // Save to localStorage
              }}
              className={`flex flex-col items-center justify-center w-20 h-20 p-2 rounded-lg border hover:bg-blue-100 transition ${
                mood === m.label ? 'bg-blue-200' : ''
              }`}
            >
              {m.emoji}
              <span className="text-xs mt-1">{m.label}</span>
            </button>
          ))}
        </div>
        {mood && (
          <p className="mt-4 text-sm text-gray-600 italic px-4">
            {moodResponses[mood]}
          </p>
        )}
      </section>

      <section className="w-full flex flex-col items-center mt-16">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-200 shadow-sm mb-4 bg-white">
          <img
            src="/freud-avatar.png"
            alt="AI Avatar"
            className="object-contain w-full h-full p-1"
          />
        </div>
        <blockquote className="italic text-sm text-gray-600 text-center max-w-sm">
          “You don't have to make sense. You just have to begin.”
        </blockquote>
      </section>

      <section className="w-full mt-12 mb-24 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center max-w-md">
        <Link href="/create" className="bg-[#f9f9f6] border border-blue-300 rounded-xl py-4 px-6 text-blue-600 font-medium shadow-sm hover:shadow-md transition">📝 Reflect</Link>
        <Link href="/chat/example" className="bg-[#f9f9f6] border border-purple-300 rounded-xl py-4 px-6 text-purple-600 font-medium shadow-sm hover:shadow-md transition">💬 Vent</Link>
        <Link href="/entries" className="bg-[#f9f9f6] border border-green-300 rounded-xl py-4 px-6 text-green-600 font-medium shadow-sm hover:shadow-md transition">📖 Revisit</Link>
      </section>
    </main>
  );
}
