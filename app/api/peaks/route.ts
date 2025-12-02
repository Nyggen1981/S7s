import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const peaks = await prisma.peak.findMany({
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json(peaks)
  } catch (error) {
    console.error('Error fetching peaks:', error)
    return NextResponse.json(
      { error: 'Kunne ikkje hente fjell' },
      { status: 500 }
    )
  }
}





