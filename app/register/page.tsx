'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { TSHIRT_SIZES } from '@/lib/utils'
import { ArrowLeft, UserPlus } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tshirtSize: 'M'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Noko gjekk galt')
      }

      // Save email to localStorage and redirect to dashboard
      localStorage.setItem('s7s_user_email', formData.email)
      router.push(`/dashboard?email=${encodeURIComponent(formData.email)}&new=true`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link 
          href="/" 
          className="inline-flex items-center text-primary-700 hover:text-primary-800 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Tilbake til hovudsida
        </Link>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-8 text-center">
            <div className="flex justify-center mb-4">
              <Image 
                src="/S7S.png" 
                alt="Sauda Seven Summits" 
                width={120} 
                height={120}
                className="drop-shadow-lg"
              />
            </div>
            <h1 className="text-3xl font-bold mb-2">Registrer deg</h1>
            <p className="text-blue-100">Bli med på Sauda Seven Summits</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-mountain-700 mb-2">
                Fullt namn *
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                placeholder="Ola Nordmann"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-mountain-700 mb-2">
                E-postadresse *
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                placeholder="ola@example.com"
              />
              <p className="text-sm text-mountain-500 mt-1">
                Bruk denne e-posten for å sjå din framdrift seinare
              </p>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-mountain-700 mb-2">
                Telefonnummer *
              </label>
              <input
                type="tel"
                id="phone"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
                placeholder="123 45 678"
              />
            </div>

            <div>
              <label htmlFor="tshirtSize" className="block text-sm font-semibold text-mountain-700 mb-2">
                T-skjorte størrelse *
              </label>
              <select
                id="tshirtSize"
                required
                value={formData.tshirtSize}
                onChange={(e) => setFormData({ ...formData, tshirtSize: e.target.value })}
                className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition bg-white"
              >
                {TSHIRT_SIZES.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              <p className="text-sm text-mountain-500 mt-1">
                Du får ei t-skjorte når du fullfører alle 7 topper
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Registrerer...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Registrer deg
                </>
              )}
            </button>

            <p className="text-center text-sm text-mountain-600">
              Allereie registrert?{' '}
              <Link href="/dashboard" className="text-primary-600 hover:text-primary-700 font-semibold">
                Sjå din framdrift
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

