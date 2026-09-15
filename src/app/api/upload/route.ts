import { NextResponse } from 'next/server';
import { validateAndSaveUpload } from '@/lib/upload-guard';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await validateAndSaveUpload(buffer, file.name, file.type);

    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      message: 'File uploaded safely.',
      filename: result.filename,
      savedPath: result.savedPath,
      sizeBytes: result.sizeBytes,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
