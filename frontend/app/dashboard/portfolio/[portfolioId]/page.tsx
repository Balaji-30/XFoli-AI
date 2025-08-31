'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { apiClient, type Portfolio, type Holding, type SupportedStock } from '@/lib/api'

export default function PortfolioDetailPage() {
  const params = useParams()
  const router = useRouter()
  const portfolioId = params.portfolioId as string

  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [showAddHolding, setShowAddHolding] = useState(false)
  const [newTicker, setNewTicker] = useState('')
  const [newQuantity, setNewQuantity] = useState('')
  const [addingHolding, setAddingHolding] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SupportedStock[]>([])
  const [searchLoading, setSearchLoading] = useState(false)
  const [selectedStock, setSelectedStock] = useState<SupportedStock | null>(null)
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false)
  const [aiAnalysisResult, setAiAnalysisResult] = useState('')
  const [aiAnalysisTimestamp, setAiAnalysisTimestamp] = useState<Date | null>(null)
  const [showAiModal, setShowAiModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [editingHoldingId, setEditingHoldingId] = useState<number | null>(null)
  const [editQuantity, setEditQuantity] = useState('')
  const [updatingHolding, setUpdatingHolding] = useState(false)
  const [disclaimerCollapsed, setDisclaimerCollapsed] = useState(false)
  const [disclaimerAutoCollapsed, setDisclaimerAutoCollapsed] = useState(false)
  const [sortField, setSortField] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Simple cache for portfolio data - memoize to prevent recreation on every render
  const portfolioCache = useMemo(() => new Map<string, Portfolio>(), [])

  useEffect(() => {
    if (portfolioId) {
      // Check cache first for instant loading
      const cachedPortfolio = portfolioCache.get(portfolioId)
      if (cachedPortfolio) {
        console.log('📦 Loading cached portfolio data...')
        setPortfolio(cachedPortfolio)
        setLoading(false)
        // Still fetch fresh data in background
        fetchPortfolioDetails(true)
      } else {
        fetchPortfolioDetails(false)
      }
    }
  }, [portfolioId])

  // Auto-collapse disclaimer when AI analysis is generated
  useEffect(() => {
    if (showAiModal && aiAnalysisResult && !aiAnalysisLoading && !disclaimerAutoCollapsed) {
      setDisclaimerCollapsed(true)
      setDisclaimerAutoCollapsed(true)
    }
  }, [showAiModal, aiAnalysisResult, aiAnalysisLoading, disclaimerAutoCollapsed])

  const fetchPortfolioDetails = useCallback(async (isBackgroundRefresh = false) => {
    try {
      if (!isBackgroundRefresh) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }
      
      console.log(isBackgroundRefresh ? '🔄 Refreshing portfolio data...' : '📊 Loading portfolio data...')
      
      const response = await apiClient.getPortfolioDetails(portfolioId)

      if (response.data) {
        setPortfolio(response.data)
        // Cache the fresh data
        portfolioCache.set(portfolioId, response.data)
        console.log('✅ Portfolio data loaded and cached')
      } else if (response.status === 404) {
        router.push('/dashboard')
      } else {
        setError(response.error || 'Failed to load portfolio')
      }
    } catch (error) {
      console.error('Error fetching portfolio:', error)
      setError('Network error')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [portfolioId, router])

  const handleRemoveHolding = async (holdingId: number) => {
    const response = await apiClient.removeHolding(holdingId)
    if (response.data !== undefined) {
      // Refresh portfolio to get updated holdings
      fetchPortfolioDetails(false)
      console.log('✅ Holding removed successfully')
    } else {
      setError(response.error || 'Failed to remove holding')
    }
  }

  // Search functionality
  const searchStocks = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    try {
      const response = await apiClient.searchStocks(query)
      if (response.data) {
        setSearchResults(response.data)
      } else {
        setSearchResults([])
      }
    } catch (error) {
      console.error('Error searching stocks:', error)
      setSearchResults([])
    } finally {
      setSearchLoading(false)
    }
  }, [])

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchStocks(searchQuery)
    }, 300) // 300ms debounce

    return () => clearTimeout(timeoutId)
  }, [searchQuery, searchStocks])

  // Update ticker when search query changes (for manual ticker entry)
  useEffect(() => {
    // If search query looks like a ticker (short, uppercase), set it as ticker
    const trimmedQuery = searchQuery.trim().toUpperCase()
    if (trimmedQuery.length <= 5 && trimmedQuery.match(/^[A-Z]+$/) && searchResults.length === 0) {
      setNewTicker(trimmedQuery)
    } else if (selectedStock) {
      setNewTicker(selectedStock.ticker)
    } else {
      setNewTicker('')
    }
  }, [searchQuery, searchResults, selectedStock])

  const handleStockSelect = (stock: SupportedStock) => {
    setSelectedStock(stock)
    setNewTicker(stock.ticker)
    setSearchQuery(stock.ticker + ' - ' + stock.name)
    setSearchResults([])
  }

  const resetAddStockForm = () => {
    setShowAddHolding(false)
    setNewTicker('')
    setNewQuantity('')
    setSearchQuery('')
    setSearchResults([])
    setSelectedStock(null)
    setError('')
  }

  const handleAddHolding = async (e?: React.FormEvent) => {
    if (e) e.preventDefault() // Handle both form submit and button click
    
    if (!newTicker.trim() || !newQuantity) {
      setError('Please select a stock and enter quantity')
      return
    }

    const quantity = parseFloat(newQuantity)
    if (quantity <= 0) {
      setError('Quantity must be greater than 0')
      return
    }

    setAddingHolding(true)
    setError('')

    try {
      const response = await apiClient.addHolding(portfolioId, {
        ticker: newTicker.trim().toUpperCase(),
        quantity: quantity,
      })

      if (response.data) {
        console.log('✅ Holding added successfully')
        // Refresh portfolio to get updated holdings
        fetchPortfolioDetails(false)
        resetAddStockForm()
      } else {
        setError(response.error || 'Failed to add holding')
      }
    } catch (error) {
      console.error('Error adding holding:', error)
      setError('Network error. Please try again.')
    } finally {
      setAddingHolding(false)
    }
  }

  const handleEditHolding = (holding: Holding) => {
    setEditingHoldingId(holding.id)
    setEditQuantity(holding.quantity.toString())
  }

  const handleCancelEdit = () => {
    setEditingHoldingId(null)
    setEditQuantity('')
  }

  const handleAiAnalysis = async () => {
    setAiAnalysisLoading(true)
    setAiAnalysisResult('') // Clear previous result
    setShowAiModal(true) // Open modal immediately
    setError('')
    // Reset disclaimer state when opening modal
    setDisclaimerCollapsed(false)
    setDisclaimerAutoCollapsed(false)
    
    try {
      const response = await apiClient.getAiAnalysis(portfolioId)

      if (response.data) {
        setAiAnalysisResult(response.data.analysis)
        setAiAnalysisTimestamp(new Date())
      } else {
        setError(response.error || 'AI analysis is not available yet. Please try again later.')
        setShowAiModal(false) // Close modal on error
      }
    } catch (error) {
      console.error('Error during AI analysis:', error)
      setError('Failed to perform AI analysis')
      setShowAiModal(false) // Close modal on error
    } finally {
      setAiAnalysisLoading(false)
    }
  }

  const handleSaveQuantity = async (holdingId: number) => {
    const quantity = parseFloat(editQuantity)
    if (isNaN(quantity) || quantity <= 0) {
      setError('Please enter a valid quantity')
      return
    }

    setUpdatingHolding(true)
    setError('')

    try {
      const response = await apiClient.updateHolding(holdingId, quantity)

      if (response.data) {
        console.log('✅ Holding quantity updated successfully')
        // Invalidate cache and refresh
        portfolioCache.delete(portfolioId)
        await fetchPortfolioDetails()
        setEditingHoldingId(null)
        setEditQuantity('')
      } else {
        setError(response.error || 'Failed to update holding')
      }
    } catch (error) {
      console.error('Error updating holding:', error)
      setError('Network error')
    } finally {
      setUpdatingHolding(false)
    }
  }

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const formatPercent = (value?: number) => {
    if (value === undefined || value === null) return 'N/A'
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const handleSort = useCallback((field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }, [sortField, sortDirection])

  const getSortedHoldings = useCallback((holdings: Holding[]) => {
    if (!sortField) return holdings

    return [...holdings].sort((a, b) => {
      let aValue: any, bValue: any

      switch (sortField) {
        case 'symbol':
          aValue = a.ticker
          bValue = b.ticker
          break
        case 'company':
          aValue = a.stock_name || ''
          bValue = b.stock_name || ''
          break
        case 'quantity':
          aValue = a.quantity
          bValue = b.quantity
          break
        case 'price':
          aValue = a.current_price || 0
          bValue = b.current_price || 0
          break
        case 'value':
          aValue = a.current_value || 0
          bValue = b.current_value || 0
          break
        case 'dayChangePercent':
          aValue = a.day_change_percent || 0
          bValue = b.day_change_percent || 0
          break
        case 'dayChangeDollar':
          aValue = a.total_day_change || 0
          bValue = b.total_day_change || 0
          break
        default:
          return 0
      }

      if (typeof aValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      } else {
        return sortDirection === 'asc' 
          ? aValue - bValue
          : bValue - aValue
      }
    })
  }, [sortField, sortDirection])



  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!portfolio) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Portfolio not found</h2>
          <Button onClick={() => router.push('/dashboard')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      {/* Portfolio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold">{portfolio.name}</h1>
          {refreshing && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
              <span className="hidden sm:inline">Updating...</span>
            </div>
          )}
        </div>
        <div className="flex gap-2 self-start sm:self-auto">
          <Button
            onClick={handleAiAnalysis}
            disabled={aiAnalysisLoading || (portfolio.holdings?.length || 0) === 0}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white flex-1 sm:flex-none"
            size="sm"
          >
            {aiAnalysisLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                <span className="hidden sm:inline">Analyzing...</span>
                <span className="sm:hidden">...</span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline">✨ AI Analysis</span>
                <span className="sm:hidden">✨ AI</span>
              </>
            )}
          </Button>
          <Button
            onClick={() => fetchPortfolioDetails(true)}
            variant="outline"
            size="sm"
            disabled={refreshing}
            className="flex-1 sm:flex-none"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button 
            onClick={() => setShowAddHolding(true)}
            className="flex-1 sm:flex-none"
            size="sm"
          >
            Add Stock
          </Button>
        </div>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(portfolio.total_value)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Day Change</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              (portfolio.total_day_change_percent || 0) >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {formatPercent(portfolio.total_day_change_percent)}
            </div>
            {portfolio.total_day_change !== undefined && (
              <div className={`text-sm font-medium ${
                (portfolio.total_day_change || 0) >= 0 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {formatCurrency(portfolio.total_day_change)}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Holdings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {portfolio.holdings?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Active positions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
          {error}
        </div>
      )}



      {/* Holdings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
          <CardDescription>
            Your current stock positions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!portfolio.holdings || portfolio.holdings.length === 0 ? (
            <div className="text-center py-8">
              <svg className="w-12 h-12 mx-auto text-muted-foreground mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-muted-foreground mb-4">No holdings yet</p>
              <Button onClick={() => setShowAddHolding(true)}>
                Add Your First Stock
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Mobile Card Layout */}
              <div className="block md:hidden space-y-4">
                {getSortedHoldings(portfolio.holdings || []).map((holding) => (
                  <Card key={holding.id} className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{holding.ticker}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{holding.stock_name || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">
                          {editingHoldingId === holding.id ? (
                            <Input
                              type="number"
                              step="0.01"
                              min="0.01"
                              value={editQuantity}
                              onChange={(e) => setEditQuantity(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSaveQuantity(holding.id)
                                } else if (e.key === 'Escape') {
                                  handleCancelEdit()
                                }
                              }}
                              className="w-20 text-right [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0"
                              style={{ MozAppearance: 'textfield' }}
                              disabled={updatingHolding}
                              autoFocus
                            />
                          ) : (
                            `${holding.quantity} shares`
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(holding.current_value)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(holding.current_price)} per share
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mb-3">
                      <div className="space-y-1">
                        <div className={`text-sm font-medium ${
                          (holding.day_change_percent || 0) >= 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {formatPercent(holding.day_change_percent)}
                        </div>
                        <div className={`text-sm ${
                          (holding.total_day_change || 0) >= 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {formatCurrency(holding.total_day_change)}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {editingHoldingId === holding.id ? (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSaveQuantity(holding.id)}
                              disabled={updatingHolding}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              {updatingHolding ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                              ) : (
                                'Save'
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={handleCancelEdit}
                              disabled={updatingHolding}
                              className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                            >
                              Cancel
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditHolding(holding)}
                              className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveHolding(holding.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                              Remove
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-2">
                        <button 
                          onClick={() => handleSort('symbol')} 
                          className="flex items-center gap-1 hover:text-purple-600 transition-colors"
                        >
                          Symbol
                          <svg className={`w-4 h-4 transition-transform ${sortField === 'symbol' ? (sortDirection === 'asc' ? 'rotate-0' : 'rotate-180') : 'opacity-50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                      </th>
                      <th className="text-left py-3 px-2">
                        <button 
                          onClick={() => handleSort('company')} 
                          className="flex items-center gap-1 hover:text-purple-600 transition-colors"
                        >
                          Company
                          <svg className={`w-4 h-4 transition-transform ${sortField === 'company' ? (sortDirection === 'asc' ? 'rotate-0' : 'rotate-180') : 'opacity-50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                      </th>
                      <th className="text-right py-3 px-2">
                        <button 
                          onClick={() => handleSort('quantity')} 
                          className="flex items-center gap-1 hover:text-purple-600 transition-colors ml-auto"
                        >
                          Quantity
                          <svg className={`w-4 h-4 transition-transform ${sortField === 'quantity' ? (sortDirection === 'asc' ? 'rotate-0' : 'rotate-180') : 'opacity-50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                      </th>
                      <th className="text-right py-3 px-2">
                        <button 
                          onClick={() => handleSort('price')} 
                          className="flex items-center gap-1 hover:text-purple-600 transition-colors ml-auto"
                        >
                          Price
                          <svg className={`w-4 h-4 transition-transform ${sortField === 'price' ? (sortDirection === 'asc' ? 'rotate-0' : 'rotate-180') : 'opacity-50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                      </th>
                      <th className="text-right py-3 px-2">
                        <button 
                          onClick={() => handleSort('value')} 
                          className="flex items-center gap-1 hover:text-purple-600 transition-colors ml-auto"
                        >
                          Value
                          <svg className={`w-4 h-4 transition-transform ${sortField === 'value' ? (sortDirection === 'asc' ? 'rotate-0' : 'rotate-180') : 'opacity-50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                      </th>
                      <th className="text-right py-3 px-2">
                        <button 
                          onClick={() => handleSort('dayChangePercent')} 
                          className="flex items-center gap-1 hover:text-purple-600 transition-colors ml-auto"
                        >
                          Day Change %
                          <svg className={`w-4 h-4 transition-transform ${sortField === 'dayChangePercent' ? (sortDirection === 'asc' ? 'rotate-0' : 'rotate-180') : 'opacity-50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                      </th>
                      <th className="text-right py-3 px-2">
                        <button 
                          onClick={() => handleSort('dayChangeDollar')} 
                          className="flex items-center gap-1 hover:text-purple-600 transition-colors ml-auto"
                        >
                          Day Change $
                          <svg className={`w-4 h-4 transition-transform ${sortField === 'dayChangeDollar' ? (sortDirection === 'asc' ? 'rotate-0' : 'rotate-180') : 'opacity-50'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                      </th>
                      <th className="text-right py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getSortedHoldings(portfolio.holdings || []).map((holding) => (
                      <tr key={holding.id} className="border-b hover:bg-muted/50">
                        <td className="py-4 px-2 font-medium">{holding.ticker}</td>
                        <td className="py-4 px-2 text-sm text-muted-foreground">{holding.stock_name || 'N/A'}</td>
                        <td className="text-right py-4 px-2">
                          {editingHoldingId === holding.id ? (
                            <Input
                              type="number"
                              step="0.01"
                              min="0.01"
                              value={editQuantity}
                              onChange={(e) => setEditQuantity(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSaveQuantity(holding.id)
                                } else if (e.key === 'Escape') {
                                  handleCancelEdit()
                                }
                              }}
                              className="w-20 text-right [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0"
                              style={{ MozAppearance: 'textfield' }}
                              disabled={updatingHolding}
                              autoFocus
                            />
                          ) : (
                            holding.quantity
                          )}
                        </td>
                        <td className="text-right py-4 px-2">
                          {formatCurrency(holding.current_price)}
                        </td>
                        <td className="text-right py-4 px-2">
                          {formatCurrency(holding.current_value)}
                        </td>
                        <td className={`text-right py-4 px-2 ${
                          (holding.day_change_percent || 0) >= 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {formatPercent(holding.day_change_percent)}
                        </td>
                        <td className={`text-right py-4 px-2 ${
                          (holding.total_day_change || 0) >= 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {formatCurrency(holding.total_day_change)}
                        </td>
                        <td className="text-right py-4 px-2">
                          {editingHoldingId === holding.id ? (
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSaveQuantity(holding.id)}
                                disabled={updatingHolding}
                                className="text-green-600 hover:text-green-700 hover:bg-green-50"
                              >
                                {updatingHolding ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                ) : (
                                  'Save'
                                )}
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleCancelEdit}
                                disabled={updatingHolding}
                                className="text-gray-600 hover:text-gray-700 hover:bg-gray-50"
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditHolding(holding)}
                                className="text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Edit</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveHolding(holding.id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Remove</span>
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Holding Dialog */}
      <Dialog open={showAddHolding} onOpenChange={setShowAddHolding}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Stock to Portfolio</DialogTitle>
            <DialogDescription>
              Search for a stock by ticker or company name, then enter the number of shares you own
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-900/30 dark:text-red-400 dark:border-red-800">
                {error}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label htmlFor="stock-search" className="block text-sm font-medium mb-2">
                  Stock Search
                </label>
                <div className="relative">
                  <Input
                    id="stock-search"
                    type="text"
                    placeholder="Search by ticker (e.g., AAPL) or company name (e.g., Apple)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    disabled={addingHolding}
                    className="pr-10"
                  />
                  {searchLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                    </div>
                  )}
                </div>
                
                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 shadow-lg max-h-48 overflow-y-auto">
                    {searchResults.map((stock) => (
                      <button
                        key={stock.ticker}
                        onClick={() => handleStockSelect(stock)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 focus:outline-none focus:bg-blue-50 dark:focus:bg-blue-900/20"
                        disabled={addingHolding}
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-sm">{stock.ticker}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate ml-2">
                            {stock.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                
                {/* Selected Stock Display */}
                {selectedStock && (
                  <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-sm">{selectedStock.ticker}</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                          {selectedStock.name}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedStock(null)
                          setNewTicker('')
                          setSearchQuery('')
                        }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        disabled={addingHolding}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Manual Ticker Entry Display */}
                {!selectedStock && newTicker && searchResults.length === 0 && (
                  <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium text-sm">{newTicker}</span>
                        <span className="text-xs text-yellow-600 dark:text-yellow-400 ml-2">
                          Manual ticker entry
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setNewTicker('')
                          setSearchQuery('')
                        }}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                        disabled={addingHolding}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium mb-2">
                  Number of Shares
                </label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="e.g., 10"
                  value={newQuantity}
                  onChange={(e) => setNewQuantity(e.target.value)}
                  disabled={addingHolding}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button 
              variant="outline" 
              onClick={resetAddStockForm}
              disabled={addingHolding}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddHolding}
              disabled={addingHolding || !newTicker.trim() || !newQuantity}
            >
              {addingHolding ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Adding...
                </>
              ) : (
                'Add Stock'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* AI Analysis Modal */}
      <Dialog open={showAiModal} onOpenChange={setShowAiModal}>
        <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto w-full">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Portfolio Analysis
            </DialogTitle>
            <DialogDescription>
              Professional insights and recommendations for your portfolio
            </DialogDescription>
          </DialogHeader>

          {/* Collapsible Disclaimer at the top */}
          <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg overflow-hidden transition-all duration-300">
            {/* Disclaimer Header - Always Visible */}
            <div 
              className="p-3 flex items-center justify-between cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
              onClick={() => setDisclaimerCollapsed(!disclaimerCollapsed)}
            >
              <div className="flex items-center space-x-3">
                <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
                  Important Disclaimer
                </h3>
                {disclaimerCollapsed && (
                  <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                    - Not financial advice
                  </span>
                )}
              </div>
              <button className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors">
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${disclaimerCollapsed ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
            
            {/* Disclaimer Content - Collapsible */}
            {!disclaimerCollapsed && (
              <div className="px-3 pb-4 pt-1 border-t border-yellow-200 dark:border-yellow-800">
                                 <p className="text-sm text-yellow-700 dark:text-yellow-300 leading-relaxed">
                   This analysis is AI-generated and for <strong>informational purposes only</strong>. It is <strong>not financial advice</strong>. 
                   Market data may be delayed or inaccurate. Always conduct your own research and consult with a qualified 
                   financial advisor before making any investment decisions.
                 </p>
                 {!disclaimerAutoCollapsed && (
                   <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2 italic">
                     This disclaimer will collapse once the analysis is generated. Click to expand/collapse anytime.
                   </p>
                 )}
              </div>
            )}
          </div>
          
          <div className="mt-6">
            {aiAnalysisLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Generating AI analysis...</p>
                </div>
              </div>
            ) : aiAnalysisResult ? (
              <div className="space-y-4">
                {aiAnalysisTimestamp && (
                  <div className="text-xs text-muted-foreground text-right">
                    Generated at {aiAnalysisTimestamp.toLocaleString()}
                  </div>
                )}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-lg border">
                  <div className="whitespace-pre-wrap text-base leading-relaxed font-sans text-gray-800 dark:text-gray-200">
                    {aiAnalysisResult}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <svg className="w-12 h-12 text-muted-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p className="text-muted-foreground">No analysis available</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={() => setShowAiModal(false)}
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                navigator.clipboard.writeText(aiAnalysisResult)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
              disabled={!aiAnalysisResult}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Analysis
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
