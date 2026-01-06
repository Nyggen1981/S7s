import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { saveUploadedImage } from '@/lib/server-utils'
import { sendCompletionEmail, sendPeakSubmissionNotification } from '@/lib/email'

// Runtime config for Vercel
export const runtime = 'nodejs'
export const maxDuration = 30 // 30 seconds timeout for larger uploads

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
    if (!userId || !peakId) {
      return NextResponse.json(
        { error: 'Brukar ID og fjell ID er påkrevd' },
        { status: 400 }
      )
    }

    if (!image || !(image instanceof File) || image.size === 0) {
      return NextResponse.json(
        { error: 'Bilete er påkrevd. Vel eit bilete frå galleriet eller ta eit nytt.' },
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
    let imagePath: string
    try {
      imagePath = await saveUploadedImage(image, userId, peakId)
    } catch (uploadError: any) {
      console.error('Image upload failed:', uploadError)
      return NextResponse.json(
        { error: uploadError.message || 'Kunne ikkje laste opp bilete' },
        { status: 400 }
      )
    }

    // Create submission with custom date if provided
    // Parse YYYY-MM-DD as local date to avoid timezone shift
    let submissionDate: Date
    if (submittedDate) {
      const [year, month, day] = submittedDate.split('-').map(Number)
      submissionDate = new Date(year, month - 1, day, 12, 0, 0) // Set to noon to avoid date boundary issues
    } else {
      submissionDate = new Date()
    }
    
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
    
    console.log(`Peak submission complete. User ${userId}: ${userSubmissionsCount}/${totalPeaks} peaks`)

    // Get user and peak info for notifications
    const user = await prisma.user.findUnique({ where: { id: userId } })
    const peak = await prisma.peak.findUnique({ where: { id: peakId } })

    // Send peak submission notification (if enabled) - don't await, not critical
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
      console.log(`🎉 User ${user.name} completed ALL ${totalPeaks} peaks! Sending completion email...`)
      
      await prisma.user.update({
        where: { id: userId },
        data: { completedAt: new Date() }
      })

      // MUST await completion email - otherwise Vercel kills the function before it sends
      try {
        const emailSent = await sendCompletionEmail(user.name, user.email)
        console.log('Completion email result:', emailSent)
      } catch (err) {
        console.error('Failed to send completion email:', err)
      }
    } else {
      console.log(`User has ${userSubmissionsCount}/${totalPeaks} - not complete yet`)
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

