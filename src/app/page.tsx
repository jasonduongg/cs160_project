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
    Okay: "Even 'okay' days have something to say. What's been on your mind?",
    Sad: "Sounds like it's a heavy day. I'm ready to listen, no judgment.",
    Frustrated: "Frustration often hides something deeper. Want to unpack it?",
    Reflective: "You're in a thoughtful state. Let's explore it together.",
  };

  return (
    <main className="relative h-screen w-full overflow-x-hidden bg-[#f9f9f6] text-gray-800 flex flex-col p-4">
      <Header />

      <section className="w-full text-center mt-16">
        <h1 className="text-2xl font-semibold">Hi, James.</h1>
        <p className="text-lg mt-2">How are you arriving today?</p>
        <div className="grid grid-cols-5 gap-4 w-full max-w-md mx-auto mt-8">
          {moods.map((m) => (
            <button
              key={m.label}
              onClick={() => {
                setMood(m.label);
                localStorage.setItem('userMood', m.label);
              }}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-lg border hover:bg-blue-100 transition cursor-pointer ${mood === m.label ? 'bg-blue-200' : ''}`}
            >
              {m.emoji}
              <span className="text-xs mt-1">{m.label}</span>
            </button>
          ))}
        </div>
        {mood && (
          <p className="mt-8 text-sm text-gray-600 italic px-4">
            {moodResponses[mood]}
          </p>
        )}
      </section>

      <section className="w-full flex flex-col items-center mt-8">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-blue-200 shadow-sm mb-2 bg-white">
          <img
            src="/freud-avatar.png"
            alt="AI Avatar"
            className="object-cover w-full h-full translate-y-2"
          />
        </div>
        <blockquote className="italic text-xs text-gray-600 text-center max-w-sm">
          You don't have to make sense. You just have to begin.
        </blockquote>
      </section>

      <section className="w-full mt-4 mb-8 flex flex-col items-center space-y-3 max-w-[384px] mx-auto">
        <Link href="/create" className="w-full bg-[#f9f9f6] border border-blue-300 rounded-xl py-3 px-4 text-blue-600 font-medium shadow-sm hover:shadow-md transition text-center cursor-pointer">📝 Reflect</Link>
        <Link href="/chat/example" className="w-full bg-[#f9f9f6] border border-purple-300 rounded-xl py-3 px-4 text-purple-600 font-medium shadow-sm hover:shadow-md transition text-center cursor-pointer">💬 Vent</Link>
        <Link href="/entries" className="w-full bg-[#f9f9f6] border border-green-300 rounded-xl py-3 px-4 text-green-600 font-medium shadow-sm hover:shadow-md transition text-center cursor-pointer">📖 Revisit</Link>
      </section>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[384px] mx-auto px-4">
        </div>
      </div>
    </main>
  );
}
