'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { toast } from 'react-hot-toast';
import { Smile, Meh, Frown, Angry, Brain } from 'lucide-react';

const moods = [
    { emoji: <Smile className="w-5 h-5" />, label: 'Good' },
    { emoji: <Meh className="w-5 h-5" />, label: 'Okay' },
    { emoji: <Frown className="w-5 h-5" />, label: 'Sad' },
    { emoji: <Angry className="w-5 h-5" />, label: 'Frustrated' },
    { emoji: <Brain className="w-5 h-5" />, label: 'Reflective' },
];

export default function CreatePage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [mood, setMood] = useState<string | null>(null);
    const [spotifyUrl, setSpotifyUrl] = useState('');
    const [trackData, setTrackData] = useState<any>(null);
    const router = useRouter();
    const menuRef = useRef(null);
    const [hamburgerOpen, setHamburgerOpen] = useState(false);

    useEffect(() => {
        const savedMood = localStorage.getItem('userMood');
        if (savedMood) setMood(savedMood);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setHamburgerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const moodMessages: Record<string, string> = {
        Good: "You're in a good place. Let's reflect on that positivity.",
        Okay: "Let's make sense of the in-between. You're doing just fine.",
        Sad: "It's okay to bring your feelings here. Let it out gently.",
        Frustrated: "Frustration is fuel for insight. Let's unpack it together.",
        Reflective: "This is a perfect time to journal. Let's explore your thoughts.",
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleSpotifyUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setSpotifyUrl(url);

        if (url.includes('spotify.com/track/')) {
            try {
                const response = await fetch('/api/spotify', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ trackUrl: url }),
                });

                if (response.ok) {
                    const data = await response.json();
                    setTrackData(data);
                } else {
                    setTrackData(null);
                }
            } catch (error) {
                console.error('Error fetching track data:', error);
                setTrackData(null);
            }
        } else {
            setTrackData(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim()) {
            toast.error('Please enter a title');
            return;
        }

        try {
            let imagePath = '';
            if (image) {
                const formData = new FormData();
                formData.append('image', image);

                const uploadResponse = await fetch('/api/upload-image', {
                    method: 'POST',
                    body: formData,
                });

                if (uploadResponse.ok) {
                    const { imagePath: uploadedPath } = await uploadResponse.json();
                    imagePath = uploadedPath;
                } else {
                    console.error('Failed to upload image');
                    return;
                }
            }

            const response = await fetch('/api/save-entry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    title, 
                    content, 
                    imagePath,
                    spotifyTrack: trackData 
                }),
            });

            if (response.ok) {
                router.push('/entries');
            } else {
                console.error('Failed to save entry');
            }
        } catch (error) {
            console.error('Error saving entry:', error);
        }
    };

    return (
        <main className="relative h-screen w-full overflow-x-hidden bg-[#f9f9f6] text-gray-800 flex flex-col p-4">
            <Header showBack={true} />

            {mood && (
                <div className="flex items-center mt-8 mb-4 px-2">
                    <img
                        src="/freud-avatar.png"
                        alt="Freud Droid"
                        className="w-8 h-8 rounded-full mr-2 border-2 border-blue-200 bg-white"
                    />
                    <span className="text-sm text-gray-700 italic">
                        {mood && moodMessages[mood] ? moodMessages[mood] : `You're feeling ${mood?.toLowerCase()}. Let's explore it.`}
                    </span>
                </div>
            )}

            <div className="flex-1 overflow-y-auto">
                <form onSubmit={handleSubmit} className="flex flex-col mt-2 space-y-4 max-w-[384px] mx-auto">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-black bg-white"
                            placeholder="Enter your title"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                            Content
                        </label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[200px] text-black placeholder:text-black bg-white"
                            placeholder="Write your content here..."
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                            Image
                        </label>
                        {!imagePreview ? (
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                            />
                        ) : (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Preview"
                                    className="max-h-48 rounded-lg object-cover w-full"
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        setImage(null);
                                        setImagePreview(null);
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>

                    <div>
                        <label htmlFor="spotify" className="block text-sm font-medium text-gray-700 mb-1">
                            Spotify Track
                        </label>
                        <input
                            type="text"
                            id="spotify"
                            value={spotifyUrl}
                            onChange={handleSpotifyUrlChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black placeholder:text-black bg-white"
                            placeholder="Paste a Spotify track URL here..."
                        />
                        {trackData && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                    <img 
                                        src={trackData.image} 
                                        alt={trackData.name} 
                                        className="w-12 h-12 rounded"
                                    />
                                    <div>
                                        <p className="font-medium">{trackData.name}</p>
                                        <p className="text-sm text-gray-600">{trackData.artist}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 px-4 rounded-xl font-medium shadow-sm hover:shadow-md transition cursor-pointer"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </main>
    );
}
