import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error_code = searchParams.get('error')
  const error_description = searchParams.get('error_description')
  
  // Enhanced logging for debugging
  console.log('🔍 Auth callback received:', {
    origin,
    hasCode: !!code,
    codeLength: code?.length,
    errorCode: error_code,
    errorDescription: error_description,
    fullUrl: request.url
  })
  
  // Check for URL-level errors first (e.g., expired links)
  if (error_code) {
    console.log('❌ Auth callback URL error:', error_code, error_description)
    return NextResponse.redirect(`${origin}/auth/auth-code-error?error=${error_code}&description=${encodeURIComponent(error_description || '')}`)
  }

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      // Enhanced logging for debugging
      console.log('🔍 exchangeCodeForSession result:', {
        hasError: !!error,
        errorMessage: error?.message,
        hasData: !!data,
        hasSession: !!data?.session,
        hasUser: !!data?.user,
        userId: data?.user?.id,
        userEmail: data?.user?.email,
        userConfirmedAt: data?.user?.email_confirmed_at,
        sessionAccessToken: data?.session?.access_token ? 'present' : 'missing'
      })
      
      // Check if we have both no error AND a valid session
      if (!error && data?.session && data?.user) {
        console.log('✅ Email confirmation successful for user:', data.user.email)
        
        const forwardedHost = request.headers.get('x-forwarded-host')
        const isLocalEnv = process.env.NODE_ENV === 'development'
        
        // Determine redirect URL
        let redirectUrl: string
        if (isLocalEnv) {
          redirectUrl = `${origin}/signin?confirmed=true&email=${encodeURIComponent(data.user.email || '')}`
        } else if (forwardedHost) {
          redirectUrl = `https://${forwardedHost}/signin?confirmed=true&email=${encodeURIComponent(data.user.email || '')}`
        } else {
          redirectUrl = `${origin}/signin?confirmed=true&email=${encodeURIComponent(data.user.email || '')}`
        }
        
        console.log('🎯 Redirecting to success page:', redirectUrl)
        return NextResponse.redirect(redirectUrl)
      } else if (error) {
        console.log('❌ Auth callback error:', {
          message: error.message,
          status: error.status,
          details: error
        })
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=auth_error&description=${encodeURIComponent(error.message)}`)
      } else {
        console.log('❌ Auth callback: No session created', {
          hasData: !!data,
          hasUser: !!data?.user,
          hasSession: !!data?.session,
          userStatus: data?.user ? 'user exists but no session' : 'no user'
        })
        
        // Check if user exists but email is already confirmed (common case)
        if (data?.user && !data?.session) {
          console.log('⚠️ User exists but no session - email may already be confirmed')
          return NextResponse.redirect(`${origin}/signin?confirmed=true&email=${encodeURIComponent(data.user.email || '')}&message=already_confirmed`)
        }
        
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_session&description=${encodeURIComponent('Email confirmation link may have expired or already been used')}`)
      }
    } catch (e) {
      console.error('❌ Auth callback exception:', {
        error: e,
        message: e instanceof Error ? e.message : 'Unknown error',
        stack: e instanceof Error ? e.stack : undefined
      })
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=exception&description=${encodeURIComponent('An unexpected error occurred during email confirmation')}`)
    }
  }

  // No code parameter - invalid callback
  console.log('❌ Auth callback: No code parameter provided')
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_code&description=${encodeURIComponent('Invalid confirmation link format')}`)
} 