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

    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { email }
    })

    if (!admin) {
      // Don't reveal if admin exists for security
      return NextResponse.json({
        success: true,
        message: 'Hvis denne e-postadressen eksisterer, vil du motta e-post med nytt passord.'
      })
    }

    // Generate new random password
    const newPassword = crypto.randomBytes(12).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 12) + '!A1'
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update admin password
    await prisma.admin.update({
      where: { id: admin.id },
      data: { password: hashedPassword }
    })

    // Send password reset email
    try {
      await sendPasswordResetEmail(admin.email, newPassword, true)
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError)
      // Still return success to not reveal if email failed
    }

    return NextResponse.json({
      success: true,
      message: 'Hvis denne e-postadressen eksisterer, vil du motta e-post med nytt passord.'
    })
  } catch (error) {
    console.error('Admin forgot password error:', error)
    return NextResponse.json(
      { error: 'Noko gjekk galt' },
      { status: 500 }
    )
  }
}



