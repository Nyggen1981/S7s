import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminToken } from '@/lib/admin-auth'
import { emailTemplates } from '@/lib/email'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json(emailTemplates)
  } catch (error) {
    console.error('Get email templates error:', error)
    return NextResponse.json({ error: 'Noko gjekk galt' }, { status: 500 })
  }
}


