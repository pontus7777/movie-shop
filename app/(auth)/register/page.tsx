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
    <div className="mx-auto max-w-prose min-w-3xs p-4">
      <h1 className="mb-4 text-2xl font-bold">Register Page</h1>
      <RegisterForm />
    </div>
  )
}
