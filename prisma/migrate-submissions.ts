import { PrismaClient } from '@prisma/client'

const supabase = new PrismaClient({
  datasources: { db: { url: 'postgresql://postgres.rsuqmxbywyogveopkuzo:L3n0v02025!@aws-1-eu-west-1.pooler.supabase.com:5432/postgres' } }
})

const neon = new PrismaClient()

async function main() {
  console.log('🚀 Migrating submissions...\n')

  // Get peaks from both databases to create ID mapping
  const supabasePeaks = await supabase.peak.findMany()
  const neonPeaks = await neon.peak.findMany()

  // Create mapping: Supabase peak ID -> Neon peak ID (by name)
  const peakIdMap = new Map<string, string>()
  for (const sPeak of supabasePeaks) {
    const nPeak = neonPeaks.find(p => p.name === sPeak.name)
    if (nPeak) {
      peakIdMap.set(sPeak.id, nPeak.id)
      console.log(`📍 Mapped: ${sPeak.name} (${sPeak.id} -> ${nPeak.id})`)
    }
  }

  // Get all submissions from Supabase
  const submissions = await supabase.submission.findMany({
    include: { user: true, peak: true }
  })
  console.log(`\n📥 Found ${submissions.length} submissions in Supabase`)

  let migrated = 0
  let skipped = 0

  for (const sub of submissions) {
    const newPeakId = peakIdMap.get(sub.peakId)
    
    if (!newPeakId) {
      console.log(`   ❌ No mapping for peak ${sub.peakId}`)
      continue
    }

    // Check if user exists in Neon
    const userExists = await neon.user.findUnique({ where: { id: sub.userId } })
    if (!userExists) {
      console.log(`   ❌ User ${sub.userId} not found in Neon`)
      continue
    }

    // Check if submission already exists
    const existing = await neon.submission.findUnique({
      where: { userId_peakId: { userId: sub.userId, peakId: newPeakId } }
    })

    if (existing) {
      console.log(`   ⏭️  Submission for ${sub.user.name} - ${sub.peak.name} already exists`)
      skipped++
      continue
    }

    try {
      await neon.submission.create({
        data: {
          userId: sub.userId,
          peakId: newPeakId,
          imagePath: sub.imagePath,
          submittedAt: sub.submittedAt,
          latitude: sub.latitude,
          longitude: sub.longitude,
          notes: sub.notes
        }
      })
      console.log(`   ✅ Migrated: ${sub.user.name} - ${sub.peak.name}`)
      migrated++
    } catch (error) {
      console.log(`   ❌ Error:`, error)
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log('🎉 Submission migration completed!')
  console.log(`   Migrated: ${migrated}`)
  console.log(`   Skipped: ${skipped}`)
  console.log('='.repeat(50))
}

main()
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1) })




