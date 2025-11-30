import fs from 'fs'
import path from 'path'

export async function saveUploadedImage(file: File, userId: string, peakId: string): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Create unique filename
  const timestamp = Date.now()
  const ext = path.extname(file.name)
  const filename = `${userId}_${peakId}_${timestamp}${ext}`
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true })
  }

  const filepath = path.join(uploadsDir, filename)
  fs.writeFileSync(filepath, buffer)

  return `/uploads/${filename}`
}




