// API utility for backend communication
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Request deduplication cache
const pendingRequests = new Map<string, Promise<any>>()

interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
}

interface Portfolio {
  id: number
  name: string
  user_id: string
  holdings?: Holding[]
  total_value?: number
  total_day_change_percent?: number
  total_day_change?: number
}

interface Holding {
  id: number
  ticker: string
  quantity: number
  stock_name?: string
  current_price?: number
  current_value?: number
  day_change_percent?: number
  total_day_change?: number
}

interface PortfolioCreate {
  name: string
}

interface HoldingCreate {
  ticker: string
  quantity: number
}

interface SupportedStock {
  ticker: string
  name: string
}

class ApiClient {
  private getAuthHeaders(): HeadersInit {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('supabase_auth_token') 
      : null
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    // Include Authorization header if we have a valid token
    if (token && token !== 'null' && token.trim() !== '') {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    return headers
  }

  private getCacheKey(endpoint: string, options: RequestInit = {}): string {
    const method = options.method || 'GET'
    const body = options.body || ''
    return `${method}:${endpoint}:${body}`
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Check for pending duplicate requests
    const cacheKey = this.getCacheKey(endpoint, options)
    if (pendingRequests.has(cacheKey)) {
      return pendingRequests.get(cacheKey)
    }

    const requestPromise = this.executeRequest<T>(endpoint, options)
    
    // Cache the promise to prevent duplicate requests
    pendingRequests.set(cacheKey, requestPromise)
    
    try {
      const result = await requestPromise
      return result
    } finally {
      // Clean up the cache after request completes
      pendingRequests.delete(cacheKey)
    }
  }

  private async executeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          ...this.getAuthHeaders(),
          ...options.headers,
        },
      })

      // Handle different response types
      let data = null
      const contentType = response.headers.get('content-type')
      const hasContent = response.status !== 204 && response.status !== 304

      if (hasContent && contentType?.includes('application/json')) {
        try {
          data = await response.json()
        } catch (jsonError) {
          // If JSON parsing fails but response was successful, continue without data
          console.warn('Failed to parse JSON response:', jsonError)
          data = null
        }
      }

      if (!response.ok) {
        return {
          error: data?.detail || `HTTP error ${response.status}`,
          status: response.status,
        }
      }

      return {
        data,
        status: response.status,
      }
    } catch (error) {
      console.error('API request failed:', error)
      
      // Check if it's a connection error (backend not running)
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return {
          error: `Backend server not running. Please start the backend server:\n\n1. Open terminal in backend folder\n2. Run: python run_dev.py\n3. Ensure it's running on ${API_BASE_URL}`,
          status: 0,
        }
      }
      
      return {
        error: 'Network error. Please check your connection.',
        status: 0,
      }
    }
  }

  // Portfolio operations
  async getPortfolios(): Promise<ApiResponse<Portfolio[]>> {
    return this.request<Portfolio[]>('/api/portfolios/')
  }

  async createPortfolio(portfolio: PortfolioCreate): Promise<ApiResponse<Portfolio>> {
    return this.request<Portfolio>('/api/portfolios/', {
      method: 'POST',
      body: JSON.stringify(portfolio),
    })
  }

  async getPortfolioDetails(portfolioId: string): Promise<ApiResponse<Portfolio>> {
    return this.request<Portfolio>(`/api/portfolios/${portfolioId}`)
  }

  async deletePortfolio(portfolioId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/portfolios/${portfolioId}`, {
      method: 'DELETE',
    })
  }

  // Holding operations
  async addHolding(portfolioId: string, holding: HoldingCreate): Promise<ApiResponse<Holding>> {
    return this.request<Holding>(`/api/portfolios/${portfolioId}/holdings`, {
      method: 'POST',
      body: JSON.stringify(holding),
    })
  }

  async removeHolding(holdingId: number): Promise<ApiResponse<void>> {
    return this.request<void>(`/api/portfolios/holdings/${holdingId}`, {
      method: 'DELETE',
    })
  }

  async updateHolding(holdingId: number, quantity: number): Promise<ApiResponse<Holding>> {
    return this.request<Holding>(`/api/portfolios/holdings/${holdingId}?quantity=${quantity}`, {
      method: 'PATCH',
    })
  }

  // Search stocks
  async searchStocks(query: string): Promise<ApiResponse<SupportedStock[]>> {
    if (!query.trim()) {
      return { data: [], status: 200 }
    }
    
    const encodedQuery = encodeURIComponent(query.trim())
    return this.request<SupportedStock[]>(`/api/search/stocks/?query=${encodedQuery}`)
  }

  // AI analysis
  async getAiAnalysis(portfolioId: string): Promise<ApiResponse<{ analysis: string }>> {
    return this.request<{ analysis: string }>('/api/agent/explain-performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ portfolio_id: parseInt(portfolioId) }),
    })
  }

  // Account management
  async getAccountDataSummary(): Promise<ApiResponse<{
    portfolios_count: number
    total_holdings: number
    portfolio_details: Array<{
      name: string
      holdings_count: number
      created_at: number
    }>
    warning: string
  }>> {
    return this.request('/api/account/data-summary')
  }

  async deleteAccount(): Promise<ApiResponse<void>> {
    return this.request<void>('/api/account/', {
      method: 'DELETE',
    })
  }
}

export const apiClient = new ApiClient()
export type { Portfolio, Holding, PortfolioCreate, HoldingCreate, SupportedStock } 