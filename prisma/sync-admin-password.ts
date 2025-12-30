import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Get values from environment variables (same as Vercel)
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD
  
  if (!adminEmail) {
    console.error('❌ ADMIN_EMAIL environment variable is not set!')
    console.error('   Set it in .env file or pass as environment variable')
    process.exit(1)
  }
  
  if (!adminPassword) {
    console.error('❌ ADMIN_PASSWORD environment variable is not set!')
    console.error('   Set it in .env file or pass as environment variable')
    process.exit(1)
  }
  
  console.log('🔄 Syncing admin password with Vercel settings...')
  console.log('   Admin email:', adminEmail)
  console.log('   Password:', adminPassword.substring(0, 3) + '***')
  
  // Check if admin exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail }
  })
  
  if (!existingAdmin) {
    console.log(`\n⚠️  Admin user ${adminEmail} does not exist in database`)
    console.log('   Creating new admin user...')
    
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    const admin = await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
      }
    })
    
    console.log('✅ Admin user created:', admin.email)
  } else {
    console.log(`\n✅ Found admin user: ${existingAdmin.email}`)
    
    // Update password
    const hashedPassword = await bcrypt.hash(adminPassword, 10)
    const admin = await prisma.admin.update({
      where: { email: adminEmail },
      data: { password: hashedPassword }
    })
    
    console.log('✅ Admin password updated')
  }
  
  // Verify it works
  const admin = await prisma.admin.findUnique({
    where: { email: adminEmail }
  })
  
  if (!admin) {
    console.error('❌ Failed to find admin after update!')
    process.exit(1)
  }
  
  const verify = await bcrypt.compare(adminPassword, admin.password)
  console.log('\n🔐 Password verification:', verify ? '✅ SUCCESS' : '❌ FAIL')
  
  if (!verify) {
    console.error('❌ Password verification failed!')
    process.exit(1)
  }
  
  console.log('\n🎉 Admin password synced successfully!')
  console.log('   You can now log in with:')
  console.log(`   Email: ${adminEmail}`)
  console.log(`   Password: ${adminPassword.substring(0, 3)}***`)
}

main()
  .catch((error) => {
    console.error('❌ Error:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


