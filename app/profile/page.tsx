'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Mail, Phone, Shirt, Save, Edit2, X } from 'lucide-react'
import { TSHIRT_SIZES } from '@/lib/utils'

function ProfileContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    tshirtSize: 'M'
  })

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('s7s_user_email')
    const urlEmail = searchParams.get('email')
    
    if (urlEmail) {
      setEmail(urlEmail)
      setLoading(true)
      localStorage.setItem('s7s_user_email', urlEmail)
    } else if (savedEmail) {
      setEmail(savedEmail)
      setLoading(true)
    }
    setInitialLoad(false)
  }, [])

  useEffect(() => {
    if (email && !user) {
      loadUserData()
    }
  }, [email])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone,
        tshirtSize: user.tshirtSize
      })
    }
  }, [user])

  const loadUserData = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/user?email=${encodeURIComponent(email)}`)
      if (!response.ok) {
        throw new Error('Brukar ikkje funne')
      }
      const data = await response.json()
      setUser(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('s7s_user_email', email)
    loadUserData()
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/user/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user.email,
          ...formData
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Kunne ikkje oppdatere')
      }

      setUser({ ...user, ...formData })
      setEditing(false)
      alert('✅ Profilen din er oppdatert!')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user.name,
      phone: user.phone,
      tshirtSize: user.tshirtSize
    })
    setEditing(false)
  }

  // Show loading while checking auth or loading user data
  if (initialLoad || (email && !user && loading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-mountain-600">Lastar...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
        <div className="max-w-md mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center text-primary-700 hover:text-primary-800 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Tilbake til hovudsida
          </Link>

          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-primary-100 p-4 rounded-full">
                <User className="w-12 h-12 text-primary-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center mb-6 text-mountain-900">
              Min Side
            </h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleEmailSubmit} className="space-y-4">
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
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {loading ? 'Søker...' : 'Fortsett'}
              </button>
            </form>

            <p className="text-center text-sm text-mountain-600 mt-6">
              Ikkje registrert enno?{' '}
              <Link href="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
                Registrer deg her
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link 
            href={`/dashboard?email=${encodeURIComponent(user.email)}`}
            className="inline-flex items-center text-primary-700 hover:text-primary-800 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Tilbake til dashboard
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Min Side</h1>
                  <p className="text-blue-100">Oppdater din informasjon</p>
                </div>
              </div>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Rediger
                </button>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-mountain-700 mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Fullt namn
                </div>
              </label>
              {editing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              ) : (
                <div className="px-4 py-3 bg-mountain-50 rounded-lg text-mountain-900 font-medium">
                  {user.name}
                </div>
              )}
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-sm font-semibold text-mountain-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  E-postadresse
                </div>
              </label>
              <div className="px-4 py-3 bg-mountain-100 rounded-lg text-mountain-600 font-medium">
                {user.email}
                <span className="text-xs ml-2 text-mountain-500">(kan ikkje endrast)</span>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-mountain-700 mb-2">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  Telefonnummer
                </div>
              </label>
              {editing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              ) : (
                <div className="px-4 py-3 bg-mountain-50 rounded-lg text-mountain-900 font-medium">
                  {user.phone}
                </div>
              )}
            </div>

            {/* T-shirt Size */}
            <div>
              <label className="block text-sm font-semibold text-mountain-700 mb-2">
                <div className="flex items-center gap-2">
                  <Shirt className="w-4 h-4" />
                  T-skjorte størrelse
                </div>
              </label>
              {editing ? (
                <select
                  value={formData.tshirtSize}
                  onChange={(e) => setFormData({ ...formData, tshirtSize: e.target.value })}
                  className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white"
                >
                  {TSHIRT_SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              ) : (
                <div className="px-4 py-3 bg-mountain-50 rounded-lg text-mountain-900 font-medium">
                  {user.tshirtSize}
                </div>
              )}
              <p className="text-xs text-mountain-500 mt-1">
                Du får ei t-skjorte når du fullfører alle 7 topper
              </p>
            </div>

            {/* Action buttons */}
            {editing && (
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-mountain-200 hover:bg-mountain-300 text-mountain-700 py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Avbryt
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Lagrar...' : 'Lagre endringar'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Lastar...</div>}>
      <ProfileContent />
    </Suspense>
  )
}

