'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

interface Entry {
    id: string;
    title: string;
    content: string;
    timestamp: string;
}

export default function EntryPage() {
    const params = useParams();
    const [entry, setEntry] = useState<Entry | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editedTitle, setEditedTitle] = useState('');
    const [isEditingContent, setIsEditingContent] = useState(false);
    const [editedContent, setEditedContent] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const updateTitle = async (newTitle: string) => {
        try {
            const response = await fetch(`/api/entries/${params.id}/title`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: newTitle }),
            });

            if (!response.ok) {
                throw new Error('Failed to update title');
            }

            if (entry) {
                setEntry({ ...entry, title: newTitle });
                toast.success('Title updated successfully');
            }
        } catch (error) {
            toast.error('Failed to update title');
            console.error('Error updating title:', error);
        }
    };

    const updateContent = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/entries/${params.id}/content`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: editedContent }),
            });

            if (!response.ok) {
                throw new Error('Failed to update content');
            }

            if (entry) {
                setEntry({ ...entry, content: editedContent });
                setIsEditingContent(false);
                toast.success('Content updated successfully');
            }
        } catch (error) {
            toast.error('Failed to update content');
            console.error('Error updating content:', error);
        } finally {
            setIsSaving(false);
        }
    };

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
            } catch (err) {
                setError('Failed to load entry');
            } finally {
                setLoading(false);
            }
        };

        fetchEntry();
    }, [params.id]);

    if (loading) {
        return (
            <main className="p-4 bg-white min-h-screen text-black">
                <div className="flex items-center mb-4">
                    <Link href="/catalogs" className="text-blue-500 hover:text-blue-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Entries
                    </Link>
                </div>
                <div className="text-center">Loading...</div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="p-4 bg-white min-h-screen text-black">
                <div className="flex items-center mb-4">
                    <Link href="/catalogs" className="text-blue-500 hover:text-blue-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        Back to Entries
                    </Link>
                </div>
                <div className="text-center text-red-500">{error}</div>
            </main>
        );
    }

    return (
        <main className="p-4 bg-white min-h-screen text-black">
            <Toaster position="top-center" />
            <div className="flex items-center mb-4">
                <Link href="/catalogs" className="text-blue-500 hover:text-blue-600 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Back to Entries
                </Link>
            </div>
            <article className="max-w-2xl mx-auto">
                <div className="flex items-center justify-between mb-2">
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="text-3xl font-bold border-b-2 border-blue-500 focus:outline-none"
                            onBlur={() => {
                                if (entry && editedTitle !== entry.title) {
                                    updateTitle(editedTitle);
                                }
                                setIsEditingTitle(false);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    if (entry && editedTitle !== entry.title) {
                                        updateTitle(editedTitle);
                                    }
                                    setIsEditingTitle(false);
                                }
                            }}
                            autoFocus
                        />
                    ) : (
                        <h1 className="text-3xl font-bold">{entry?.title}</h1>
                    )}
                    <button
                        onClick={() => {
                            setIsEditingTitle(true);
                            setEditedTitle(entry?.title || '');
                        }}
                        className="text-blue-500 hover:text-blue-600"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                    </button>
                </div>
                <div className="text-sm text-gray-500 mb-4">
                    {entry && new Date(entry.timestamp).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </div>
                {!isEditingContent && (
                    <div className="flex gap-4 mb-6">
                        <button
                        onClick={() => {
                            if (entry) {
                            window.location.href = `/chat/${entry.id}`;
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                        Chat
                        </button>
                        <button
                            onClick={() => setIsEditingContent(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                            Edit
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3v2a5 5 0 00-5 5h2a3 3 0 016 0h2a5 5 0 00-5-5zm0 8v2a5 5 0 01-5-5h2a3 3 0 006 0h2a5 5 0 01-5 5z" clipRule="evenodd" />
                            </svg>
                            Song
                        </button>
                    </div>
                )}
                <div className="prose max-w-none">
                    {isEditingContent ? (
                        <div className="fixed inset-0 bg-white z-50 flex flex-col">
                            <div className="flex-1 p-4">
                                <textarea
                                    value={editedContent}
                                    onChange={(e) => setEditedContent(e.target.value)}
                                    className="w-full h-full p-4 border-2 border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                />
                            </div>
                            <div className="border-t border-gray-200 p-4 bg-white">
                                <div className="max-w-2xl mx-auto flex justify-end gap-4">
                                    <button
                                        onClick={() => {
                                            setIsEditingContent(false);
                                            setEditedContent(entry?.content || '');
                                        }}
                                        className="px-6 py-2 text-gray-600 hover:text-gray-800"
                                        disabled={isSaving}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={updateContent}
                                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? (
                                            <>
                                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving...
                                            </>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="whitespace-pre-wrap">{entry?.content}</p>
                    )}
                </div>
            </article>
        </main>
    );
} 