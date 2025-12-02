import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, tshirtSize } = body

    // Validation
    if (!name || !email || !phone || !tshirtSize) {
      return NextResponse.json(
        { error: 'Alle felt må fylles ut' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Denne e-postadressen er allereie registrert' },
        { status: 400 }
      )
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        tshirtSize,
      }
    })

    // Send welcome email (don't await to not slow down response)
    sendWelcomeEmail(name, email).catch(console.error)

    return NextResponse.json({ 
      success: true, 
      userId: user.id,
      message: 'Registrering vellykka!' 
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Noko gjekk galt ved registrering' },
      { status: 500 }
    )
  }
}





