import Link from "next/link"
import Button from "../../components/ui/Button"
import { Timestamp } from "../../components/Timestamp"

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
              </div>
            </div>
            </div>
            
        
        </header>
  
        <main className="flex-1">{children}</main>
  
        <footer >
          <div className="container mx-auto px-4 py-8">
            <div className="mt-8 border-t pt-8 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                &copy; <Timestamp /> Xfoli AI. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    )
  }