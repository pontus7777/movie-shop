import { User } from 'better-auth'

type Props = {
  user: User
}

export function UserProfile({ user }: Props) {
  return (
    <div>
      <h1>Welcome {user.name}!</h1>
      <div>
        <p>Email: {user.email}</p>
        <p>Created at: {user.createdAt.toLocaleDateString()}</p>
      </div>
    </div>
  )
}
