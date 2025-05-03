import { NextResponse } from 'next/server';

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

async function getSpotifyToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
        },
        body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    return data.access_token;
}

export async function POST(request: Request) {
    try {
        const { trackUrl } = await request.json();
        
        // Extract track ID from URL
        const trackId = trackUrl.split('/').pop()?.split('?')[0];
        if (!trackId) {
            return NextResponse.json({ error: 'Invalid Spotify URL' }, { status: 400 });
        }

        const token = await getSpotifyToken();
        const response = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch track' }, { status: response.status });
        }

        const trackData = await response.json();
        
        // Get the highest quality image
        const image = trackData.album.images.reduce((prev: any, current: any) => 
            (prev.height > current.height) ? prev : current
        ).url;
        
        return NextResponse.json({
            id: trackData.id,
            name: trackData.name,
            artist: trackData.artists[0].name,
            album: trackData.album.name,
            image: image,
            preview_url: trackData.preview_url || null,
            external_url: trackData.external_urls.spotify
        });
    } catch (error) {
        console.error('Spotify API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 