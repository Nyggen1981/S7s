import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function DELETE(request: NextRequest) {
  try {
    const admin = await verifyAdminToken()
    
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Slett brukaren (Cascade vil automatisk slette submissions)
    await prisma.user.delete({
      where: { id: userId }
    })

    return NextResponse.json({ 
      success: true,
      message: 'Brukar sletta' 
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
}


