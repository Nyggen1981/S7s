import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { saveUploadedImage } from '@/lib/server-utils'
import { sendCompletionEmail, sendPeakSubmissionNotification } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const userId = formData.get('userId') as string
    const peakId = formData.get('peakId') as string
    const image = formData.get('image') as File
    const notes = formData.get('notes') as string | null
    const latitude = formData.get('latitude') as string | null
    const longitude = formData.get('longitude') as string | null
    const submittedDate = formData.get('submittedDate') as string | null

    // Validation
    if (!userId || !peakId || !image) {
      return NextResponse.json(
        { error: 'Brukar ID, fjell ID og bilete er påkrevd' },
        { status: 400 }
      )
    }

    // Check if already submitted
    const existingSubmission = await prisma.submission.findUnique({
      where: {
        userId_peakId: {
          userId,
          peakId
        }
      }
    })

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'Du har allereie registrert dette fjellet' },
        { status: 400 }
      )
    }

    // Save image
    const imagePath = await saveUploadedImage(image, userId, peakId)

    // Create submission with custom date if provided
    const submissionDate = submittedDate ? new Date(submittedDate) : new Date()
    
    const submission = await prisma.submission.create({
      data: {
        userId,
        peakId,
        imagePath,
        notes: notes || undefined,
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined,
        submittedAt: submissionDate,
      }
    })

    // Check if user has completed all peaks
    const userSubmissionsCount = await prisma.submission.count({
      where: { userId }
    })

    const totalPeaks = await prisma.peak.count()

    // Get user and peak info for notifications
    const user = await prisma.user.findUnique({ where: { id: userId } })
    const peak = await prisma.peak.findUnique({ where: { id: peakId } })

    // Send peak submission notification (if enabled)
    if (user && peak) {
      sendPeakSubmissionNotification(
        user.name,
        user.email,
        peak.name,
        userSubmissionsCount,
        totalPeaks
      ).catch(console.error)
    }

    // If completed all peaks, update user and send notification
    if (userSubmissionsCount === totalPeaks && user) {
      await prisma.user.update({
        where: { id: userId },
        data: { completedAt: new Date() }
      })

      // Send completion email to admin
      sendCompletionEmail(user.name, user.email).catch(console.error)
    }

    return NextResponse.json({ 
      success: true,
      submission,
      completed: userSubmissionsCount === totalPeaks,
      message: 'Fjelltur registrert!' 
    })
  } catch (error) {
    console.error('Error submitting peak:', error)
    return NextResponse.json(
      { error: 'Noko gjekk galt ved registrering' },
      { status: 500 }
    )
  }
}

