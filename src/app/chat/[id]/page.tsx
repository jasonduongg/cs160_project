'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

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
  const [showEntry, setShowEntry] = useState(true); // for collapsible entry

  useEffect(() => {
    fetch('/database/text.json')
      .then(res => res.json())
      .then(data => {
        const entry = data.entries.find((e: any) => e.id === id);
        if (entry) {
          setEntryText(entry.content);
          setInitialGreeting(getFirstGreeting(entry.content.slice(0, 100), personality));
          setMessages([]);
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
    }
  };

  if (loading) {
    return <div className="p-4">Loading journal entry...</div>;
  }

  return (
    <main className="max-w-2xl mx-auto p-4 flex flex-col h-screen">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => history.back()}
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to Entry
        </button>
        <h1 className="text-2xl font-bold">Reflective Chat</h1>
        <select
          value={personality}
          onChange={(e) => setPersonality(e.target.value)}
          className="text-sm border rounded px-2 py-1 bg-white"
        >
          <option value="supportive">Supportive</option>
          <option value="rational">Rational</option>
          <option value="playful">Playful</option>
          <option value="motivational">Motivational</option>
        </select>
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {/* Collapsible Journal Entry */}
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
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                showEntry ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="whitespace-pre-wrap mt-2">{entryText}</p>
            </div>
          </div>
        )}

        {/* Initial AI greeting */}
        {initialGreeting && (
          <div className="p-3 rounded-md max-w-xs bg-gray-200 self-start">
            {initialGreeting}
          </div>
        )}

        {/* Chat messages */}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-md max-w-xs ${
              msg.sender === 'user'
                ? 'bg-blue-100 self-end'
                : 'bg-gray-200 self-start'
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
          className="flex-1 border rounded px-3 py-2"
        />
        <button
          onClick={handleSend}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </main>
  );
}
