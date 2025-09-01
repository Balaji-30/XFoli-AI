import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'XFoli AI - AI-Powered Portfolio Intelligence',
  description: 'Track your stock portfolio with real-time data and get AI-powered insights. Understand the "why" behind daily market moves with intelligent analysis.',
  keywords: ['portfolio tracking', 'AI analysis', 'stock market', 'investment tracking', 'financial insights'],
  authors: [{ name: 'XFoli AI' }],
  openGraph: {
    title: 'XFoli AI - AI-Powered Portfolio Intelligence',
    description: 'Track your stock portfolio with real-time data and get AI-powered insights. Understand the "why" behind daily market moves with intelligent analysis.',
    url: 'https://xfoli-ai.vercel.app',
    siteName: 'XFoli AI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'XFoli AI - AI-Powered Portfolio Intelligence',
    description: 'Track your stock portfolio with real-time data and get AI-powered insights.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  )
}