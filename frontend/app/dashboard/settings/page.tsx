'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { apiClient } from '@/lib/api'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

interface AccountDataSummary {
  portfolios_count: number
  total_holdings: number
  portfolio_details: Array<{
    name: string
    holdings_count: number
    created_at: number
  }>
  warning: string
}

export default function SettingsPage() {
  const [accountData, setAccountData] = useState<AccountDataSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetchAccountData()
  }, [])

  const fetchAccountData = async () => {
    try {
      const response = await apiClient.getAccountDataSummary()
      if (response.data) {
        setAccountData(response.data)
      }
    } catch (error) {
      console.error('Error fetching account data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE MY ACCOUNT') {
      alert('Please type "DELETE MY ACCOUNT" exactly to confirm deletion.')
      return
    }

    // Final confirmation
    const finalConfirm = window.confirm(
      '⚠️ FINAL WARNING ⚠️\n\nThis will permanently delete your XFoli AI account and ALL your data:\n\n' +
      `• ${accountData?.portfolios_count || 0} portfolios\n` +
      `• ${accountData?.total_holdings || 0} stock holdings\n` +
      '• All historical data and preferences\n\n' +
      'This action CANNOT be undone. Are you absolutely sure?'
    )

    if (!finalConfirm) return

    setDeleting(true)

    try {
      // Delete application data first
      const deleteResponse = await apiClient.deleteAccount()
      
      if (deleteResponse.status === 204) {
        console.log('✅ Application data deleted successfully')
        
        // Backend handles both application data and Supabase user deletion
        console.log('✅ Account and user data deleted successfully')
        
        // Sign out and redirect
        await supabase.auth.signOut()
        localStorage.clear()
        
        alert('Your account has been permanently deleted. You will now be redirected to the homepage.')
        router.push('/')
        
      } else {
        throw new Error(deleteResponse.error || 'Failed to delete account data')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Failed to delete account. Please try again or contact support.')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your XFoli AI account preferences and data
        </p>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Your current account data and usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {accountData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">Portfolios</h3>
                  <p className="text-2xl font-bold text-purple-600">{accountData.portfolios_count}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 dark:text-white">Total Holdings</h3>
                  <p className="text-2xl font-bold text-purple-600">{accountData.total_holdings}</p>
                </div>
              </div>
              
              {accountData.portfolio_details.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Your Portfolios:</h4>
                  <div className="space-y-2">
                    {accountData.portfolio_details.map((portfolio, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded">
                        <span className="font-medium">{portfolio.name}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {portfolio.holdings_count} holdings
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-800">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions that will permanently affect your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showDeleteConfirm ? (
            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div>
                <h3 className="font-medium text-red-900 dark:text-red-200">Delete Account</h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Permanently delete your account and all associated data
                </p>
              </div>
              <Button 
                variant="outline" 
                className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/30"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </Button>
            </div>
          ) : (
            <div className="space-y-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div>
                <h3 className="font-medium text-red-900 dark:text-red-200 mb-2">⚠️ Confirm Account Deletion</h3>
                <div className="text-sm text-red-700 dark:text-red-300 space-y-2">
                  <p><strong>This will permanently delete:</strong></p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>{accountData?.portfolios_count || 0} portfolios</li>
                    <li>{accountData?.total_holdings || 0} stock holdings</li>
                    <li>All historical data and preferences</li>
                    <li>Your user account and login credentials</li>
                  </ul>
                  <p className="font-medium">This action cannot be undone.</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-red-900 dark:text-red-200 mb-2">
                  Type &ldquo;DELETE MY ACCOUNT&rdquo; to confirm:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full px-3 py-2 border border-red-300 dark:border-red-700 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white"
                  placeholder="DELETE MY ACCOUNT"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setConfirmText('')
                  }}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDeleteAccount}
                  disabled={deleting || confirmText !== 'DELETE MY ACCOUNT'}
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting Account...
                    </>
                  ) : (
                    'Permanently Delete Account'
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 