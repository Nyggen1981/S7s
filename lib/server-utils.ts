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
  console.log('saveUploadedImage called:', {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size,
    userId,
    peakId
  })

  // Validate file type
  const fileType = file.type.toLowerCase()
  const fileName = file.name.toLowerCase()
  
  const isValidType = ALLOWED_TYPES.includes(fileType) || 
    fileName.match(/\.(jpg|jpeg|png|gif|webp|heic|heif|bmp|tiff)$/i)
  
  if (!isValidType) {
    console.error('Invalid file type:', fileType, fileName)
    throw new Error('Ugyldig filtype. Bruk JPG, PNG, GIF, WebP, HEIC eller BMP.')
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    console.error('File too large:', file.size)
    throw new Error('Fila er for stor. Maks 10MB.')
  }

  // Check for token
  const token = process.env.BLOB_READ_WRITE_TOKEN
  if (!token) {
    console.error('BLOB_READ_WRITE_TOKEN is not set')
    throw new Error('Bildeopplasting er ikkje konfigurert. Kontakt admin.')
  }
  
  console.log('Token exists, length:', token.length)

  // Create unique filename
  const timestamp = Date.now()
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filename = `peaks/${userId}_${peakId}_${timestamp}.${ext}`
  
  console.log('Uploading to:', filename)

  try {
    // Convert File to Buffer for server-side upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    console.log('Buffer created, size:', buffer.length)

    // Upload to Vercel Blob with explicit token
    const blob = await put(filename, buffer, {
      access: 'public',
      addRandomSuffix: true, // Changed to true to avoid conflicts
      token: token,
      contentType: file.type || 'image/jpeg',
    })

    console.log('Blob upload success:', blob.url)
    return blob.url
  } catch (error: any) {
    console.error('Blob upload error details:', {
      message: error?.message,
      code: error?.code,
      status: error?.status,
      stack: error?.stack
    })
    
    // More specific error messages
    if (error?.message?.includes('token') || error?.message?.includes('unauthorized')) {
      throw new Error('Bildeopplasting er ikkje konfigurert. Kontakt admin.')
    }
    if (error?.message?.includes('size') || error?.message?.includes('too large')) {
      throw new Error('Fila er for stor.')
    }
    if (error?.message?.includes('store') || error?.message?.includes('not found')) {
      throw new Error('Blob storage ikkje funne. Kontakt admin.')
    }
    
    throw new Error(`Opplasting feila: ${error?.message || 'Ukjent feil'}`)
  }
}
