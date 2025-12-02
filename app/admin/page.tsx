import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { jwtVerify } from 'jose'
import AdminDashboard from '@/components/AdminDashboard'

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret')

async function verifyAdmin() {
  const cookieStore = cookies()
  const token = cookieStore.get('admin-token')?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, secret)
    if (payload.role === 'admin') {
      return payload
    }
    return null
  } catch {
    return null
  }
}

export default async function AdminPage() {
  const admin = await verifyAdmin()

  if (!admin) {
    redirect('/admin/login')
  }

  return <AdminDashboard />
}





