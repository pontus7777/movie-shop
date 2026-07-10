import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { auth } from '@/lib/auth'

import { RegisterForm } from './_components/register-form'

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
        <RegisterForm />
      </div>
    </div>
  )
}
