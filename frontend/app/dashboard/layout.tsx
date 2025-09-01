'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'

import { apiClient, type Portfolio } from '@/lib/api'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [activePortfolioId, setActivePortfolioId] = useState<number | null>(null)
  const [deletingPortfolioId, setDeletingPortfolioId] = useState<number | null>(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Initialize sidebar state based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) { // mobile breakpoint
        setSidebarCollapsed(true)
      }
    }
    
    // Set initial state
    handleResize()
    
    // Listen for window resize
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const router = useRouter()
  const pathname = usePathname()

  const checkSession = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.access_token) {
        // Store the token if we have a session
        localStorage.setItem('supabase_auth_token', session.access_token)
        console.log('✅ Session found, token updated')
      } else {
        // No session, redirect to signin
        console.log('❌ No session found, redirecting to signin')
        router.push('/signin')
      }
    } catch (error) {
      console.error('Session check error:', error)
      router.push('/signin')
    }
  }, [router])

  const handleDeletePortfolio = async (portfolioId: number, portfolioName: string, event: React.MouseEvent) => {
    // Prevent the link navigation when clicking delete
    event.preventDefault()
    event.stopPropagation()

    // Get holding count for confirmation message
    const portfolio = portfolios.find(p => p.id === portfolioId)
    const holdingCount = portfolio?.holdings?.length || 0
    
    // Enhanced confirmation with holding count
    const confirmMessage = holdingCount > 0 
      ? `Are you sure you want to delete "${portfolioName}"?\n\nThis will permanently delete:\n• The portfolio\n• ${holdingCount} stock holding${holdingCount !== 1 ? 's' : ''}\n\nThis action cannot be undone.`
      : `Are you sure you want to delete "${portfolioName}"?\n\nThis action cannot be undone.`
    
    const confirmed = window.confirm(confirmMessage)
    if (!confirmed) return

    setDeletingPortfolioId(portfolioId)
    
    try {
      const response = await apiClient.deletePortfolio(portfolioId.toString())
      
      if (response.status === 204) {
        console.log('✅ Portfolio deleted successfully')
        
        // Show success feedback (non-blocking)
        if (typeof window !== 'undefined' && window.alert) {
          // Use setTimeout to show success message after state updates
          setTimeout(() => {
            alert(`Portfolio "${portfolioName}" has been successfully deleted.`)
          }, 100)
        }
        
        // If we deleted the currently active portfolio, redirect to dashboard first
        if (activePortfolioId === portfolioId) {
          router.replace('/dashboard')
        }
        
        // Trigger portfolio list refresh
        window.dispatchEvent(new CustomEvent('portfolioCreated'))
        
        // Refresh the portfolio list
        await fetchPortfolios()
        
      } else if (response.status === 403) {
        alert('You are not authorized to delete this portfolio.')
      } else if (response.status === 404) {
        alert('Portfolio not found. It may have already been deleted.')
        // Still refresh the list to sync with server state
        await fetchPortfolios()
      } else {
        alert('Failed to delete portfolio: ' + (response.error || `Server error (${response.status})`))
      }
    } catch (error) {
      console.error('Error deleting portfolio:', error)
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        alert('Cannot connect to server. Please check your internet connection and try again.')
      } else {
        alert('Network error while deleting portfolio. Please try again.')
      }
    } finally {
      setDeletingPortfolioId(null)
    }
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  // Generate consistent color for each portfolio based on its name
  const getPortfolioColor = (portfolioName: string, index: number) => {
    const colors = [
      'bg-gradient-to-br from-purple-500 to-purple-600',
      'bg-gradient-to-br from-blue-500 to-blue-600',
      'bg-gradient-to-br from-green-500 to-green-600',
      'bg-gradient-to-br from-orange-500 to-orange-600',
      'bg-gradient-to-br from-pink-500 to-pink-600',
      'bg-gradient-to-br from-indigo-500 to-indigo-600',
      'bg-gradient-to-br from-teal-500 to-teal-600',
      'bg-gradient-to-br from-red-500 to-red-600',
    ]
    return colors[index % colors.length]
  }

  // Update active portfolio based on current path
  useEffect(() => {
    const portfolioIdMatch = pathname.match(/\/dashboard\/portfolio\/(\d+)/)
    if (portfolioIdMatch) {
      setActivePortfolioId(parseInt(portfolioIdMatch[1]))
    } else {
      setActivePortfolioId(null)
    }
  }, [pathname])

  const fetchPortfolios = useCallback(async () => {
    try {
      const response = await apiClient.getPortfolios()
      
      if (response.data) {
        setPortfolios(response.data)
        
        // If portfolios exist and we're on the main dashboard page, redirect to first portfolio
        if (response.data.length > 0 && pathname === '/dashboard') {
          // Use replace to avoid adding to browser history
          router.replace(`/dashboard/portfolio/${response.data[0].id}`)
        }
      } else {
        console.error('Error fetching portfolios:', response.error)
        setPortfolios([])
      }
    } catch (error) {
      console.error('Error fetching portfolios:', error)
      setPortfolios([])
    } finally {
      setLoading(false)
    }
  }, [pathname, router])

  // Check for Supabase session and fetch portfolios
  useEffect(() => {
    checkSession()
    fetchPortfolios()
  }, [checkSession, fetchPortfolios])

  // Listen for storage events to refresh portfolio list when a new one is created
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'portfolio_created') {
        console.log('🔄 New portfolio created, refreshing sidebar...')
        localStorage.removeItem('portfolio_created') // Clean up
        fetchPortfolios()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [fetchPortfolios])

  // Also listen for custom events in the same window
  useEffect(() => {
    const handlePortfolioCreated = () => {
      console.log('🔄 New portfolio created, refreshing sidebar...')
      fetchPortfolios()
    }

    window.addEventListener('portfolioCreated', handlePortfolioCreated)
    return () => window.removeEventListener('portfolioCreated', handlePortfolioCreated)
  }, [fetchPortfolios])



  const handleLogout = async () => {
    try {
      // Sign out from Supabase
      await supabase.auth.signOut()
      // Remove stored token
      localStorage.removeItem('supabase_auth_token')
      // Redirect to signin
      router.push('/signin')
    } catch (error) {
      console.error('Logout error:', error)
      // Even if Supabase logout fails, clean up locally
      localStorage.removeItem('supabase_auth_token')
      router.push('/signin')
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile backdrop */}
      {!sidebarCollapsed && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        ${sidebarCollapsed ? 'w-16 md:w-16' : 'w-64 md:w-64'} 
        ${sidebarCollapsed ? 'md:translate-x-0 -translate-x-full' : 'translate-x-0'}
        md:translate-x-0 md:relative absolute z-50 h-full
        transition-all duration-300 border-r border-border bg-card flex-shrink-0
      `}>
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="text-muted-foreground hover:text-foreground p-1"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {sidebarCollapsed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                )}
              </svg>
            </Button>
            {!sidebarCollapsed && (
              <h1 className="text-lg font-semibold text-foreground">XFoli AI</h1>
            )}
          </div>
          {!sidebarCollapsed && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
            >
              Logout
            </Button>
          )}
        </div>
        
        <div className="p-4">
          {!sidebarCollapsed && (
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                Portfolios
              </h2>
              <Link href="/dashboard/new">
                <Button size="sm" variant="outline">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  New
                </Button>
              </Link>
            </div>
          )}
          
          {sidebarCollapsed && (
            <div className="mb-4 flex justify-center">
              <Link href="/dashboard/new">
                <Button size="sm" variant="outline" title="New Portfolio">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </Button>
              </Link>
            </div>
          )}
          
          <nav className="space-y-2">
            {portfolios.map((portfolio, index) => (
              <div
                key={portfolio.id}
                className={`group flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} rounded-md transition-colors ${
                  activePortfolioId === portfolio.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Link
                  href={`/dashboard/portfolio/${portfolio.id}`}
                  className={`${sidebarCollapsed ? 'w-8 h-8 flex items-center justify-center' : 'flex-1 px-3 py-2'} text-sm`}
                  title={sidebarCollapsed ? portfolio.name : undefined}
                >
                  {sidebarCollapsed ? (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                      activePortfolioId === portfolio.id
                        ? 'bg-primary-foreground text-primary ring-2 ring-primary'
                        : `${getPortfolioColor(portfolio.name, index)} text-white`
                    }`}>
                      {portfolio.name.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    portfolio.name
                  )}
                </Link>
                {!sidebarCollapsed && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeletePortfolio(portfolio.id, portfolio.name, e)}
                    disabled={deletingPortfolioId === portfolio.id}
                    className={`mr-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                      activePortfolioId === portfolio.id
                        ? 'text-primary-foreground hover:text-primary-foreground hover:bg-primary-foreground/20'
                        : 'text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30'
                    }`}
                    title={`Delete ${portfolio.name}`}
                  >
                    {deletingPortfolioId === portfolio.id ? (
                      <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                    ) : (
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </Button>
                )}
              </div>
            ))}
          </nav>
          
          {portfolios.length === 0 && (
            <div className="text-center py-8">
              <svg className={`${sidebarCollapsed ? 'w-6 h-6' : 'w-12 h-12'} mx-auto text-muted-foreground mb-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2a2 2 0 002 2m0 0h14m-14 0a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2" />
              </svg>
              {!sidebarCollapsed && (
                <p className="text-sm text-muted-foreground">No portfolios yet</p>
              )}
            </div>
          )}
        </div>
        
        {/* Sidebar Footer with Settings */}
        <div className="mt-auto p-4 border-t border-border">
          {!sidebarCollapsed ? (
            <Link href="/dashboard/settings">
              <Button
                variant="ghost"
                className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
                size="sm"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </Button>
            </Link>
          ) : (
            <Link href="/dashboard/settings">
              <Button
                variant="ghost"
                size="sm"
                className="w-full p-2 text-muted-foreground hover:text-foreground hover:bg-accent"
                title="Settings"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </Button>
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* Mobile toggle button */}
        <div className="md:hidden border-b border-border bg-card">
          <div className="flex items-center justify-between p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="text-muted-foreground hover:text-foreground"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Menu
            </Button>
            <h1 className="text-lg font-semibold text-foreground">XFoli AI</h1>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto">
          {children}
        </div>
        
        {/* Footer */}
        <footer className="border-t border-border bg-card flex-shrink-0">
          <div className="px-4 py-3 text-center">
            <p className="text-xs text-muted-foreground">
              <Link href="/disclaimer" className="hover:text-foreground underline">
                ⚠️ Important Disclaimer
              </Link>
              {" - Not financial advice. For educational purposes only."}
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}