'use client'

import { useState, useEffect } from 'react'
import { X, Smartphone, Share, PlusSquare } from 'lucide-react'

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Check if already installed (standalone mode)
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    setIsStandalone(standalone)

    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(iOS)

    // Show prompt after 3 seconds if not installed and not dismissed before
    const dismissed = localStorage.getItem('s7s_install_dismissed')
    if (!standalone && !dismissed) {
      const timer = setTimeout(() => setShowPrompt(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('s7s_install_dismissed', 'true')
  }

  if (!showPrompt || isStandalone) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-white rounded-2xl shadow-2xl border border-mountain-200 p-4 z-50 animate-slide-up">
      <button
        onClick={handleDismiss}
        className="absolute top-2 right-2 text-mountain-400 hover:text-mountain-600"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-start gap-3">
        <div className="bg-primary-100 p-2 rounded-xl">
          <Smartphone className="w-8 h-8 text-primary-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-mountain-800 mb-1">Installer S7S-appen!</h3>
          <p className="text-sm text-mountain-600 mb-3">
            Få rask tilgang frå mobilen din - ingen app store nødvendig!
          </p>

          {isIOS ? (
            <div className="bg-mountain-50 rounded-lg p-3 text-sm">
              <p className="font-medium text-mountain-700 mb-2">Slik gjer du det:</p>
              <ol className="space-y-2 text-mountain-600">
                <li className="flex items-center gap-2">
                  <span className="bg-primary-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">1</span>
                  Trykk på <Share className="w-4 h-4 inline text-primary-600" /> (del-knappen)
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">2</span>
                  Vel "Legg til på Hjem-skjerm" <PlusSquare className="w-4 h-4 inline text-primary-600" />
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">3</span>
                  Trykk "Legg til"
                </li>
              </ol>
            </div>
          ) : (
            <div className="bg-mountain-50 rounded-lg p-3 text-sm">
              <p className="font-medium text-mountain-700 mb-2">Slik gjer du det:</p>
              <ol className="space-y-2 text-mountain-600">
                <li className="flex items-center gap-2">
                  <span className="bg-primary-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">1</span>
                  Trykk på ⋮ (meny) øvst til høgre
                </li>
                <li className="flex items-center gap-2">
                  <span className="bg-primary-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">2</span>
                  Vel "Installer app" eller "Legg til på startskjerm"
                </li>
              </ol>
            </div>
          )}

          <button
            onClick={handleDismiss}
            className="mt-3 text-sm text-mountain-500 hover:text-mountain-700"
          >
            Ikkje vis igjen
          </button>
        </div>
      </div>
    </div>
  )
}

