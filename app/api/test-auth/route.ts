import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    console.log('Test auth for:', email)
    
    // Find admin
    const admin = await prisma.admin.findUnique({
      where: { email }
    })
    
    if (!admin) {
      return NextResponse.json({
        status: 'FAIL',
        reason: 'Admin not found',
        email
      })
    }
    
    // Check password
    const isValid = await bcrypt.compare(password, admin.password)
    
    return NextResponse.json({
      status: isValid ? 'SUCCESS' : 'FAIL',
      reason: isValid ? 'Password correct' : 'Password incorrect',
      email,
      adminExists: true,
      passwordHashLength: admin.password.length
    })
  } catch (error: any) {
    return NextResponse.json({
      status: 'ERROR',
      error: error.message
    }, { status: 500 })
  }
}


