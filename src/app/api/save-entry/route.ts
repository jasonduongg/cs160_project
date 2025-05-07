import { NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

interface Entry {
    id: string;
    title: string;
    content: string;
    vibes: string[];
    colorHex: string;

    imagePath?: string;
    spotifyTrack?: {
        id: string;
        name: string;
        artist: string;
        album: string;
        image: string;
        preview_url: string;
    };
    timestamp: string;
}

interface Entries {
    entries: Entry[];
}

function generateId(): string {
    return Math.random().toString(36).substring(2, 15);
}

export async function POST(request: Request) {
    try {
        const { title, content, imagePath, spotifyTrack } = await request.json();

        // Read existing entries
        const filePath = join(process.cwd(), 'public', 'database', 'text.json');
        const fileContent = await readFile(filePath, 'utf-8');
        const entries = JSON.parse(fileContent);

        var song_name = "null";
        var artist_name = "null";
        if (spotifyTrack != null) {
            song_name = spotifyTrack["name"];
            artist_name = spotifyTrack["artist"];
        }
        const response = await fetch(
            'https://noggin.rea.gent/innovative-kingfisher-4387',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer rg_v1_oxioypc0z1nx1jajr6agdggjoniwh6r0c9d3_ngk',
              },
              body: JSON.stringify({
                // fill variables here.
                "entry_text": content,
                "song_name": song_name,
                "artist_name": artist_name,
              }),
            }
          ).then(response => response.text());

        var responseJSON = JSON.parse(response);
        responseJSON["vibes"] = responseJSON["vibes"].replace(/\s+/g, '');
        const vibes = responseJSON["vibes"].split(",");
        const randomHex = Math.floor(Math.random() * 0xffffff).toString(16);
        const colorHex = responseJSON["color"];

        // Add new entry
        entries.entries.push({
            id: generateId(),
            title,
            content,
            vibes,
            colorHex,
            imagePath: imagePath || null,
            spotifyTrack: spotifyTrack || null,
            timestamp: new Date().toISOString()
        });

        // Save updated entries
        await writeFile(filePath, JSON.stringify(entries, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving entry:', error);
        return NextResponse.json(
            { error: 'Error saving entry' },
            { status: 500 }
        );
    }
} 