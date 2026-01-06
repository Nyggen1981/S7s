import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { saveUploadedImage } from '@/lib/server-utils'

// Runtime config for Vercel
export const runtime = 'nodejs'
export const maxDuration = 30 // 30 seconds for image uploads

export async function PUT(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    
    let submissionId: string
    let userId: string
    let newDate: string | null = null
    let newNotes: string | null = null
    let newImage: File | null = null

    // Handle both JSON and FormData
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      submissionId = formData.get('submissionId') as string
      userId = formData.get('userId') as string
      newDate = formData.get('newDate') as string | null
      newNotes = formData.get('newNotes') as string | null
      const imageFile = formData.get('newImage')
      if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        newImage = imageFile
      }
    } else {
      const body = await request.json()
      submissionId = body.submissionId
      userId = body.userId
      newDate = body.newDate
      newNotes = body.newNotes
    }

    // Validation
    if (!submissionId || !userId) {
      return NextResponse.json(
        { error: 'Submission ID og brukar ID er påkrevd' },
        { status: 400 }
      )
    }

    // Check if submission exists and belongs to user
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: { peak: true }
    })

    if (!submission) {
      return NextResponse.json(
        { error: 'Fann ikkje registreringa' },
        { status: 404 }
      )
    }

    if (submission.userId !== userId) {
      return NextResponse.json(
        { error: 'Du kan berre redigere dine eigne registreringar' },
        { status: 403 }
      )
    }

    // Build update data
    const updateData: any = {}

    // Handle date update
    if (newDate) {
      // Parse the date parts to avoid timezone issues
      // Set to noon to avoid any date boundary issues
      const [year, month, day] = newDate.split('-').map(Number)
      const dateToSet = new Date(year, month - 1, day, 12, 0, 0)
      
      if (dateToSet > new Date()) {
        return NextResponse.json(
          { error: 'Datoen kan ikkje vere i framtida' },
          { status: 400 }
        )
      }
      
      updateData.submittedAt = dateToSet
    }

    // Handle notes update (can be empty string to clear)
    if (newNotes !== null && newNotes !== undefined) {
      updateData.notes = newNotes || null
    }

    // Handle image update
    if (newImage) {
      try {
        const imagePath = await saveUploadedImage(newImage, userId, submission.peakId)
        updateData.imagePath = imagePath
      } catch (uploadError: any) {
        console.error('Image upload failed:', uploadError)
        return NextResponse.json(
          { error: uploadError.message || 'Kunne ikkje laste opp bilete' },
          { status: 400 }
        )
      }
    }

    // Only update if there's something to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'Ingen endringar å lagre' },
        { status: 400 }
      )
    }

    // Update the submission
    const updatedSubmission = await prisma.submission.update({
      where: { id: submissionId },
      data: updateData,
      include: { peak: true }
    })

    return NextResponse.json({
      success: true,
      submission: updatedSubmission,
      message: 'Registrering oppdatert!'
    })
  } catch (error) {
    console.error('Error updating submission:', error)
    return NextResponse.json(
      { error: 'Noko gjekk galt ved oppdatering' },
      { status: 500 }
    )
  }
}
