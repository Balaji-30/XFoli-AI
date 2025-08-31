import Link from 'next/link'
import { Suspense } from 'react'

function AuthCodeErrorContent() {
  // Note: useSearchParams requires Suspense boundary
  let errorCode = ''
  let errorDescription = ''
  
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search)
    errorCode = params.get('error') || ''
    errorDescription = params.get('description') || ''
  }

  // Determine specific error message and suggestions based on error type
  const getErrorDetails = () => {
    switch (errorCode) {
      case 'no_session':
        return {
          title: 'Email Link Already Used',
          message: 'This confirmation link has already been used or has expired.',
          suggestions: [
            'The link has already been used to confirm your email',
            'The link has expired (usually after 24 hours)',
            'You may already be able to sign in with your account'
          ],
          primaryAction: { text: 'Try signing in', href: '/signin' },
          secondaryAction: { text: 'Request new confirmation', href: '/signup' }
        }
      case 'auth_error':
        return {
          title: 'Authentication Error',
          message: errorDescription || 'There was an error confirming your email address.',
          suggestions: [
            'The confirmation link may be invalid',
            'There was a temporary server issue',
            'Your account may already be confirmed'
          ],
          primaryAction: { text: 'Try signing in', href: '/signin' },
          secondaryAction: { text: 'Contact support', href: '/signup' }
        }
      case 'no_code':
        return {
          title: 'Invalid Confirmation Link',
          message: 'The confirmation link format is invalid.',
          suggestions: [
            'The link may have been copied incorrectly',
            'The link may be from an old email',
            'Try clicking the link directly from your email'
          ],
          primaryAction: { text: 'Request new link', href: '/signup' },
          secondaryAction: { text: 'Back to sign in', href: '/signin' }
        }
      default:
        return {
          title: 'Email Confirmation Error',
          message: errorDescription || "Sorry, we weren't able to confirm your email address.",
          suggestions: [
            'The confirmation link has expired',
            'The link has already been used',
            'There was a technical issue'
          ],
          primaryAction: { text: 'Try signing up again', href: '/signup' },
          secondaryAction: { text: 'Back to sign in', href: '/signin' }
        }
    }
  }

  const errorDetails = getErrorDetails()

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {errorDetails.title}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {errorDetails.message}
          </p>
        </div>
        
        <div className="rounded-md bg-yellow-50 dark:bg-yellow-900/20 p-4">
          <div className="text-sm text-yellow-700 dark:text-yellow-400">
            <p className="font-medium">This could happen if:</p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              {errorDetails.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-4">
          <Link
            href={errorDetails.primaryAction.href}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {errorDetails.primaryAction.text}
          </Link>
          
          <Link
            href={errorDetails.secondaryAction.href}
            className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {errorDetails.secondaryAction.text}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AuthCodeError() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    }>
      <AuthCodeErrorContent />
    </Suspense>
  )
} 