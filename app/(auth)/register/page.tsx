import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

import { RegisterForm } from './_components/register-form'
import Link from 'next/link'
import { Film } from 'lucide-react'

export default async function RegisterPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (session) {
    redirect('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-xl p-4">
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
          <h1 className="text-2xl font-bold mt-2 pb-5">Sign up to purchase movies</h1>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}
