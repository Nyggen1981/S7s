import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function saveUploadedImage(file: File, userId: string, peakId: string): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Create unique filename
  const timestamp = Date.now()
  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `${userId}_${peakId}_${timestamp}.${ext}`
  
  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(uploadsDir, { recursive: true })
  
  // Save file to local filesystem
  const filepath = path.join(uploadsDir, filename)
  await writeFile(filepath, buffer)

  // Return public URL path
  return `/uploads/${filename}`
}
