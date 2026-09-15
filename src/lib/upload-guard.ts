import path from 'path';
import fs from 'fs/promises';

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB limit

const DANGEROUS_EXTENSIONS = new Set([
  '.exe', '.dll', '.bat', '.cmd', '.sh', '.msi', '.vbs', '.jar', '.apk', '.scr', '.ps1', '.com', '.gadget', '.application',
]);

export interface UploadValidationResult {
  valid: boolean;
  error?: string;
  filename?: string;
  savedPath?: string;
  sizeBytes?: number;
}

export function isExecutableExtension(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return DANGEROUS_EXTENSIONS.has(ext);
}

export async function validateAndSaveUpload(
  fileBuffer: Buffer,
  originalFilename: string,
  mimeType: string
): Promise<UploadValidationResult> {
  // 1. File size check
  if (fileBuffer.length > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: 'File size exceeds maximum allowed limit of 10MB.' };
  }

  // 2. Extension check
  if (isExecutableExtension(originalFilename)) {
    return { valid: false, error: 'Executable files (.exe, .dll, .sh, .bat) are strictly forbidden for security reasons.' };
  }

  // 3. ZIP Bomb & Inspection Check
  const ext = path.extname(originalFilename).toLowerCase();
  if (ext === '.zip') {
    // Check ZIP header magic bytes: PK\x03\x04
    if (fileBuffer.length < 4 || fileBuffer[0] !== 0x50 || fileBuffer[1] !== 0x4b) {
      return { valid: false, error: 'Invalid ZIP file header detected.' };
    }

    // Heuristic zip-bomb protection: count PK headers (files in zip)
    let pkCount = 0;
    for (let i = 0; i < fileBuffer.length - 4; i++) {
      if (fileBuffer[i] === 0x50 && fileBuffer[i + 1] === 0x4b && fileBuffer[i + 2] === 0x03 && fileBuffer[i + 3] === 0x04) {
        pkCount++;
      }
    }
    if (pkCount > 250) {
      return { valid: false, error: 'ZIP file contains too many individual files (max 250 files allowed).' };
    }
  }

  // 4. Save file securely to public/uploads
  try {
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const fullPath = path.join(uploadDir, safeName);

    await fs.writeFile(fullPath, fileBuffer);

    return {
      valid: true,
      filename: originalFilename,
      savedPath: `/uploads/${safeName}`,
      sizeBytes: fileBuffer.length,
    };
  } catch (err) {
    return { valid: false, error: `Failed to store file: ${(err as Error).message}` };
  }
}
