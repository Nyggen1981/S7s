import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminToken()

    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    if (!data.users || !Array.isArray(data.users)) {
      return NextResponse.json({ error: 'Ugyldig dataformat' }, { status: 400 })
    }

    let importedUsers = 0
    let importedSubmissions = 0
    let skippedUsers = 0

    for (const userData of data.users) {
      try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: userData.email }
        })

        if (existingUser) {
          skippedUsers++
          continue
        }

        // Create user
        const user = await prisma.user.create({
          data: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            password: userData.password || 'IMPORTED_NO_PASSWORD',
            phone: userData.phone,
            tshirtSize: userData.tshirtSize,
            hasPaid: userData.hasPaid || false,
            paidAt: userData.paidAt ? new Date(userData.paidAt) : null,
            completedAt: userData.completedAt ? new Date(userData.completedAt) : null,
            createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
          }
        })
        importedUsers++

        // Import submissions if present
        if (userData.submissions && Array.isArray(userData.submissions)) {
          for (const sub of userData.submissions) {
            try {
              await prisma.submission.create({
                data: {
                  id: sub.id,
                  userId: user.id,
                  peakId: sub.peakId,
                  imagePath: sub.imagePath,
                  notes: sub.notes,
                  latitude: sub.latitude,
                  longitude: sub.longitude,
                  submittedAt: sub.submittedAt ? new Date(sub.submittedAt) : new Date(),
                }
              })
              importedSubmissions++
            } catch (subError) {
              console.error('Error importing submission:', subError)
            }
          }
        }
      } catch (userError) {
        console.error('Error importing user:', userError)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Import fullført!`,
      stats: {
        importedUsers,
        importedSubmissions,
        skippedUsers
      }
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'Noko gjekk galt ved import' },
      { status: 500 }
    )
  }
}


