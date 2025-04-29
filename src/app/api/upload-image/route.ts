import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('image') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No image file provided' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const uniqueId = uuidv4();
        const fileExtension = file.name.split('.').pop();
        const fileName = `${uniqueId}.${fileExtension}`;

        // Save to public/database/images
        const path = join(process.cwd(), 'public', 'database', 'images', fileName);
        await writeFile(path, buffer);

        // Return the relative path that can be used in the frontend
        const imagePath = `/database/images/${fileName}`;

        return NextResponse.json({ imagePath });
    } catch (error) {
        console.error('Error uploading image:', error);
        return NextResponse.json(
            { error: 'Error uploading image' },
            { status: 500 }
        );
    }
} 