'use client'

import { useState, useEffect } from 'react'
import { signIn, getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FcGoogle } from 'react-icons/fc'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const errorParam = searchParams.get('error')

  useEffect(() => {
    if (errorParam) {
      setError(getErrorMessage(errorParam))
    }
  }, [errorParam])

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const result = await signIn('google', {
        callbackUrl,
        redirect: false,
      })

      if (result?.error) {
        setError(getErrorMessage(result.error))
      } else if (result?.ok) {
        // Check if session is created
        const session = await getSession()
        if (session) {
          router.push(callbackUrl)
        }
      }
    } catch (error) {
      console.error('Sign in error:', error)
      setError('Giriş yaparken bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'OAuthSignin':
        return 'OAuth sağlayıcısında hata oluştu.'
      case 'OAuthCallback':
        return 'OAuth callback hatası.'
      case 'OAuthCreateAccount':
        return 'Hesap oluşturulamadı.'
      case 'EmailCreateAccount':
        return 'E-posta ile hesap oluşturulamadı.'
      case 'Callback':
        return 'Callback hatası.'
      case 'OAuthAccountNotLinked':
        return 'Bu e-posta adresi başka bir hesapla kullanılıyor.'
      case 'EmailSignin':
        return 'E-posta gönderiminde hata.'
      case 'CredentialsSignin':
        return 'Geçersiz kimlik bilgileri.'
      case 'SessionRequired':
        return 'Bu sayfaya erişmek için giriş yapmanız gerekiyor.'
      default:
        return 'Giriş yaparken bir hata oluştu.'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Boardly</h1>
          <p className="text-gray-600">Proje yönetim platformunuza hoş geldiniz</p>
        </div>

        {/* Sign In Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Giriş Yap</CardTitle>
            <CardDescription className="text-center">
              Google hesabınız ile devam edin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-800 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}

            <Button
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full"
              variant="outline"
              size="lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  Giriş yapılıyor...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <FcGoogle className="h-5 w-5" />
                  Google ile Giriş Yap
                </div>
              )}
            </Button>

            <div className="text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Ana sayfaya dön
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <p className="text-xs text-center text-gray-500">
          Giriş yaparak{' '}
          <Link href="/terms" className="underline hover:text-gray-700">
            Kullanım Koşulları
          </Link>
          {' '}ve{' '}
          <Link href="/privacy" className="underline hover:text-gray-700">
            Gizlilik Politikası
          </Link>
          'nı kabul etmiş olursunuz.
        </p>
      </div>
    </div>
  )
} 