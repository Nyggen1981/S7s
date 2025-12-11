import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAdminToken } from '@/lib/admin-auth'
import * as XLSX from 'xlsx'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const admin = await verifyAdminToken()

    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Fetch all users with their submissions
    const users = await prisma.user.findMany({
      include: {
        submissions: {
          include: {
            peak: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Fetch all peaks for column headers
    const peaks = await prisma.peak.findMany({
      orderBy: { order: 'asc' }
    })

    // Create Excel data
    const excelData = users.map(user => {
      const row: any = {
        'Navn': user.name,
        'E-post': user.email,
        'Telefon': user.phone,
        'T-skjorte': user.tshirtSize,
        'Betaling': user.hasPaid ? 'Betalt' : 'Ikkje betalt',
        'Betalt dato': user.paidAt ? new Date(user.paidAt).toLocaleDateString('nb-NO') : '-',
        'Registrert': new Date(user.createdAt).toLocaleDateString('nb-NO'),
        'Antall fullførte': user.submissions.length,
        'Status': user.completedAt ? 'Fullført' : 'I gang',
        'Fullført dato': user.completedAt ? new Date(user.completedAt).toLocaleDateString('nb-NO') : '-'
      }

      // Add column for each peak
      peaks.forEach(peak => {
        const submission = user.submissions.find(s => s.peakId === peak.id)
        row[peak.name] = submission ? new Date(submission.submittedAt).toLocaleDateString('nb-NO') : '-'
      })

      return row
    })

    // Create workbook
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(excelData)

    // Auto-size columns
    const maxWidth = 20
    const columns = Object.keys(excelData[0] || {})
    worksheet['!cols'] = columns.map(() => ({ wch: maxWidth }))

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Deltakere')

    // Create detailed submissions sheet
    const submissionsData = users.flatMap(user =>
      user.submissions.map(sub => ({
        'Navn': user.name,
        'E-post': user.email,
        'Fjell': sub.peak.name,
        'Dato': new Date(sub.submittedAt).toLocaleDateString('nb-NO'),
        'Klokkeslett': new Date(sub.submittedAt).toLocaleTimeString('nb-NO'),
        'Notat': sub.notes || '-',
      }))
    )

    if (submissionsData.length > 0) {
      const submissionsSheet = XLSX.utils.json_to_sheet(submissionsData)
      submissionsSheet['!cols'] = Object.keys(submissionsData[0]).map(() => ({ wch: maxWidth }))
      XLSX.utils.book_append_sheet(workbook, submissionsSheet, 'Bestigninger')
    }

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    // Return as file download
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="sauda-seven-summits-${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    })
  } catch (error) {
    console.error('Error exporting data:', error)
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    )
  }
}



