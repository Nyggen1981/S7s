import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Get password from command line argument or environment variable
  const passwordFromArg = process.argv[2]
  const adminEmail = process.env.ADMIN_EMAIL || 'kristina@saudail.no'
  const adminPassword = passwordFromArg || process.env.ADMIN_PASSWORD
  
  if (!adminPassword) {
    console.error('❌ No password provided!')
    console.error('\nUsage:')
    console.error('  npx tsx prisma/update-admin-password.ts <PASSWORD>')
    console.error('\nOr set ADMIN_PASSWORD in .env file')
    process.exit(1)
  }
  
  console.log('🔄 Updating admin password...')
  console.log('   Admin email:', adminEmail)
  console.log('   New password:', adminPassword.substring(0, 3) + '***')
  
  // Check if admin exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail }
  })
  
  if (!existingAdmin) {
    console.error(`\n❌ Admin user ${adminEmail} does not exist in database!`)
    console.error('   Available admins:')
    const allAdmins = await prisma.admin.findMany()
    allAdmins.forEach(a => console.error(`     - ${a.email}`))
    process.exit(1)
  }
  
  // Update password
  const hashedPassword = await bcrypt.hash(adminPassword, 10)
  const admin = await prisma.admin.update({
    where: { email: adminEmail },
    data: { password: hashedPassword }
  })
  
  console.log('✅ Admin password updated for:', admin.email)
  
  // Verify it works
  const verify = await bcrypt.compare(adminPassword, admin.password)
  console.log('🔐 Password verification:', verify ? '✅ SUCCESS' : '❌ FAIL')
  
  if (!verify) {
    console.error('❌ Password verification failed!')
    process.exit(1)
  }
  
  console.log('\n🎉 Password updated successfully!')
  console.log('   You can now log in with:')
  console.log(`   Email: ${adminEmail}`)
  console.log(`   Password: ${adminPassword.substring(0, 3)}***`)
  console.log('\n⚠️  Make sure this password matches ADMIN_PASSWORD in Vercel!')
}

main()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


