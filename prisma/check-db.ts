import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const peakCount = await prisma.peak.count()
  const userCount = await prisma.user.count()
  const adminCount = await prisma.admin.count()
  
  console.log('Database status:')
  console.log(`  Peaks: ${peakCount}`)
  console.log(`  Users: ${userCount}`)
  console.log(`  Admins: ${adminCount}`)
}

main()
  .finally(() => prisma.$disconnect())

