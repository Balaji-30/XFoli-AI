'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { apiClient } from '@/lib/api'

export default function NewPortfolioPage() {
  const [portfolioName, setPortfolioName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!portfolioName.trim()) {
      setError('Portfolio name is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await apiClient.createPortfolio({
        name: portfolioName.trim(),
      })

      if (response.data) {
        console.log('✅ Portfolio created successfully:', response.data.name)
        
        // Trigger portfolio list refresh in the sidebar
        window.dispatchEvent(new CustomEvent('portfolioCreated'))
        
        // Redirect to the new portfolio
        router.push(`/dashboard/portfolio/${response.data.id}`)
      } else {
        setError(response.error || 'Failed to create portfolio')
      }
    } catch (error) {
      console.error('Error creating portfolio:', error)
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Create New Portfolio</CardTitle>
                <CardDescription>
                  Give your portfolio a name to get started
                </CardDescription>
              </div>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <label htmlFor="portfolioName" className="text-sm font-medium text-foreground">
                  Portfolio Name *
                </label>
                <Input
                  id="portfolioName"
                  type="text"
                  placeholder="e.g., My Investment Portfolio"
                  value={portfolioName}
                  onChange={(e) => setPortfolioName(e.target.value)}
                  className="w-full"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Choose a descriptive name for your portfolio
                </p>
              </div>

              <div className="flex gap-3">
                <Link href="/dashboard" className="flex-1">
                  <Button type="button" variant="outline" className="w-full" disabled={loading}>
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="flex-1" disabled={loading || !portfolioName.trim()}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    'Create Portfolio'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Help section */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="text-sm font-medium mb-2">Next Steps</h3>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>1. Create your portfolio</p>
            <p>2. Add your stock holdings</p>
            <p>3. Get AI-powered insights</p>
          </div>
        </div>
      </div>
    </div>
  )
}