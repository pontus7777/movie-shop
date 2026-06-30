import { User } from 'better-auth'

type Props = {
  user: User
}

export function UserProfile({ user }: Props) {
  return (
    <section className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full font-medium">
          {user.name?.charAt(0).toUpperCase()}
        </div>

        <div>
          <h2 className="text-lg font-semibold">{user.name}</h2>
          <p className="text-muted-foreground text-sm">Profile information</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-4">
          <span className="text-muted-foreground w-32">Email</span>
          <span className="font-medium">{user.email}</span>
        </div>

        <div className="flex gap-4">
          <span className="text-muted-foreground w-32">Account created</span>
          <span className="font-medium">{user.createdAt.toLocaleDateString()}</span>
        </div>
      </div>
    </section>
  )
}
