import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const adminCount = await prisma.admin.count()
    const peakCount = await prisma.peak.count()
    const userCount = await prisma.user.count()
    
    // Get admin emails (without passwords)
    const admins = await prisma.admin.findMany({
      select: { email: true, name: true }
    })
    
    return NextResponse.json({
      status: 'OK',
      database: 'Connected',
      counts: {
        admins: adminCount,
        peaks: peakCount,
        users: userCount
      },
      adminEmails: admins.map(a => a.email),
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'ERROR',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

