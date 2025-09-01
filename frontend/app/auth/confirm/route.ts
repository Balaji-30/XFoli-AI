import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const redirect_to = searchParams.get('redirect_to')
  
  console.log('🔍 Auth confirm received:', {
    origin,
    hasTokenHash: !!token_hash,
    type,
    redirectTo: redirect_to,
    fullUrl: request.url
  })

  if (token_hash && type) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        type: type as any
      })
      
      console.log('🔍 verifyOtp result:', {
        hasError: !!error,
        errorMessage: error?.message,
        hasData: !!data,
        hasSession: !!data?.session,
        hasUser: !!data?.user,
        userId: data?.user?.id,
        userEmail: data?.user?.email,
        userConfirmedAt: data?.user?.email_confirmed_at
      })
      
      if (!error && data?.user) {
        console.log('✅ Email verification successful for user:', data.user.email)
        
        // Use provided redirect_to or default to signin with success
        const finalRedirectUrl = redirect_to || `${origin}/signin?confirmed=true&email=${encodeURIComponent(data.user.email || '')}`
        
        console.log('🎯 Redirecting to:', finalRedirectUrl)
        return NextResponse.redirect(finalRedirectUrl)
      } else if (error) {
        console.log('❌ Auth verify error:', {
          message: error.message,
          status: error.status,
          details: error
        })
        
        // Handle specific error types
        if (error.message?.includes('expired')) {
          return NextResponse.redirect(`${origin}/auth/auth-code-error?error=expired&description=${encodeURIComponent('Confirmation link has expired. Please request a new one.')}`)
        } else if (error.message?.includes('already been used')) {
          return NextResponse.redirect(`${origin}/signin?confirmed=true&message=already_confirmed`)
        } else {
          return NextResponse.redirect(`${origin}/auth/auth-code-error?error=verify_error&description=${encodeURIComponent(error.message)}`)
        }
      } else {
        console.log('❌ Auth verify: No user returned')
        return NextResponse.redirect(`${origin}/auth/auth-code-error?error=no_user&description=${encodeURIComponent('Email verification failed - no user data returned')}`)
      }
    } catch (e) {
      console.error('❌ Auth verify exception:', {
        error: e,
        message: e instanceof Error ? e.message : 'Unknown error',
        stack: e instanceof Error ? e.stack : undefined
      })
      return NextResponse.redirect(`${origin}/auth/auth-code-error?error=exception&description=${encodeURIComponent('An unexpected error occurred during email verification')}`)
    }
  }

  // Missing required parameters
  console.log('❌ Auth confirm: Missing token_hash or type parameter')
  return NextResponse.redirect(`${origin}/auth/auth-code-error?error=missing_params&description=${encodeURIComponent('Invalid confirmation link - missing required parameters')}`)
} 