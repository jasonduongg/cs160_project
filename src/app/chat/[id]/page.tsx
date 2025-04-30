'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

function getFirstGreeting(entrySnippet: string, personality: string): string {
  switch (personality) {
    case 'supportive':
      return `Thank you for sharing your thoughts: “${entrySnippet}...” How were you feeling when you wrote this?`;
    case 'rational':
      return `Let's analyze your entry logically: “${entrySnippet}...” What thoughts led you here?`;
    case 'playful':
      return `Ooh, juicy! “${entrySnippet}...” Tell me the wildest thing you were thinking!`;
    case 'motivational':
      return `This is a step forward! “${entrySnippet}...” What strength were you tapping into?`;
    default:
      return `Let's talk about your journal entry: “${entrySnippet}...” What was going through your mind?`;
  }
}

export default function EntryChatPage() {
  const { id } = useParams();
  const [entryText, setEntryText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [personality, setPersonality] = useState('supportive');
  const [initialGreeting, setInitialGreeting] = useState('');
  const [showEntry, setShowEntry] = useState(true);

  useEffect(() => {
    fetch('/database/text.json')
      .then(res => res.json())
      .then(data => {
        const entry = data.entries.find((e: any) => e.id === id);
        if (entry) {
          setEntryText(entry.content);
          setInitialGreeting(getFirstGreeting(entry.content.slice(0, 100), personality));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (entryText) {
      setInitialGreeting(getFirstGreeting(entryText.slice(0, 100), personality));
    }
  }, [personality, entryText]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const response = await fetch(
        'https://noggin.rea.gent/casual-whale-9234',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer rg_v1_r75gpxfxiqdpyzybrumcgfbs002haa8xkzrz_ngk',
          },
          body: JSON.stringify({
            entryText: entryText,
            userInput: input,
            personality: personality,
          }),
        }
      );

      const text = await response.text();
      const aiResponse = { sender: 'ai', text: text };
      setMessages(prev => [...prev, aiResponse]);
    } catch (err) {
      console.error('Chat error', err);
      setMessages(prev => [...prev, { sender: 'ai', text: "Hmm, I'm having trouble responding right now." }]);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading journal entry...</div>;
  }

  return (
    <>
      <Header showBack={true} />
      <main className="bg-[#f9f9f6] text-gray-800 px-4 pb-24 pt-24 max-w-sm mx-auto flex flex-col min-h-screen">
        {/* Freud Droid avatar + personality */}
        <div className="flex flex-col items-center mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-blue-200 shadow-sm bg-white">
            <img src="/freud-avatar.png" alt="Freud Droid" className="object-contain w-full h-full p-1" />
          </div>
          <div className="mt-2 text-sm text-gray-500 italic capitalize">
            Freud Droid: {personality}
          </div>
        </div>

        <div className="flex justify-center mb-4">
          <select
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            className="text-sm border rounded px-3 py-1 bg-white shadow-sm"
          >
            <option value="supportive">Supportive</option>
            <option value="rational">Rational</option>
            <option value="playful">Playful</option>
            <option value="motivational">Motivational</option>
          </select>
        </div>

        {/* Chat area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {entryText && (
            <div className="p-4 rounded-md bg-yellow-50 border border-yellow-200 text-gray-700 italic text-sm">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-bold text-gray-800">Your Journal Entry</h2>
                <button
                  onClick={() => setShowEntry(prev => !prev)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  {showEntry ? 'Hide' : 'Show'}
                </button>
              </div>
              {showEntry && <p className="whitespace-pre-wrap">{entryText}</p>}
            </div>
          )}

          {initialGreeting && (
            <div className="p-3 rounded-lg bg-gray-200 text-sm max-w-xs self-start">
              {initialGreeting}
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-lg text-sm max-w-xs ${msg.sender === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-200 self-start'
                }`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input field */}
        <div className="flex gap-2 border-t pt-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk about it..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleSend}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
          >
            Send
          </button>
        </div>
      </main>
    </>
  );
}
