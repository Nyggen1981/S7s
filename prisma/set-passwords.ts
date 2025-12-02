import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔐 Setting passwords for existing users...')

  // Get all users without passwords (or with empty passwords)
  const users = await prisma.user.findMany()
  
  const defaultPassword = 'S7s2025!' // Default password for existing users
  const hashedPassword = await bcrypt.hash(defaultPassword, 10)

  for (const user of users) {
    // Check if user needs a password
    if (!user.password || user.password === '') {
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
      })
      console.log(`✅ Password set for: ${user.email}`)
    } else {
      console.log(`⏭️  Skipped (already has password): ${user.email}`)
    }
  }

  console.log('')
  console.log('🎉 Done!')
  console.log('')
  console.log('📧 Eksisterande brukarar kan no logge inn med:')
  console.log(`   Passord: ${defaultPassword}`)
  console.log('')
  console.log('⚠️  Be brukarane om å endre passord etter innlogging!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

