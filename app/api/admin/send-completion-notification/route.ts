import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendCompletionEmail } from '@/lib/email'
import { jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret')

async function verifyAdmin() {
  const cookieStore = cookies()
  const token = cookieStore.get('admin-token')?.value

  if (!token) return false

  try {
    const { payload } = await jwtVerify(token, secret)
    return payload.role === 'admin'
  } catch {
    return false
  }
}

// POST - Send completion notification for a specific user
export async function POST(request: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: 'userId er påkrevd' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        submissions: true
      }
    })

    if (!user) {
      return NextResponse.json({ error: 'Brukar ikkje funne' }, { status: 404 })
    }

    const totalPeaks = await prisma.peak.count()

    if (user.submissions.length < totalPeaks) {
      return NextResponse.json({ 
        error: `Brukaren har berre ${user.submissions.length}/${totalPeaks} toppar` 
      }, { status: 400 })
    }

    const success = await sendCompletionEmail(user.name, user.email)

    if (success) {
      return NextResponse.json({ 
        success: true, 
        message: `Fullføringsvarsel sendt til admin for ${user.name}` 
      })
    } else {
      return NextResponse.json({ 
        error: 'Kunne ikkje sende e-post. Sjekk SMTP-innstillingar.' 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Send completion notification error:', error)
    return NextResponse.json({ error: 'Noko gjekk galt' }, { status: 500 })
  }
}

// GET - Get all users who completed but might not have had notification sent
export async function GET(request: NextRequest) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const totalPeaks = await prisma.peak.count()

    const completedUsers = await prisma.user.findMany({
      where: {
        completedAt: { not: null }
      },
      select: {
        id: true,
        name: true,
        email: true,
        completedAt: true,
        _count: {
          select: { submissions: true }
        }
      },
      orderBy: {
        completedAt: 'desc'
      }
    })

    return NextResponse.json({
      totalPeaks,
      completedUsers: completedUsers.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        completedAt: u.completedAt,
        submissionCount: u._count.submissions
      }))
    })
  } catch (error) {
    console.error('Get completed users error:', error)
    return NextResponse.json({ error: 'Noko gjekk galt' }, { status: 500 })
  }
}



