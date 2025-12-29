import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Get password from environment variable or use default
  const adminEmail = process.env.ADMIN_EMAIL || 'kristina@saudail.no'
  const newPassword = 'L3n0v02025!'
  
  if (!newPassword) {
    console.error('❌ ADMIN_PASSWORD environment variable is not set!')
    process.exit(1)
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, 10)
  
  console.log('Updating admin password...')
  console.log('Admin email:', adminEmail)
  console.log('New password:', newPassword.substring(0, 3) + '***')
  console.log('Hash:', hashedPassword.substring(0, 20) + '...')
  
  const admin = await prisma.admin.update({
    where: { email: adminEmail },
    data: { password: hashedPassword }
  })
  
  console.log('✅ Admin password updated for:', admin.email)
  
  // Verify it works
  const verify = await bcrypt.compare(newPassword, admin.password)
  console.log('Verification:', verify ? '✅ SUCCESS' : '❌ FAIL')
  
  if (!verify) {
    console.error('❌ Password verification failed!')
    process.exit(1)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())


