'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import SpotifyPlayer from '@/components/SpotifyPlayer';

interface Entry {
  id: string;
  title: string;
  content: string;
  timestamp: string;
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

export default function EntryPage() {
  const params = useParams();
  const router = useRouter();
  const [entry, setEntry] = useState<Entry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [mood, setMood] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const response = await fetch('/database/text.json');
        const data = await response.json();
        const foundEntry = data.entries.find((e: Entry) => e.id === params.id);
        if (foundEntry) {
          setEntry(foundEntry);
          setEditedContent(foundEntry.content);
        } else {
          setError('Entry not found');
        }
      } catch {
        setError('Failed to load entry');
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
    const savedMood = localStorage.getItem('mood');
    if (savedMood) setMood(savedMood);
  }, [params.id]);

  useEffect(() => {
    if (entry?.spotifyTrack?.preview_url) {
      const newAudio = new Audio(entry.spotifyTrack.preview_url);
      newAudio.addEventListener('ended', () => setIsPlaying(false));
      setAudio(newAudio);
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.removeEventListener('ended', () => setIsPlaying(false));
      }
    };
  }, [entry?.spotifyTrack?.preview_url]);

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

  const updateTitle = async (newTitle: string) => {
    try {
      const response = await fetch(`/api/entries/${params.id}/title`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!response.ok) throw new Error('Failed to update title');

      if (entry) {
        setEntry({ ...entry, title: newTitle });
        toast.success('Title updated');
      }
    } catch (err) {
      toast.error('Error updating title');
    }
  };

  const updateContent = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/entries/${params.id}/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editedContent }),
      });

      if (!response.ok) throw new Error('Failed to update content');

      if (entry) {
        setEntry({ ...entry, content: editedContent });
        setIsEditingContent(false);
        toast.success('Content updated');
      }
    } catch (err) {
      toast.error('Error updating content');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/entries/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete entry');

      toast.success('Entry deleted');
      router.push('/entries');
    } catch (err) {
      toast.error('Error deleting entry');
    }
  };

  if (loading) return <main className="p-4 text-gray-600">Loading...</main>;
  if (error) return <main className="p-4 text-red-500">{error}</main>;

  return (
    <main className="relative h-screen w-full overflow-x-hidden bg-[#f9f9f6] text-gray-800 flex flex-col p-4">
      <Header showBack={true} />
      <Toaster position="top-center" />

      {mood && (
        <p className="text-sm italic text-gray-600 mt-4 mb-4">
          You're in a <span className="font-medium text-blue-700">{mood.toLowerCase()}</span> place. Let's explore what that means to you today.
        </p>
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[384px] mx-auto px-4">
          {/* Title */}
          <div className="flex items-center justify-between mb-2">
            {isEditingTitle ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={() => {
                  if (entry && editedTitle !== entry.title) updateTitle(editedTitle);
                  setIsEditingTitle(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (entry && editedTitle !== entry.title) updateTitle(editedTitle);
                    setIsEditingTitle(false);
                  }
                }}
                autoFocus
                className="text-2xl font-bold border-b border-blue-500 bg-transparent focus:outline-none w-full"
              />
            ) : (
              <h1 className="text-2xl font-bold">{entry?.title}</h1>
            )}
            <button
              onClick={() => {
                setIsEditingTitle(true);
                setEditedTitle(entry?.title || '');
              }}
              className="text-sm text-blue-600 hover:underline cursor-pointer"
            >
              Edit
            </button>
          </div>

          {/* Timestamp */}
          <div className="text-xs text-gray-500 mb-4">
            {entry && new Date(entry.timestamp).toLocaleDateString('en-US', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </div>

          {/* Action Buttons */}
          {!isEditingContent && (
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => window.location.href = `/chat/${entry?.id}`}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
              >
                💬 Chat
              </button>
              <button
                onClick={() => setIsEditingContent(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                ✏️ Edit
              </button>
            </div>
          )}

          {/* Content */}
          <div className="prose max-w-none">
            {isEditingContent ? (
              <div className="fixed inset-0 bg-white z-50 flex flex-col p-4">
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-full border border-blue-500 p-4 rounded-lg resize-none focus:outline-none"
                />
                <div className="flex justify-end gap-4 mt-4">
                  <button
                    onClick={() => {
                      setIsEditingContent(false);
                      setEditedContent(entry?.content || '');
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={updateContent}
                    disabled={isSaving}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </div>
            ) : (
              <>
                {entry?.spotifyTrack && (
                  <div className="mb-6">
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
                <p className="whitespace-pre-wrap text-sm text-gray-800">{entry?.content}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 p-4 border-t border-gray-200">
        <button onClick={handleDelete} className="text-red-600 hover:text-red-800 transition cursor-pointer">
          Delete
        </button>
      </div>
    </main>
  );
}
