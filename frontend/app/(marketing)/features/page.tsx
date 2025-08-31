export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="space-y-16">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            Powerful Features for
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-600"> Smart Investing</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            XFoli AI combines real-time portfolio tracking with advanced AI analysis to give you 
            professional-grade insights into your investment performance.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* AI-Powered Analysis */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              ✨ AI Portfolio Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get intelligent, narrative explanations of your portfolio's daily performance with AI-powered insights 
              that analyze market trends, biggest movers, and provide actionable recommendations.
            </p>
          </div>

          {/* Real-time Tracking */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              📊 Real-time Portfolio Tracking
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor your investments with live market data, real-time price updates, and instant 
              portfolio value calculations. See your holdings update as markets move.
            </p>
          </div>

          {/* Smart Dashboard */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              🎯 Intuitive Dashboard
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Clean, modern interface that displays all your portfolio metrics at a glance. 
              View total value, day changes, and individual stock performance in an organized layout.
            </p>
          </div>

          {/* Multi-Portfolio Management */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2a2 2 0 002 2m0 0h14m-14 0a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              📁 Multi-Portfolio Management
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Create and manage multiple portfolios for different investment strategies. 
              Track your retirement fund, growth stocks, and dividend portfolio separately.
            </p>
          </div>

          {/* Advanced Sorting */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              🔍 Advanced Sorting & Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Sort your holdings by any metric - performance, value, quantity, or company name. 
              Quickly identify your best and worst performers with smart table controls.
            </p>
          </div>

          {/* Security & Privacy */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              🔒 Secure & Private
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Bank-level security with Supabase authentication. Your portfolio data is encrypted 
              and only accessible to you. We never store your brokerage credentials.
            </p>
          </div>
        </div>

        {/* Detailed Feature Sections */}
        <div className="space-y-24">
          {/* AI Analysis Deep Dive */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 text-sm font-medium rounded-full">
                ✨ AI-Powered
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Smart Portfolio Analysis That Speaks Your Language
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Our AI doesn't just show you numbers—it explains what they mean. Get clear, 
                narrative explanations of your portfolio's performance with insights that help 
                you make better investment decisions.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Daily Performance Analysis</h4>
                    <p className="text-gray-600 dark:text-gray-400">Understand what drove your portfolio's performance today</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Biggest Mover Insights</h4>
                    <p className="text-gray-600 dark:text-gray-400">Deep analysis of your top performers and their impact</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Actionable Recommendations</h4>
                    <p className="text-gray-600 dark:text-gray-400">Get specific suggestions for portfolio optimization</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-8 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                <div className="text-sm font-medium text-purple-600 dark:text-purple-400">AI Analysis Sample:</div>
                <div className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                  <strong>Daily Performance Analysis:</strong><br/>
                  Today's portfolio showed a strong gain of +2.3% ($1,240), primarily driven by your NVDA position which surged 8.7% on strong earnings...
                  <br/><br/>
                  <strong>Biggest Mover Spotlight:</strong><br/>
                  NVDA was your top performer, adding $980 to your portfolio value. The rally was fueled by better-than-expected Q4 results...
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Features */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 lg:order-1">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">$127,432.18</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Portfolio Value</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600 dark:text-green-400">+2.4%</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Day Change</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">15</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">Holdings</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">AAPL</span>
                    <span className="text-green-600 dark:text-green-400">+1.2%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">MSFT</span>
                    <span className="text-green-600 dark:text-green-400">+0.8%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">GOOGL</span>
                    <span className="text-red-600 dark:text-red-400">-0.3%</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6 lg:order-2">
              <div className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-sm font-medium rounded-full">
                📊 Real-time Data
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Live Market Data at Your Fingertips
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Stay connected to the markets with real-time price updates, instant portfolio 
                calculations, and live performance tracking. Never miss a market move that 
                affects your investments.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Live Price Updates</h4>
                    <p className="text-gray-600 dark:text-gray-400">Real-time stock prices from reliable financial data providers</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Instant Calculations</h4>
                    <p className="text-gray-600 dark:text-gray-400">Portfolio values update automatically as markets move</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Performance Tracking</h4>
                    <p className="text-gray-600 dark:text-gray-400">Monitor daily changes and overall portfolio performance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-12 rounded-2xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Investment Tracking?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Join thousands of investors who use XFoli AI to make smarter investment decisions 
            with real-time data and AI-powered insights.
          </p>
          <div className="flex justify-center">
            <a 
              href="/signup" 
              className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
            >
              Start Tracking for Free
            </a>
          </div>
        </div>
      </div>
    </div>
  )
} 