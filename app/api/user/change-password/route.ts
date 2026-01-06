import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, currentPassword, newPassword } = body

    // Validation
    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Alle felt må fylles ut' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Nytt passord må vere minst 6 teikn' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Brukar ikkje funne' },
        { status: 404 }
      )
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Feil noverande passord' },
        { status: 401 }
      )
    }

    // Hash and update new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Passord oppdatert!' 
    })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: 'Kunne ikkje endre passord' },
      { status: 500 }
    )
  }
}



