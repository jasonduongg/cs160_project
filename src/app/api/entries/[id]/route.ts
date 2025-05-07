import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function DELETE(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const dataPath = path.join(process.cwd(), 'public', 'database', 'text.json');

        // Read the current data
        const data = JSON.parse(await fs.readFile(dataPath, 'utf-8'));

        // Find the entry index
        const entryIndex = data.entries.findIndex((entry: any) => entry.id === id);

        if (entryIndex === -1) {
            return NextResponse.json(
                { error: 'Entry not found' },
                { status: 404 }
            );
        }

        // Remove the entry
        data.entries.splice(entryIndex, 1);

        // Write the updated data back to the file
        await fs.writeFile(dataPath, JSON.stringify(data, null, 2));

        return NextResponse.json(
            { message: 'Entry deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting entry:', error);
        return NextResponse.json(
            { error: 'Failed to delete entry' },
            { status: 500 }
        );
    }
} 