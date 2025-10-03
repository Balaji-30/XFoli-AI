import Link from "next/link"
import Button from "../components/ui/Button"
import { Timestamp } from "../components/Timestamp"

export default async function MarketingLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div className="flex min-h-screen flex-col">
        <header className="border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-bold text-purple-400">
                XFoli AI
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link
                  href="/features"
                  className="text-sm font-medium hover:text-purple-600"
                >
                  Features
                </Link>
                <Link
                  href="/faq"
                  className="text-sm font-medium hover:text-purple-600"
                >
                  FAQ
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-4">
                <Link href="/signin">
                  <Button variant="outline">Sign in</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign up</Button>
                </Link>
              </div>
            </div>
          </div>
        </header>
  
        <main className="flex-1">{children}</main>
  
        <footer className="border-t border-gray-200 dark:border-gray-800 ">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">XFoli AI</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  AI-powered portfolio tracking with real-time market data and intelligent investment insights.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-4">Product</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/features"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600"
                    >
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/faq"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600"
                    >
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/docs"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600"
                    >
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://github.com/Balaji-30/XFoli-AI"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600"
                    >
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/terms"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/disclaimer"
                      className="text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600"
                    >
                      Disclaimer
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 border-t  border-gray-200 dark:border-gray-800  pt-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &copy; <Timestamp /> Xfoli AI. All rights reserved.
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Data provided by <a href="https://finnhub.io" target="_blank" rel="noopener noreferrer" className="hover:text-purple-600 underline">Finnhub</a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    )
  }