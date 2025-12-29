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
  const fileName = file.name.toLowerCase()
  
  const isValidType = ALLOWED_TYPES.includes(fileType) || 
    fileName.match(/\.(jpg|jpeg|png|gif|webp|heic|heif|bmp|tiff)$/i)
  
  if (!isValidType) {
    throw new Error('Ugyldig filtype. Bruk JPG, PNG, GIF, WebP, HEIC eller BMP.')
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Fila er for stor. Maks 10MB.')
  }

  // Check for token
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('BLOB_READ_WRITE_TOKEN is not set')
    throw new Error('Bildeopplasting er ikkje konfigurert. Kontakt admin.')
  }

  // Create unique filename
  const timestamp = Date.now()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filename = `peaks/${userId}_${peakId}_${timestamp}.${ext}`

  try {
    // Convert File to Buffer for server-side upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Vercel Blob with explicit token
    const blob = await put(filename, buffer, {
      access: 'public',
      addRandomSuffix: false,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      contentType: file.type || 'image/jpeg',
    })

    console.log('Blob upload success:', blob.url)
    return blob.url
  } catch (error: any) {
    console.error('Blob upload error:', error?.message || error)
    
    // More specific error messages
    if (error?.message?.includes('token')) {
      throw new Error('Bildeopplasting er ikkje konfigurert. Kontakt admin.')
    }
    if (error?.message?.includes('size')) {
      throw new Error('Fila er for stor.')
    }
    
    throw new Error('Kunne ikkje laste opp bilete. Prøv igjen.')
  }
}
