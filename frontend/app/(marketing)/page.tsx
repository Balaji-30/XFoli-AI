import Link from "next/link";
import Button from "../components/ui/Button"

export default async function LandingPage() {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                AI-Powered Portfolio <br className="hidden sm:block" />
                <span className="text-purple-600 dark:text-purple-400">
                  Intelligence
                </span>
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300">
                Go beyond the numbers. Get a clear overview of your stock portfolio and let our AI analyst explain the &apos;why&apos; behind the daily market moves.
              </p>
              <div className="mt-10">
                <Link href="/signup">
                  <Button size="lg">Get Your Analysis</Button>
                </Link>
              </div>
            </div>

            {/* Features Section */}
            <div className="mt-24">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                <div className="text-center">
                  <div className="flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                      <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Performance Snapshot</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Get a clear, up-to-date snapshot of your portfolio&apos;s total value and daily performance. See your gains and losses at a glance.
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                      <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">AI-Generated Narrative</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Our AI agent analyzes your portfolio&apos;s performance and generates a plain-English narrative explaining what happened and why.
                  </p>
                </div>

                <div className="text-center">
                  <div className="flex justify-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                      <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2a2 2 0 002 2m0 0h14m-14 0a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 01-2 2" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">News-Driven Context</h3>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Our agent automatically connects market news to your key holdings, providing the crucial context behind significant price movements.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-24 text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Ready to understand your portfolio?
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Join thousands of investors getting AI-powered insights into their market performance.
              </p>
              <div className="mt-8">
                <Link href="/signup">
                  <Button size="lg">Sign up now!</Button>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }