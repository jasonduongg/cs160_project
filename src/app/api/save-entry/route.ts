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

        //TODO: connect reagent to give vibes and color hex
        const vibes = [""];
        const randomHex = Math.floor(Math.random() * 0xffffff).toString(16);
        const colorHex = `#${randomHex.padStart(6, '0')}`;

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