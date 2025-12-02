import { createClient } from '@supabase/supabase-js'

// Create Supabase client for server-side
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function saveUploadedImage(file: File, userId: string, peakId: string): Promise<string> {
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  // Create unique filename
  const timestamp = Date.now()
  const ext = file.name.split('.').pop() || 'jpg'
  const filename = `${userId}_${peakId}_${timestamp}.${ext}`
  const filepath = `peak-images/${filename}`

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from('uploads')
    .upload(filepath, buffer, {
      contentType: file.type,
      upsert: false
    })

  if (error) {
    console.error('Supabase upload error:', error)
    throw new Error('Kunne ikkje laste opp bilete')
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('uploads')
    .getPublicUrl(filepath)

  return urlData.publicUrl
}
