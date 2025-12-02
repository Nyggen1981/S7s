import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name, phone, tshirtSize } = body

    // Validation
    if (!email || !name || !phone || !tshirtSize) {
      return NextResponse.json(
        { error: 'Alle felt må fylles ut' },
        { status: 400 }
      )
    }

    // Update user
    const user = await prisma.user.update({
      where: { email },
      data: {
        name,
        phone,
        tshirtSize,
      }
    })

    return NextResponse.json({ 
      success: true, 
      user,
      message: 'Profil oppdatert!' 
    })
  } catch (error) {
    console.error('Update error:', error)
    return NextResponse.json(
      { error: 'Kunne ikkje oppdatere profil' },
      { status: 500 }
    )
  }
}





