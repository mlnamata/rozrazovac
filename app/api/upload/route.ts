import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Žádné soubory' },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate file
      if (!file.type.startsWith('image/')) {
        continue; // Skip non-image files
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(7);
      const ext = file.name.split('.').pop();
      const filename = `img_${timestamp}_${random}.${ext}`;

      // Save to public/uploads folder
      try {
        const uploadsDir = join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadsDir, { recursive: true });
        const filepath = join(uploadsDir, filename);
        await writeFile(filepath, buffer);

        uploadedUrls.push(`/uploads/${filename}`);
      } catch (err) {
        console.error('Failed to save file:', err);
      }
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { error: 'Selhalo nahrání souborů' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls,
    });
  } catch (err) {
    console.error('Upload error:', err);
    return NextResponse.json(
      { error: 'Chyba při nahrávání' },
      { status: 500 }
    );
  }
}
