import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret')

export async function verifyAdminToken() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('admin-token')?.value

    if (!token) {
      return null
    }

    const { payload } = await jwtVerify(token, secret)

    if (payload.role !== 'admin') {
      return null
    }

    return {
      id: payload.id as string,
      email: payload.email as string,
      name: payload.name as string
    }
  } catch {
    return null
  }
}


