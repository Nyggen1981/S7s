import { PrismaClient } from '@prisma/client'

// Supabase connection
const supabasePrisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://postgres.rsuqmxbywyogveopkuzo:L3n0v02025!@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
    }
  }
})

// Neon connection (uses default DATABASE_URL from .env)
const neonPrisma = new PrismaClient()

async function migrate() {
  console.log('🚀 Starting migration from Supabase to Neon...\n')

  try {
    // Fetch all users from Supabase
    console.log('📥 Fetching users from Supabase...')
    const users = await supabasePrisma.user.findMany({
      include: {
        submissions: true
      }
    })
    console.log(`   Found ${users.length} users`)

    // Fetch all admins from Supabase
    console.log('📥 Fetching admins from Supabase...')
    const admins = await supabasePrisma.admin.findMany()
    console.log(`   Found ${admins.length} admins`)

    // Migrate admins first
    console.log('\n📤 Migrating admins to Neon...')
    for (const admin of admins) {
      try {
        // Check if admin already exists
        const existing = await neonPrisma.admin.findUnique({
          where: { email: admin.email }
        })
        
        if (existing) {
          console.log(`   ⏭️  Admin ${admin.email} already exists, skipping`)
          continue
        }

        await neonPrisma.admin.create({
          data: {
            id: admin.id,
            email: admin.email,
            password: admin.password,
            name: admin.name,
            createdAt: admin.createdAt
          }
        })
        console.log(`   ✅ Admin migrated: ${admin.email}`)
      } catch (error) {
        console.log(`   ❌ Error migrating admin ${admin.email}:`, error)
      }
    }

    // Migrate users
    console.log('\n📤 Migrating users to Neon...')
    let migratedUsers = 0
    let migratedSubmissions = 0

    for (const user of users) {
      try {
        // Check if user already exists
        const existing = await neonPrisma.user.findUnique({
          where: { email: user.email }
        })
        
        if (existing) {
          console.log(`   ⏭️  User ${user.email} already exists, skipping`)
          continue
        }

        // Create user
        await neonPrisma.user.create({
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            phone: user.phone,
            tshirtSize: user.tshirtSize,
            hasPaid: user.hasPaid,
            paidAt: user.paidAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            completedAt: user.completedAt
          }
        })
        migratedUsers++
        console.log(`   ✅ User migrated: ${user.name} (${user.email})`)

        // Migrate submissions for this user
        for (const submission of user.submissions) {
          try {
            await neonPrisma.submission.create({
              data: {
                id: submission.id,
                userId: submission.userId,
                peakId: submission.peakId,
                imagePath: submission.imagePath,
                submittedAt: submission.submittedAt,
                latitude: submission.latitude,
                longitude: submission.longitude,
                notes: submission.notes
              }
            })
            migratedSubmissions++
          } catch (subError) {
            console.log(`      ❌ Error migrating submission:`, subError)
          }
        }
        
        if (user.submissions.length > 0) {
          console.log(`      📸 ${user.submissions.length} submissions migrated`)
        }
      } catch (error) {
        console.log(`   ❌ Error migrating user ${user.email}:`, error)
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log('🎉 Migration completed!')
    console.log(`   Users migrated: ${migratedUsers}`)
    console.log(`   Submissions migrated: ${migratedSubmissions}`)
    console.log('='.repeat(50))

  } catch (error) {
    console.error('❌ Migration failed:', error)
  } finally {
    await supabasePrisma.$disconnect()
    await neonPrisma.$disconnect()
  }
}

migrate()




