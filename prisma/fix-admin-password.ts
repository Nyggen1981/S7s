import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const newPassword = 'L3n0v02025!'
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  
  console.log('Updating admin password...')
  console.log('New password:', newPassword)
  console.log('Hash:', hashedPassword)
  
  const admin = await prisma.admin.update({
    where: { email: 'kristina@saudail.no' },
    data: { password: hashedPassword }
  })
  
  console.log('✅ Admin password updated for:', admin.email)
  
  // Verify it works
  const verify = await bcrypt.compare(newPassword, admin.password)
  console.log('Verification:', verify ? '✅ SUCCESS' : '❌ FAIL')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())

