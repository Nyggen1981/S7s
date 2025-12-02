import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { userId, approved } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        hasPaid: approved,
        paidAt: approved ? new Date() : null,
      }
    })

    return NextResponse.json({ 
      success: true, 
      user,
      message: approved ? 'Betaling godkjent' : 'Betaling avvist'
    })
  } catch (error) {
    console.error('Error updating payment status:', error)
    return NextResponse.json(
      { error: 'Failed to update payment status' },
      { status: 500 }
    )
  }
}



