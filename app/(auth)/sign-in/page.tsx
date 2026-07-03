import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { SignInForm } from './_components/sign-in-form'
import Link from 'next/link'
import { Film } from 'lucide-react'

export default async function SignInPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    redirect('/movies') // ★ changed from '/' to '/movies'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="flex flex-col items-center gap-2 text-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-purple-600 rounded-lg p-2">
              <Film className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              Cine<span className="text-purple-500">Vault</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold mt-2">Welcome back</h1>
          <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <SignInForm />
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-medium text-purple-500 hover:text-purple-400 underline-offset-4 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}
