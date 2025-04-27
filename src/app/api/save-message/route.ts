import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const { message, title } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        // Create data object
        const data = {
            title,
            message,
            timestamp: new Date().toISOString()
        };

        // Define the path to text.json in public/database
        const filePath = path.join(process.cwd(), 'public', 'database', 'text.json');

        // Ensure the database directory exists
        const dirPath = path.join(process.cwd(), 'public', 'database');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // Read existing data if file exists
        let existingData = [];
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            existingData = JSON.parse(fileContent);
        }

        // Add new data
        existingData.push(data);

        // Write back to file
        fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving message:', error);
        return NextResponse.json({ error: 'Failed to save message' }, { status: 500 });
    }
} 