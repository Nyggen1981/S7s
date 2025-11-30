import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@saudasevensummits.no'
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!'
  
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin',
    },
  })

  console.log('✅ Admin user created:', admin.email)

  // Delete all existing peaks first
  await prisma.peak.deleteMany({})
  console.log('🗑️  Existing peaks deleted')

  // Create the 7 peaks for Sauda Seven Summits 2025/2026
  const peaks = [
    {
      name: 'Dyrskardnuten',
      description: 'Den høgste toppen i utfordringa',
      elevation: 1371,
      order: 1,
    },
    {
      name: 'Grønnaheinuten',
      description: 'Årets lengste S7S-tur',
      elevation: 1299,
      order: 2,
    },
    {
      name: 'Hegerlandsnuten',
      description: 'Populær vårskitur',
      elevation: 1291,
      order: 3,
    },
    {
      name: 'Indrejordsnuten',
      description: 'Flott ettermiddagstur med utsikt',
      elevation: 1284,
      order: 4,
    },
    {
      name: 'Bordheia',
      description: 'Start fra Lyngmyr via Bedringens vei',
      elevation: 1125,
      order: 5,
    },
    {
      name: 'Brekkestølsnuten',
      description: 'Følg grusveien frå Brekkestølsbråte',
      elevation: 1044,
      order: 6,
    },
    {
      name: 'Veranibbene',
      description: 'Vakre Buer i Åbødalen',
      elevation: 1012,
      order: 7,
    },
  ]

  for (const peak of peaks) {
    const created = await prisma.peak.upsert({
      where: { name: peak.name },
      update: peak,
      create: peak,
    })
    console.log(`✅ Peak created: ${created.name}`)
  }

  console.log('🎉 Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

