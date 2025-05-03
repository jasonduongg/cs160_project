'use client';

import { useEffect, useState } from 'react';

interface Track {
  name: string;
  artists: Array<{
    name: string;
  }>;
  id: string;
  album: {
    images: Array<{
      url: string;
    }>;
  };
}

async function fetchWebApi(endpoint: string, method: string, body?: any) {
  const token = process.env.NEXT_PUBLIC_SPOTIFY_TOKEN;
  if (!token) {
    throw new Error('Spotify token not configured');
  }

  const res = await fetch(`https://api.spotify.com/${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method,
    body: body ? JSON.stringify(body) : undefined,
  });
  return await res.json();
}

async function getTopTracks(): Promise<Track[]> {
  try {
    const response = await fetchWebApi(
      'v1/me/top/tracks?time_range=long_term&limit=5',
      'GET'
    );
    return response.items;
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    return [];
  }
}

export default function SpotifyTopTracks() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const topTracks = await getTopTracks();
        setTracks(topTracks);
        setError(null);
      } catch (err) {
        setError('Failed to fetch top tracks');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading top tracks...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  if (tracks.length === 0) {
    return <div className="text-sm text-gray-500">No tracks found</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Your Top Tracks</h3>
      <div className="space-y-3">
        {tracks.map((track) => (
          <div key={track.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
            {track.album.images[0] && (
              <img
                src={track.album.images[0].url}
                alt={track.name}
                className="w-12 h-12 rounded"
              />
            )}
            <div>
              <p className="font-medium">{track.name}</p>
              <p className="text-sm text-gray-600">
                {track.artists.map(artist => artist.name).join(', ')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 