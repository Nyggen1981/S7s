'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Noko gjekk galt')
      } else {
        setSuccess(true)
      }
    } catch (err) {
      setError('Noko gjekk galt')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-md mx-auto">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center text-primary-700 hover:text-primary-800 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Tilbake til innlogging
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/10 p-4 rounded-full">
                <Mail className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Glemt passord?</h1>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success ? (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  <p className="font-semibold">E-post sendt!</p>
                  <p className="text-sm mt-2">
                    Hvis denne e-postadressen eksisterer, vil du motta e-post med nytt passord.
                  </p>
                </div>
                <Link
                  href="/dashboard"
                  className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-semibold transition-all"
                >
                  Tilbake til innlogging
                </Link>
              </div>
            ) : (
              <>
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
                    className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="din@email.no"
                  />
                  <p className="text-sm text-mountain-600 mt-2">
                    Skriv inn e-postadressen din, så sender vi deg e-post med nytt passord.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? 'Sender...' : 'Send nytt passord'}
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}


