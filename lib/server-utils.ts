import { put } from '@vercel/blob'

// Allowed image types
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/gif',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/bmp',
  'image/tiff'
]

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function saveUploadedImage(file: File, userId: string, peakId: string): Promise<string> {
  // Validate file type
  const fileType = file.type.toLowerCase()
  if (!ALLOWED_TYPES.includes(fileType) && !file.name.match(/\.(jpg|jpeg|png|gif|webp|heic|heif|bmp|tiff)$/i)) {
    throw new Error('Ugyldig filtype. Bruk JPG, PNG, GIF, WebP, HEIC eller BMP.')
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Fila er for stor. Maks 10MB.')
  }

  // Create unique filename
  const timestamp = Date.now()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filename = `peaks/${userId}_${peakId}_${timestamp}.${ext}`

  try {
    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
      addRandomSuffix: false,
    })

    return blob.url
  } catch (error) {
    console.error('Blob upload error:', error)
    throw new Error('Kunne ikkje laste opp bilete. Prøv igjen.')
  }
}
