import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface Entry {
    id: string;
    title: string;
    content: string;
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
        const { title, content } = await request.json();
        const filePath = path.join(process.cwd(), 'public', 'database', 'text.json');

        // Read existing entries
        let entries: Entries = { entries: [] };
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            entries = JSON.parse(fileContent);
        }

        // Add new entry with ID
        entries.entries.push({
            id: generateId(),
            title,
            content,
            timestamp: new Date().toISOString()
        });

        // Write back to file
        fs.writeFileSync(filePath, JSON.stringify(entries, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving entry:', error);
        return NextResponse.json({ error: 'Failed to save entry' }, { status: 500 });
    }
} 