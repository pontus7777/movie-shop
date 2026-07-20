import { requireAdmin } from '@/lib/session-validation'

export default async function AdminPage() {
  await requireAdmin()
  return (
    <div>
      <h1 className="mx-auto text-4xl font-bold">Admin Page</h1>
    </div>
  )
}
