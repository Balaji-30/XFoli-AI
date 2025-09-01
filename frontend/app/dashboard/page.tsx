'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { apiClient } from '@/lib/api'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [shouldShowEmpty, setShouldShowEmpty] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Quick check to see if we should redirect or show empty state
    const checkPortfolios = async () => {
      try {
        const response = await apiClient.getPortfolios()
        if (response.data && response.data.length > 0) {
          // Portfolios exist, redirect immediately
          router.replace(`/dashboard/portfolio/${response.data[0].id}`)
        } else {
          // No portfolios, show empty state
          setShouldShowEmpty(true)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error checking portfolios:', error)
        // On error, show empty state (user can try to create a portfolio)
        setShouldShowEmpty(true)
        setLoading(false)
      }
    }

    // Only run this check if we're actually on the dashboard page
    if (pathname === '/dashboard') {
      checkPortfolios()
    }
  }, [pathname, router])



  if (loading || !shouldShowEmpty) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  // Empty state - no portfolios exist
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="max-w-md w-full">
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <CardTitle className="text-xl">Welcome to XFoli AI</CardTitle>
            <CardDescription className="text-base">
              Start tracking your investments with AI-powered insights
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create your first portfolio to get started with personalized AI analysis of your investment performance.
            </p>
            <div className="space-y-3">
              <Link href="/dashboard/new" className="block">
                <Button size="lg" className="w-full">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create Your First Portfolio
                </Button>
              </Link>
              <div className="text-xs text-muted-foreground">
                It only takes a minute to set up
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Feature highlights */}
        <div className="mt-8 space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground text-center">What you&apos;ll get:</h3>
          <div className="grid gap-3">
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Real-time portfolio tracking</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>AI-powered performance analysis</span>
            </div>
            <div className="flex items-center space-x-3 text-sm">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Market news integration</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}