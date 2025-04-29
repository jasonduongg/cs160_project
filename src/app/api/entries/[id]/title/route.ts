import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { title } = await request.json();
        const filePath = path.join(process.cwd(), 'public', 'database', 'text.json');

        // Read the current data
        const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));

        // Find and update the entry
        const entryIndex = data.entries.findIndex((entry: any) => entry.id === params.id);
        if (entryIndex === -1) {
            return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
        }

        // Update the title
        data.entries[entryIndex].title = title;

        // Write back to file
        await fs.writeFile(filePath, JSON.stringify(data, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error updating title:', error);
        return NextResponse.json({ error: 'Failed to update title' }, { status: 500 });
    }
} 