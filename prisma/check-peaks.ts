import { PrismaClient } from '@prisma/client'

const supabase = new PrismaClient({
  datasources: { db: { url: 'postgresql://postgres.rsuqmxbywyogveopkuzo:L3n0v02025!@aws-1-eu-west-1.pooler.supabase.com:5432/postgres' } }
})

const neon = new PrismaClient()

async function main() {
  const supabasePeaks = await supabase.peak.findMany({ orderBy: { order: 'asc' } })
  const neonPeaks = await neon.peak.findMany({ orderBy: { order: 'asc' } })
  
  console.log('Supabase peaks:')
  supabasePeaks.forEach(p => console.log('  ', p.order, p.name, p.id))
  
  console.log('\nNeon peaks:')
  neonPeaks.forEach(p => console.log('  ', p.order, p.name, p.id))

  // Get submissions from Supabase
  const submissions = await supabase.submission.findMany()
  console.log('\nSupabase submissions:')
  submissions.forEach(s => console.log('  ', s.peakId))
}

main().then(() => process.exit(0))




