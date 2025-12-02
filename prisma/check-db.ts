import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const peakCount = await prisma.peak.count()
  const userCount = await prisma.user.count()
  const admins = await prisma.admin.findMany()
  
  console.log('Database status:')
  console.log(`  Peaks: ${peakCount}`)
  console.log(`  Users: ${userCount}`)
  console.log(`  Admins: ${admins.length}`)
  console.log('')
  console.log('Admin users:')
  admins.forEach(a => {
    console.log(`  - ${a.email} (has password: ${!!a.password})`)
  })
}

main()
  .finally(() => prisma.$disconnect())


