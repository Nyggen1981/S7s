import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sauda Seven Summits',
  description: 'Bestig 7 av Saudas gjevaste topper og få den eksklusive S7S-trøya!',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'S7S',
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: '#1e3a5f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="no">
      <head>
        <link rel="apple-touch-icon" href="/S7S.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}





