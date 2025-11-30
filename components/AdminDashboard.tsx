'use client'

import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { 
  Users, 
  Mountain, 
  Trophy, 
  Download, 
  LogOut, 
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  Shirt,
  ChevronDown,
  ChevronRight,
  Image as ImageIcon,
  DollarSign,
  XCircle
} from 'lucide-react'
import NextImage from 'next/image'
import { formatDate, formatDateTime } from '@/lib/utils'

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'in-progress'>('all')
  const [paymentFilter, setPaymentFilter] = useState<'all' | 'paid' | 'unpaid'>('all')
  const [exporting, setExporting] = useState(false)
  const [expandedUser, setExpandedUser] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      setUsers(data)
    } catch (error) {
      console.error('Failed to load users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const response = await fetch('/api/admin/export')
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sauda-seven-summits-${new Date().toISOString().split('T')[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to export:', error)
      alert('Kunne ikkje eksportere data')
    } finally {
      setExporting(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' ||
                         (filterStatus === 'completed' && user.completedAt) ||
                         (filterStatus === 'in-progress' && !user.completedAt)
    
    const matchesPayment = paymentFilter === 'all' ||
                          (paymentFilter === 'paid' && user.hasPaid) ||
                          (paymentFilter === 'unpaid' && !user.hasPaid)
    
    return matchesSearch && matchesFilter && matchesPayment
  })

  const stats = {
    total: users.length,
    completed: users.filter(u => u.completedAt).length,
    inProgress: users.filter(u => !u.completedAt && u.submissions.length > 0).length,
    notStarted: users.filter(u => u.submissions.length === 0).length,
    paid: users.filter(u => u.hasPaid).length,
    unpaid: users.filter(u => !u.hasPaid).length,
  }

  const handleApprovePayment = async (userId: string, approved: boolean) => {
    try {
      const response = await fetch('/api/admin/approve-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, approved }),
      })

      if (!response.ok) {
        throw new Error('Failed to update payment status')
      }

      // Reload users
      await loadUsers()
      alert(approved ? '✅ Betaling godkjent!' : '❌ Betaling avvist')
    } catch (error) {
      console.error('Error approving payment:', error)
      alert('Kunne ikkje oppdatere betalingsstatus')
    }
  }

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`⚠️ Er du sikker på at du vil slette ${userName}?\n\nDette vil fjerne:\n- Brukaren\n- Alle fjellregistreringar\n- Alle opplasta bilete\n\nDette kan IKKJE angrast!`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/delete-user?userId=${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete user')
      }

      await loadUsers()
      alert('✅ Brukaren er sletta')
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('❌ Kunne ikkje slette brukaren')
    }
  }

  if (loading) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center justify-between flex-wrap gap-3 md:gap-4">
            <div className="flex items-center gap-3 md:gap-4">
              <Image 
                src="/S7S.png" 
                alt="Sauda Seven Summits" 
                width={50} 
                height={50}
                className="w-[50px] h-[50px] md:w-[60px] md:h-[60px]"
              />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-mountain-900">Admin-panel</h1>
                <p className="text-sm md:text-base text-mountain-600">Sauda Seven Summits</p>
              </div>
            </div>
            <div className="flex gap-2 md:gap-3 w-full md:w-auto">
              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-4 md:px-6 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{exporting ? 'Eksporterer...' : 'Eksporter'}</span>
                <span className="sm:hidden">Excel</span>
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="bg-mountain-600 hover:bg-mountain-700 text-white px-4 md:px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 text-sm md:text-base"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logg ut</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-mountain-600 text-xs md:text-sm font-medium">Totalt</p>
                <p className="text-2xl md:text-3xl font-bold text-mountain-900 mt-1">{stats.total}</p>
              </div>
              <div className="bg-blue-100 p-2 md:p-3 rounded-full">
                <Users className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-mountain-600 text-xs md:text-sm font-medium">Fullført</p>
                <p className="text-2xl md:text-3xl font-bold text-green-600 mt-1">{stats.completed}</p>
              </div>
              <div className="bg-green-100 p-2 md:p-3 rounded-full">
                <Trophy className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-mountain-600 text-xs md:text-sm font-medium">I gang</p>
                <p className="text-2xl md:text-3xl font-bold text-yellow-600 mt-1">{stats.inProgress}</p>
              </div>
              <div className="bg-yellow-100 p-2 md:p-3 rounded-full">
                <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-mountain-600 text-xs md:text-sm font-medium">Ikkje starta</p>
                <p className="text-2xl md:text-3xl font-bold text-mountain-600 mt-1">{stats.notStarted}</p>
              </div>
              <div className="bg-mountain-100 p-2 md:p-3 rounded-full">
                <Mountain className="w-5 h-5 md:w-6 md:h-6 text-mountain-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-mountain-600 text-xs md:text-sm font-medium">Betalt</p>
                <p className="text-2xl md:text-3xl font-bold text-green-600 mt-1">{stats.paid}</p>
              </div>
              <div className="bg-green-100 p-2 md:p-3 rounded-full">
                <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-mountain-600 text-xs md:text-sm font-medium">Ubetalt</p>
                <p className="text-2xl md:text-3xl font-bold text-orange-600 mt-1">{stats.unpaid}</p>
              </div>
              <div className="bg-orange-100 p-2 md:p-3 rounded-full">
                <DollarSign className="w-5 h-5 md:w-6 md:h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-mountain-400" />
                <input
                  type="text"
                  placeholder="Søk etter namn eller e-post..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-mountain-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filterStatus === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-mountain-100 text-mountain-700 hover:bg-mountain-200'
                }`}
              >
                Alle
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filterStatus === 'completed'
                    ? 'bg-green-600 text-white'
                    : 'bg-mountain-100 text-mountain-700 hover:bg-mountain-200'
                }`}
              >
                Fullført
              </button>
              <button
                onClick={() => setFilterStatus('in-progress')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filterStatus === 'in-progress'
                    ? 'bg-yellow-600 text-white'
                    : 'bg-mountain-100 text-mountain-700 hover:bg-mountain-200'
                }`}
              >
                I gang
              </button>
            </div>
          </div>
          
          {/* Payment Filter */}
          <div className="mt-4 pt-4 border-t border-mountain-200">
            <p className="text-sm font-medium text-mountain-700 mb-3">Betalingsstatus:</p>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setPaymentFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  paymentFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-mountain-100 text-mountain-700 hover:bg-mountain-200'
                }`}
              >
                Alle ({users.length})
              </button>
              <button
                onClick={() => setPaymentFilter('paid')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  paymentFilter === 'paid'
                    ? 'bg-green-600 text-white'
                    : 'bg-mountain-100 text-mountain-700 hover:bg-mountain-200'
                }`}
              >
                ✓ Betalt ({stats.paid})
              </button>
              <button
                onClick={() => setPaymentFilter('unpaid')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  paymentFilter === 'unpaid'
                    ? 'bg-orange-600 text-white'
                    : 'bg-mountain-100 text-mountain-700 hover:bg-mountain-200'
                }`}
              >
                $ Ikkje betalt ({stats.unpaid})
              </button>
            </div>
          </div>
        </div>

        {/* Results count */}
        {(searchTerm || filterStatus !== 'all' || paymentFilter !== 'all') && (
          <div className="mb-4 text-sm text-mountain-600 bg-blue-50 px-4 py-2 rounded-lg">
            <strong>Viser {filteredUsers.length}</strong> av {users.length} deltakarar
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-mountain-50 border-b border-mountain-200">
                <tr>
                  <th className="px-3 md:px-6 py-4 text-left text-sm font-semibold text-mountain-700"></th>
                  <th className="px-3 md:px-6 py-4 text-left text-sm font-semibold text-mountain-700">Deltaker</th>
                  <th className="hidden md:table-cell px-6 py-4 text-left text-sm font-semibold text-mountain-700">Kontakt</th>
                  <th className="px-3 md:px-6 py-4 text-left text-sm font-semibold text-mountain-700">Framdrift</th>
                  <th className="px-3 md:px-6 py-4 text-left text-sm font-semibold text-mountain-700">Status</th>
                  <th className="px-3 md:px-6 py-4 text-left text-sm font-semibold text-mountain-700">Betaling</th>
                  <th className="hidden lg:table-cell px-6 py-4 text-left text-sm font-semibold text-mountain-700">Registrert</th>
                  <th className="px-3 md:px-6 py-4 text-left text-sm font-semibold text-mountain-700">Handlingar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-mountain-100">
                {filteredUsers.map((user) => (
                  <>
                  <tr 
                    key={user.id} 
                    className="hover:bg-blue-50 transition-colors cursor-pointer group"
                    onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)}
                  >
                    <td className="px-3 md:px-6 py-4 w-8 md:w-12">
                      <div className="text-primary-600 group-hover:text-primary-700 transition-colors">
                        {expandedUser === user.id ? (
                          <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
                        ) : (
                          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                        )}
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <div>
                        <p className="font-semibold text-mountain-900 text-sm md:text-base">{user.name}</p>
                        <div className="flex items-center gap-2 text-xs md:text-sm text-mountain-600 mt-1">
                          <Shirt className="w-3 h-3" />
                          <span>{user.tshirtSize}</span>
                        </div>
                        {/* Vis kontaktinfo på mobil */}
                        <div className="md:hidden mt-2 space-y-1 text-xs text-mountain-600">
                          <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            <a href={`mailto:${user.email}`} className="hover:text-primary-600 truncate">
                              {user.email}
                            </a>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="hidden md:table-cell px-6 py-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2 text-mountain-600">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${user.email}`} className="hover:text-primary-600">
                            {user.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 text-mountain-600">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${user.phone}`} className="hover:text-primary-600">
                            {user.phone}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-mountain-200 rounded-full h-2 w-24">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all"
                            style={{ width: `${(user.submissions.length / 7) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-mountain-700">
                          {user.submissions.length}/7
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.completedAt ? (
                        <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                          <CheckCircle2 className="w-4 h-4" />
                          Fullført
                        </div>
                      ) : user.submissions.length > 0 ? (
                        <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                          <Clock className="w-4 h-4" />
                          I gang
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 bg-mountain-100 text-mountain-600 px-3 py-1 rounded-full text-sm font-semibold">
                          Ikkje starta
                        </div>
                      )}
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      {user.hasPaid ? (
                        <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold">
                          <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="hidden sm:inline">Betalt</span>
                          <span className="sm:hidden">✓</span>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm(`Godkjenn betaling for ${user.name}?`)) {
                              handleApprovePayment(user.id, true)
                            }
                          }}
                          className="inline-flex items-center gap-1 bg-orange-100 hover:bg-orange-200 text-orange-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold transition-all"
                        >
                          <DollarSign className="w-3 h-3 md:w-4 md:h-4" />
                          <span className="hidden sm:inline">Godkjenn</span>
                          <span className="sm:hidden">$</span>
                        </button>
                      )}
                    </td>
                    <td className="hidden lg:table-cell px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-mountain-600">
                        <Calendar className="w-4 h-4" />
                        {formatDate(new Date(user.createdAt))}
                      </div>
                      {user.completedAt && (
                        <div className="text-xs text-green-600 mt-1">
                          Fullført: {formatDate(new Date(user.completedAt))}
                        </div>
                      )}
                    </td>
                    <td className="px-3 md:px-6 py-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteUser(user.id, user.name)
                        }}
                        className="inline-flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-800 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-semibold transition-all"
                        title="Slett brukar"
                      >
                        <XCircle className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">Slett</span>
                      </button>
                    </td>
                  </tr>
                  {expandedUser === user.id && (
                    <tr className="bg-blue-50/50">
                      <td></td>
                      <td colSpan={7} className="px-3 md:px-6 py-4">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-mountain-900 mb-3 flex items-center gap-2">
                            <Mountain className="w-5 h-5 text-primary-600" />
                            Fullførte fjell ({user.submissions.length}/7):
                          </h4>
                          {user.submissions.length === 0 ? (
                            <p className="text-mountain-500 italic">Har ikkje registrert nokon fjellturar enno</p>
                          ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {user.submissions.map((submission: any) => (
                              <div key={submission.id} className="bg-white p-4 rounded-lg border border-mountain-200 hover:shadow-md transition-shadow">
                                {/* Bilde */}
                                {submission.imagePath && (
                                  <div className="mb-3 rounded-lg overflow-hidden">
                                    <NextImage 
                                      src={submission.imagePath} 
                                      alt={`${submission.peak.name} - ${user.name}`}
                                      width={400}
                                      height={300}
                                      className="w-full h-40 md:h-48 object-cover hover:scale-105 transition-transform cursor-pointer"
                                      onClick={() => window.open(submission.imagePath, '_blank')}
                                    />
                                  </div>
                                )}
                                
                                {/* Info */}
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <p className="font-semibold text-mountain-900 flex items-center gap-2">
                                      <Mountain className="w-4 h-4 text-primary-600" />
                                      {submission.peak.name}
                                    </p>
                                    <p className="text-sm text-mountain-600">{submission.peak.elevation} moh</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm font-medium text-green-700 flex items-center gap-1 justify-end">
                                      <Calendar className="w-3 h-3" />
                                      {formatDate(new Date(submission.submittedAt))}
                                    </p>
                                    <p className="text-xs text-mountain-500">
                                      Kl. {new Date(submission.submittedAt).toLocaleTimeString('nb-NO', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </div>
                                </div>
                                
                                {/* Notat */}
                                {submission.notes && (
                                  <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-mountain-700 italic border-l-2 border-primary-400">
                                    "{submission.notes}"
                                  </div>
                                )}
                                
                                {/* Bilde-indikator om ikkje bilde er vist */}
                                {!submission.imagePath && (
                                  <div className="flex items-center gap-2 text-sm text-mountain-400 mt-2">
                                    <ImageIcon className="w-4 h-4" />
                                    <span>Ingen bilete lasta opp</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Mountain className="w-16 h-16 text-mountain-300 mx-auto mb-4" />
              <p className="text-mountain-600 font-semibold">Ingen deltakere funne</p>
              <p className="text-mountain-500 text-sm mt-1">Prøv å endre søket eller filteret</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 text-center text-sm text-mountain-600">
          Visar {filteredUsers.length} av {users.length} deltakere
        </div>
      </div>
    </div>
  )
}

