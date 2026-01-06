'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Bell, BellOff, Eye, Code, FileText, Check, X, Loader2 } from 'lucide-react'

interface AdminSettings {
  notifyNewUser: boolean
  notifyPeakSubmission: boolean
  notifyAllPeaksCompleted: boolean
}

interface EmailTemplate {
  name: string
  description: string
  subject: string
  html: string
  plainText: string
}

export default function AdminSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState<AdminSettings>({
    notifyNewUser: true,
    notifyPeakSubmission: false,
    notifyAllPeaksCompleted: true
  })
  const [templates, setTemplates] = useState<Record<string, EmailTemplate>>({})
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'html' | 'code' | 'text'>('html')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    checkAuthAndLoad()
  }, [])

  const checkAuthAndLoad = async () => {
    try {
      const verifyRes = await fetch('/api/admin/verify')
      if (!verifyRes.ok) {
        router.push('/admin/login')
        return
      }

      // Load settings
      const settingsRes = await fetch('/api/admin/settings')
      if (settingsRes.ok) {
        const data = await settingsRes.json()
        setSettings(data)
      }

      // Load templates
      const templatesRes = await fetch('/api/admin/email-templates')
      if (templatesRes.ok) {
        const data = await templatesRes.json()
        setTemplates(data)
      }
    } catch (err) {
      console.error('Load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const saveSettings = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (!res.ok) {
        throw new Error('Kunne ikkje lagre innstillingar')
      }

      setSuccess('Innstillingar lagra!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const toggleSetting = (key: keyof AdminSettings) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mountain-900 to-mountain-800">
        <div className="text-center text-white">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p>Lastar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-mountain-100 to-blue-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-mountain-700 hover:text-mountain-900 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Tilbake til dashboard
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-mountain-900 mb-8 flex items-center gap-3">
          <Mail className="w-8 h-8" />
          E-post innstillingar
        </h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Notification Settings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-mountain-900 mb-6 flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Varsel-innstillingar
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-mountain-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-mountain-900">Ny brukar</h3>
                  <p className="text-sm text-mountain-600">Få varsel når nokon registrerer seg</p>
                </div>
                <button
                  onClick={() => toggleSetting('notifyNewUser')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    settings.notifyNewUser ? 'bg-green-500' : 'bg-mountain-300'
                  }`}
                >
                  <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${
                    settings.notifyNewUser ? 'left-8' : 'left-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-mountain-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-mountain-900">Fjellregistrering</h3>
                  <p className="text-sm text-mountain-600">Få varsel for kvar fjelltopp</p>
                </div>
                <button
                  onClick={() => toggleSetting('notifyPeakSubmission')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    settings.notifyPeakSubmission ? 'bg-green-500' : 'bg-mountain-300'
                  }`}
                >
                  <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${
                    settings.notifyPeakSubmission ? 'left-8' : 'left-1'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 bg-mountain-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-mountain-900">Alle toppar fullført</h3>
                  <p className="text-sm text-mountain-600">Få varsel når nokon fullfører alle 7</p>
                </div>
                <button
                  onClick={() => toggleSetting('notifyAllPeaksCompleted')}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    settings.notifyAllPeaksCompleted ? 'bg-green-500' : 'bg-mountain-300'
                  }`}
                >
                  <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-all ${
                    settings.notifyAllPeaksCompleted ? 'left-8' : 'left-1'
                  }`} />
                </button>
              </div>
            </div>

            <button
              onClick={saveSettings}
              disabled={saving}
              className="w-full mt-6 bg-mountain-700 hover:bg-mountain-800 text-white py-3 px-6 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Lagrar...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Lagre innstillingar
                </>
              )}
            </button>
          </div>

          {/* Email Templates List */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-mountain-900 mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              E-postmalar
            </h2>

            <div className="space-y-3">
              {Object.entries(templates).map(([key, template]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTemplate(key)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedTemplate === key
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-mountain-200 hover:border-mountain-300 bg-mountain-50'
                  }`}
                >
                  <h3 className="font-semibold text-mountain-900">{template.name}</h3>
                  <p className="text-sm text-mountain-600 mt-1">{template.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Template Preview */}
        {selectedTemplate && templates[selectedTemplate] && (
          <div className="mt-8 bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-mountain-900">
                  {templates[selectedTemplate].name}
                </h2>
                <p className="text-sm text-mountain-600 mt-1">
                  Emne: <span className="font-medium">{templates[selectedTemplate].subject}</span>
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('html')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    viewMode === 'html'
                      ? 'bg-primary-600 text-white'
                      : 'bg-mountain-100 text-mountain-700 hover:bg-mountain-200'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  Førehandsvisning
                </button>
                <button
                  onClick={() => setViewMode('code')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    viewMode === 'code'
                      ? 'bg-primary-600 text-white'
                      : 'bg-mountain-100 text-mountain-700 hover:bg-mountain-200'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  HTML
                </button>
                <button
                  onClick={() => setViewMode('text')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    viewMode === 'text'
                      ? 'bg-primary-600 text-white'
                      : 'bg-mountain-100 text-mountain-700 hover:bg-mountain-200'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  Ren tekst
                </button>
              </div>
            </div>

            <div className="border border-mountain-200 rounded-lg overflow-hidden">
              {viewMode === 'html' && (
                <div 
                  className="p-6 bg-white"
                  dangerouslySetInnerHTML={{ __html: templates[selectedTemplate].html }}
                />
              )}
              {viewMode === 'code' && (
                <pre className="p-4 bg-mountain-900 text-green-400 overflow-x-auto text-sm">
                  <code>{templates[selectedTemplate].html}</code>
                </pre>
              )}
              {viewMode === 'text' && (
                <pre className="p-4 bg-mountain-50 text-mountain-800 whitespace-pre-wrap font-mono text-sm">
                  {templates[selectedTemplate].plainText}
                </pre>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}



