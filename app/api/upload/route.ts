import { NextRequest, NextResponse } from 'next/server';

// Note: This is for local development only
// On Vercel, file uploads are not supported due to read-only filesystem
// Use URL mode instead or implement cloud storage (S3, Cloudinary, etc.)

export async function POST(request: NextRequest) {
  // Check if running on Vercel
  if (process.env.VERCEL) {
    return NextResponse.json(
      { 
        error: 'File upload není na produkci dostupný. Prosím použijte URL mode (vkládání odkazů na obrázky).',
        hint: 'Pokud potřebujete upload, nastavte cloud storage (AWS S3, Cloudinary apod.)'
      },
      { status: 503 }
    );
  }

  // Local development only
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'Žádné soubory' },
        { status: 400 }
      );
    }

    // Just return mock URLs for local testing
    const uploadedUrls: string[] = files
      .filter(file => file.type.startsWith('image/'))
      .map((file, idx) => `/uploads/mock-${idx}-${file.name}`);

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
