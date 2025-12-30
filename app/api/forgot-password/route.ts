import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'E-postadresse er påkrevd' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      // Don't reveal if user exists for security
      return NextResponse.json({
        success: true,
        message: 'Hvis denne e-postadressen eksisterer, vil du motta e-post med nytt passord.'
      })
    }

    // Generate new random password
    const newPassword = crypto.randomBytes(12).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 12) + '!A1'
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    // Send password reset email
    try {
      await sendPasswordResetEmail(user.email, newPassword, false)
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError)
      // Still return success to not reveal if email failed
    }

    return NextResponse.json({
      success: true,
      message: 'Hvis denne e-postadressen eksisterer, vil du motta e-post med nytt passord.'
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Noko gjekk galt' },
      { status: 500 }
    )
  }
}


