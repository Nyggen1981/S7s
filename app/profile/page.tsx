'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Mail, Phone, Shirt, Save, Edit2, X, Lock, Eye, EyeOff } from 'lucide-react'
import { TSHIRT_SIZES } from '@/lib/utils'

function ProfileContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
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
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [changingPassword, setChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')

  // Load saved user session on mount and verify with server
  useEffect(() => {
    const savedUser = localStorage.getItem('s7s_user_session')
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setFormData({
          name: userData.name,
          phone: userData.phone,
          tshirtSize: userData.tshirtSize
        })
        // Verify user still exists
        verifyUser(userData.email)
      } catch (e) {
        // If no valid session, redirect to dashboard to login
        router.push('/dashboard')
      }
    } else {
      // No session, redirect to login
      router.push('/dashboard')
    }
    setInitialLoad(false)
  }, [])

  const verifyUser = async (userEmail: string) => {
    try {
      const response = await fetch(`/api/user?email=${encodeURIComponent(userEmail)}`)
      if (response.status === 404) {
        // User has been deleted - log them out
        localStorage.removeItem('s7s_user_session')
        router.push('/dashboard')
      } else if (response.ok) {
        const data = await response.json()
        setUser(data)
        localStorage.setItem('s7s_user_session', JSON.stringify(data))
      }
    } catch (err) {
      console.error('Failed to verify user:', err)
    }
  }

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone,
        tshirtSize: user.tshirtSize
      })
    }
  }, [user])

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

  const handleChangePassword = async () => {
    setPasswordError('')
    setPasswordSuccess('')

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Alle felt må fylles ut')
      return
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Nytt passord må vere minst 6 teikn')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passorda er ikkje like')
      return
    }

    setChangingPassword(true)
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Kunne ikkje endre passord')
      }

      setPasswordSuccess('Passord oppdatert!')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => {
        setShowPasswordChange(false)
        setPasswordSuccess('')
      }, 2000)
    } catch (err: any) {
      setPasswordError(err.message)
    } finally {
      setChangingPassword(false)
    }
  }

  // Show loading while checking auth
  if (initialLoad || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-mountain-600">Lastar...</p>
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

            {/* Password Change Section */}
            <div className="border-t border-mountain-200 pt-6 mt-6">
              <button
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="flex items-center gap-2 text-mountain-700 hover:text-mountain-900 font-semibold"
              >
                <Lock className="w-4 h-4" />
                Endre passord
                <span className="text-mountain-400">{showPasswordChange ? '▲' : '▼'}</span>
              </button>

              {showPasswordChange && (
                <div className="mt-4 space-y-4 bg-mountain-50 p-4 rounded-lg">
                  {passwordError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
                      {passwordError}
                    </div>
                  )}
                  {passwordSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
                      {passwordSuccess}
                    </div>
                  )}

                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-semibold text-mountain-700 mb-2">
                      Noverande passord
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 pr-12 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-mountain-500 hover:text-mountain-700"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-semibold text-mountain-700 mb-2">
                      Nytt passord
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 pr-12 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        placeholder="Minst 6 teikn"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-mountain-500 hover:text-mountain-700"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-semibold text-mountain-700 mb-2">
                      Bekreft nytt passord
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 pr-12 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                        placeholder="Skriv passordet på nytt"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-mountain-500 hover:text-mountain-700"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleChangePassword}
                    disabled={changingPassword}
                    className="w-full bg-mountain-700 hover:bg-mountain-800 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    {changingPassword ? 'Endrar passord...' : 'Endre passord'}
                  </button>
                </div>
              )}
            </div>
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

