'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Header from '@/components/Header';
import Navbar from '@/components/Navbar';
import { toast } from 'react-hot-toast';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

interface Entry {
  id: string;
  title: string;
  content: string;
  spotifyTrack?: {
    id: string;
    name: string;
    artist: string;
    album: string;
    image: string;
    preview_url: string;
    external_url: string;
  };
}

function getFirstGreeting(entrySnippet: string, personality: string): string {
  switch (personality) {
    case 'supportive':
      return `Thank you for sharing your thoughts: " ${entrySnippet}... " How were you feeling when you wrote this?`;
    case 'rational':
      return `Let's analyze your entry logically: " ${entrySnippet}... " What thoughts led you here?`;
    case 'playful':
      return `Ooh, juicy! " ${entrySnippet}... " Tell me the wildest thing you were thinking!`;
    case 'motivational':
      return `This is a step forward! " ${entrySnippet}... " What strength were you tapping into?`;
    case 'freud':
      return `Ah, most interesting, Herr Patient. " ${entrySnippet}... " Let us explore the deeper meaning behind these thoughts. What childhood memories might this evoke?`;
    default:
      return `Let's talk about your journal entry: " ${entrySnippet}... " What was going through your mind?`;
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
  const [entry, setEntry] = useState<Entry | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await fetch('/database/text.json');
        const data = await response.json();
        const foundEntry = data.entries.find((e: Entry) => e.id === id);
        if (foundEntry) {
          setEntryText(foundEntry.content);
          setInitialGreeting(getFirstGreeting(foundEntry.content.slice(0, 100), personality));
          setEntry(foundEntry);
        } else {
          toast.error('Entry not found');
        }
      } catch (error) {
        console.error('Error fetching entry:', error);
        toast.error('Failed to load entry');
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  useEffect(() => {
    if (entryText) {
      setInitialGreeting(getFirstGreeting(entryText.slice(0, 100), personality));
    }
  }, [personality, entryText]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
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

      if (!response.ok) throw new Error('Failed to get response');
      const text = await response.text();
      const aiMessage: Message = { sender: 'ai', text: text };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to send message');
      const errorMessage: Message = { sender: 'ai', text: "I'm having trouble responding right now. Please try again." };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading journal entry...</div>;
  }

  return (
    <main className="relative h-screen w-full overflow-x-hidden bg-[#f9f9f6] text-gray-800 flex flex-col p-4">
      <Header showBack={true} />

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[384px] mx-auto px-4">
          <div className="prose max-w-none">
            {/* Freud Droid avatar + personality */}
            <div className="w-full flex flex-col items-center mt-8">
              <div className="flex flex-col items-center mb-4">
                <p className="text-sm text-gray-600 mb-2">Select Freud's personality:</p>
                <select
                  value={personality}
                  onChange={(e) => setPersonality(e.target.value)}
                  className="text-sm border rounded px-3 py-1 bg-white shadow-sm"
                >
                  <option value="supportive">Supportive</option>
                  <option value="rational">Rational</option>
                  <option value="playful">Playful</option>
                  <option value="motivational">Motivational</option>
                  <option value="freud">Sigmund Freud</option>
                </select>
              </div>
            </div>

            {/* Chat area */}
            <div className="space-y-4 mb-4">
              {entryText && (
                <div className="p-4 rounded-md bg-yellow-50 border border-yellow-200 text-gray-700 italic text-sm">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-bold text-gray-800">{entry?.title}</h2>
                  </div>
                  {entry?.spotifyTrack && (
                    <div className="mb-4">
                      <iframe
                        src={`https://open.spotify.com/embed/track/${entry.spotifyTrack.id}?utm_source=generator`}
                        width="100%"
                        height="80"
                        frameBorder="0"
                        allowFullScreen
                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                        loading="lazy"
                        className="rounded-lg"
                      />
                    </div>
                  )}
                  <p className="whitespace-pre-wrap">{entryText}</p>
                </div>
              )}

              {initialGreeting && (
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-200 shadow-sm bg-white flex-shrink-0 mt-5">
                    <img
                      src="/freud-avatar.png"
                      alt="AI Avatar"
                      className="object-cover w-full h-full translate-y-1"
                    />
                  </div>
                  <div className="flex flex-col ml-2">
                    <p className="text-xs text-gray-500 mb-1">Freud Droid</p>
                    <div className="p-3 rounded-lg text-sm max-w-xs bg-gray-200">
                      {initialGreeting}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between"
                >
                  {msg.sender === 'ai' ? (
                    <>
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-200 shadow-sm bg-white flex-shrink-0 mt-5">
                        <img
                          src="/freud-avatar.png"
                          alt="AI Avatar"
                          className="object-cover w-full h-full translate-y-1"
                        />
                      </div>
                      <div className="flex flex-col ml-2">
                        <p className="text-xs text-gray-500 mb-1">Freud Droid</p>
                        <div className="p-3 rounded-lg text-sm max-w-xs bg-gray-200">
                          {msg.text}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col items-end mr-2">
                        <p className="text-xs text-gray-500 mb-1">Bjoern</p>
                        <div className="p-3 rounded-lg text-sm max-w-xs bg-blue-100">
                          {msg.text}
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-200 shadow-sm bg-white flex-shrink-0 mt-5">
                        <img
                          src="/user-avatar.jpg"
                          alt="User Avatar"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Personality selector and input field */}
      <div className="pt-2">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Talk about it..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
