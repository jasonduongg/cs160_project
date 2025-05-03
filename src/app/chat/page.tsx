import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import Header from '../components/Header';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

function getFirstGreeting(personality: string): string {
  switch (personality) {
    case 'supportive':
      return "Hello! I'm here to support you. How are you feeling today?";
    case 'rational':
      return "Let's analyze your thoughts logically. What's on your mind?";
    case 'playful':
      return "Hey there! Ready for some fun conversation? What's up?";
    case 'motivational':
      return "Great to see you! What goals are you working towards today?";
    case 'freud':
      return "Ah, welcome my dear patient. What brings you to my couch today?";
    default:
      return "Hello! How can I help you today?";
  }
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([{ sender: 'ai', text: getFirstGreeting('supportive') }]);
  const [input, setInput] = useState('');
  const [personality, setPersonality] = useState('supportive');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // When personality changes, reset messages with new greeting
    setMessages([{ sender: 'ai', text: getFirstGreeting(personality) }]);
  }, [personality]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex items-start justify-between ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
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
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-blue-200 shadow-sm bg-white flex-shrink-0 mt-5">
                        <img
                          src="/user-avatar.jpg"
                          alt="User Avatar"
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <div className="flex flex-col items-end mr-2 text-right">
                        <p className="text-xs text-gray-500 mb-1">James</p>
                        <div className="p-3 rounded-lg text-sm max-w-xs bg-blue-100">
                          {msg.text}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </div>

      {/* Input field */}
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