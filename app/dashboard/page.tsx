'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Mountain, Trophy, Calendar, Upload, CheckCircle2, Circle, User, Download, Camera, Image as ImageIcon } from 'lucide-react'
import NorwegianDatePicker from '@/components/NorwegianDatePicker'
import { formatDate } from '@/lib/utils'
import { VIPPS_CONFIG, CATALOG_PRICE } from '@/lib/config'

function DashboardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState<any>(null)
  const [peaks, setPeaks] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedPeak, setSelectedPeak] = useState<string | null>(null)
  const [uploadForm, setUploadForm] = useState({
    image: null as File | null,
    notes: '',
    date: new Date().toISOString().split('T')[0] // Today's date as default
  })
  const [uploading, setUploading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const isNew = searchParams.get('new') === 'true'

  // Load saved user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('s7s_user_session')
    
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setEmail(userData.email)
        loadPeaks()
        // Refresh user data in background
        refreshUserData(userData.email)
      } catch (e) {
        localStorage.removeItem('s7s_user_session')
      }
    }
    setInitialLoad(false)
  }, [])

  const refreshUserData = async (userEmail: string) => {
    try {
      const response = await fetch(`/api/user?email=${encodeURIComponent(userEmail)}`)
      if (response.ok) {
        const data = await response.json()
        setUser(data)
        localStorage.setItem('s7s_user_session', JSON.stringify(data))
      } else if (response.status === 404) {
        // User has been deleted - log them out
        localStorage.removeItem('s7s_user_session')
        setUser(null)
        setEmail('')
      }
    } catch (err) {
      console.error('Failed to refresh user data:', err)
    }
  }

  const loadPeaks = async () => {
    try {
      const response = await fetch('/api/peaks')
      const data = await response.json()
      setPeaks(data)
    } catch (err) {
      console.error('Failed to load peaks:', err)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Innlogging feila')
      }

      // Save user session
      localStorage.setItem('s7s_user_session', JSON.stringify(data))
      setUser(data)
      loadPeaks()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  const handleLogout = () => {
    localStorage.removeItem('s7s_user_session')
    setUser(null)
    setEmail('')
    setPassword('')
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadForm({ ...uploadForm, image: e.target.files[0] })
    }
  }

  const handleSubmitPeak = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadForm.image || !selectedPeak || !user) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('userId', user.id)
      formData.append('peakId', selectedPeak)
      formData.append('image', uploadForm.image)
      if (uploadForm.notes) {
        formData.append('notes', uploadForm.notes)
      }
      if (uploadForm.date) {
        formData.append('submittedDate', uploadForm.date)
      }

      const response = await fetch('/api/submit-peak', {
        method: 'POST',
        body: formData,
      })

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server-feil ved opplasting. Prøv igjen.')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Noko gjekk galt')
      }

      // Reload user data
      await refreshUserData(user.email)
      
      // Reset form
      setSelectedPeak(null)
      setUploadForm({ image: null, notes: '', date: new Date().toISOString().split('T')[0] })
      
      // Show success message
      if (data.completed) {
        alert('🎉 Gratulerer! Du har fullført alle 7 toppene!')
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setUploading(false)
    }
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
              <Image 
                src="/S7S.png" 
                alt="Sauda Seven Summits" 
                width={100} 
                height={100}
              />
            </div>
            <h1 className="text-2xl font-bold text-center mb-6 text-mountain-900">
              Sjå din framdrift
            </h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
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
                  className="w-full px-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Ditt passord"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-semibold transition-all disabled:opacity-50"
              >
                {loading ? 'Loggar inn...' : 'Logg inn'}
              </button>
            </form>

            <div className="text-center mt-4">
              <Link href="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">
                Glemt passord?
              </Link>
            </div>

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

  const completedPeakIds = new Set(user.submissions.map((s: any) => s.peakId))
  const progress = (user.submissions.length / 7) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <Link 
            href="/" 
            className="inline-flex items-center text-primary-700 hover:text-primary-800 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Tilbake til hovudsida
          </Link>
          <div className="flex gap-2">
            <Link 
              href={`/profile?email=${encodeURIComponent(user.email)}`}
              className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-primary-50 px-4 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <User className="w-4 h-4" />
              Min Side
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-white text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
            >
              <ArrowLeft className="w-4 h-4" />
              Logg ut
            </button>
          </div>
        </div>

        {isNew && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-lg mb-8">
            <h3 className="font-semibold text-lg mb-1">🎉 Velkommen, {user.name}!</h3>
            <p>Du er no registrert for Sauda Seven Summits. Lykke til med utfordringa!</p>
          </div>
        )}

        {/* Katalog - Betaling/Nedlasting */}
        {!user.hasPaid ? (
          <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl shadow-lg p-6 mb-8">
            <div className="md:flex items-center justify-between gap-6">
              <div className="flex items-start gap-4 mb-4 md:mb-0">
                <div className="bg-white/20 p-3 rounded-lg flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Få tilgang til S7S-katalogen</h3>
                  <p className="text-yellow-100 text-sm mb-3">
                    Detaljert informasjon om alle fjella, kart og rutebeskrivingar
                  </p>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-sm">
                    <p className="font-semibold mb-1">💳 Betal med Vipps:</p>
                    <p className="text-yellow-50">Vipps til: <strong>{VIPPS_CONFIG.phoneNumber}</strong></p>
                    <p className="text-yellow-50">Beløp: <strong>{VIPPS_CONFIG.currency} {CATALOG_PRICE},-</strong></p>
                    <p className="text-yellow-50 text-xs mt-2">{VIPPS_CONFIG.message}</p>
                  </div>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-sm text-yellow-100 mb-2">Etter betaling:</p>
                <p className="text-xs text-yellow-50">Admin godkjenner og du får tilgang her</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-lg">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">S7S Katalog 2024/2025</h3>
                  <p className="text-green-100 text-sm">Du har tilgang til katalogen!</p>
                </div>
              </div>
              <a 
                href="/S7S-katalog.pdf" 
                download
                className="bg-white text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Last ned PDF
              </a>
            </div>
          </div>
        )}

        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-mountain-900 mb-2">{user.name}</h1>
              <p className="text-mountain-600">{user.email}</p>
            </div>
            {user.completedAt && (
              <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">Fullført!</span>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-mountain-700">Framdrift</span>
              <span className="text-sm font-semibold text-primary-600">{user.submissions.length} / 7</span>
            </div>
            <div className="w-full bg-mountain-200 rounded-full h-4 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-primary-500 to-primary-600 h-full transition-all duration-500 rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-primary-600">{user.submissions.length}</div>
              <div className="text-sm text-mountain-600">Fullførte</div>
            </div>
            <div className="text-center p-4 bg-mountain-50 rounded-lg">
              <div className="text-2xl font-bold text-mountain-600">{7 - user.submissions.length}</div>
              <div className="text-sm text-mountain-600">Gjenstår</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{user.tshirtSize}</div>
              <div className="text-sm text-mountain-600">T-skjorte</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-sm font-bold text-purple-600">
                {formatDate(new Date(user.createdAt))}
              </div>
              <div className="text-sm text-mountain-600">Registrert</div>
            </div>
          </div>
        </div>

        {/* Peaks Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {peaks.map((peak) => {
            const isCompleted = completedPeakIds.has(peak.id)
            const submission = user.submissions.find((s: any) => s.peakId === peak.id)

            return (
              <div 
                key={peak.id}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl ${
                  isCompleted ? 'border-2 border-green-500' : ''
                }`}
              >
                <div className={`p-6 ${isCompleted ? 'bg-green-50' : 'bg-mountain-50'}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <CheckCircle2 className="w-8 h-8 text-green-600" />
                      ) : (
                        <Circle className="w-8 h-8 text-mountain-400" />
                      )}
                      <div>
                        <h3 className="text-xl font-bold text-mountain-900">{peak.name}</h3>
                        {peak.elevation && (
                          <p className="text-sm text-mountain-600">{peak.elevation} moh</p>
                        )}
                      </div>
                    </div>
                    <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                      #{peak.order}
                    </span>
                  </div>

                  {peak.description && (
                    <p className="text-mountain-600 text-sm mb-4">{peak.description}</p>
                  )}

                  {isCompleted ? (
                    <div>
                      {submission.imagePath && (
                        <div className="mb-3 rounded-lg overflow-hidden">
                          <Image 
                            src={submission.imagePath} 
                            alt={`${peak.name} submission`}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-green-700 bg-green-100 px-3 py-2 rounded">
                          <Calendar className="w-4 h-4" />
                          <span>Fullført {formatDate(new Date(submission.submittedAt))}</span>
                        </div>
                        <div className="text-xs text-mountain-500 px-3">
                          Kl. {new Date(submission.submittedAt).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                      {submission.notes && (
                        <p className="text-sm text-mountain-600 mt-2 italic px-3">{submission.notes}</p>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedPeak(peak.id)}
                      className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4" />
                      Registrer bestiginga
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Upload Modal */}
        {selectedPeak && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8">
              <h2 className="text-2xl font-bold mb-6 text-mountain-900">
                Registrer {peaks.find(p => p.id === selectedPeak)?.name}
              </h2>

              <form onSubmit={handleSubmitPeak} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-mountain-700 mb-2">
                    Dato for bestiginga *
                  </label>
                  <NorwegianDatePicker
                    value={uploadForm.date}
                    onChange={(date) => setUploadForm({ ...uploadForm, date })}
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                  <p className="text-xs text-mountain-500 mt-1">Vel datoen du var på toppen</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mountain-700 mb-2">
                    Bilete frå toppen *
                  </label>
                  
                  {uploadForm.image ? (
                    <div className="border-2 border-green-400 bg-green-50 rounded-xl p-6 text-center">
                      <div className="space-y-2">
                        <div className="w-20 h-20 mx-auto rounded-lg overflow-hidden bg-mountain-200">
                          <img 
                            src={URL.createObjectURL(uploadForm.image)} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm font-medium text-green-700">
                          ✓ {uploadForm.image.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => setUploadForm({ ...uploadForm, image: null })}
                          className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          Fjern og velg nytt bilete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      {/* Camera button */}
                      <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-mountain-300 hover:border-primary-400 hover:bg-primary-50 rounded-xl p-4 text-center transition-all">
                          <div className="w-12 h-12 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-2">
                            <Camera className="w-6 h-6 text-primary-600" />
                          </div>
                          <p className="text-sm font-medium text-mountain-700">
                            Ta bilete
                          </p>
                          <p className="text-xs text-mountain-500">
                            Bruk kamera
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                      
                      {/* File picker button */}
                      <label className="block cursor-pointer">
                        <div className="border-2 border-dashed border-mountain-300 hover:border-primary-400 hover:bg-primary-50 rounded-xl p-4 text-center transition-all">
                          <div className="w-12 h-12 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-2">
                            <ImageIcon className="w-6 h-6 text-primary-600" />
                          </div>
                          <p className="text-sm font-medium text-mountain-700">
                            Vel bilete
                          </p>
                          <p className="text-xs text-mountain-500">
                            Frå galleri
                          </p>
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-mountain-700 mb-2">
                    Notat (valfritt)
                  </label>
                  <textarea
                    value={uploadForm.notes}
                    onChange={(e) => setUploadForm({ ...uploadForm, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    rows={3}
                    placeholder="Korleis var turen?"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPeak(null)}
                    className="flex-1 bg-mountain-200 hover:bg-mountain-300 text-mountain-700 py-3 rounded-lg font-semibold transition-all"
                  >
                    Avbryt
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !uploadForm.image}
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50"
                  >
                    {uploading ? 'Lastar opp...' : 'Last opp'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Lastar...</div>}>
      <DashboardContent />
    </Suspense>
  )
}

