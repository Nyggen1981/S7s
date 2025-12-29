import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

// GET - Fetch current settings
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get or create settings
    let settings = await prisma.adminSettings.findUnique({
      where: { id: 'settings' }
    })

    if (!settings) {
      settings = await prisma.adminSettings.create({
        data: {
          id: 'settings',
          notifyNewUser: true,
          notifyPeakSubmission: false,
          notifyAllPeaksCompleted: true,
        }
      })
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Get settings error:', error)
    return NextResponse.json({ error: 'Noko gjekk galt' }, { status: 500 })
  }
}

// PUT - Update settings
export async function PUT(request: NextRequest) {
  try {
    const admin = await verifyAdminToken()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { notifyNewUser, notifyPeakSubmission, notifyAllPeaksCompleted } = body

    const settings = await prisma.adminSettings.upsert({
      where: { id: 'settings' },
      update: {
        notifyNewUser: notifyNewUser ?? undefined,
        notifyPeakSubmission: notifyPeakSubmission ?? undefined,
        notifyAllPeaksCompleted: notifyAllPeaksCompleted ?? undefined,
      },
      create: {
        id: 'settings',
        notifyNewUser: notifyNewUser ?? true,
        notifyPeakSubmission: notifyPeakSubmission ?? false,
        notifyAllPeaksCompleted: notifyAllPeaksCompleted ?? true,
      }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json({ error: 'Noko gjekk galt' }, { status: 500 })
  }
}

