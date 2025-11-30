'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Lock } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Ugyldig e-post eller passord')
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch (err) {
      setError('Noko gjekk galt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mountain-900 to-mountain-800 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center text-white/80 hover:text-white mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Tilbake til hovudsida
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-mountain-700 to-mountain-800 text-white p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/10 p-4 rounded-full">
                <Lock className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Admin-innlogging</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-mountain-700 mb-2">
                E-postadresse
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500 outline-none"
                placeholder="admin@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-mountain-700 mb-2">
                Passord
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-mountain-500 focus:border-mountain-500 outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-mountain-700 hover:bg-mountain-800 text-white py-3 px-6 rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {loading ? 'Loggar inn...' : 'Logg inn'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}




