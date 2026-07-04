import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LayersPlus, ShieldUser, UserCheck, Users } from 'lucide-react'

type Props = {
  totalUsers: number
  newUsers: number
  admins: number
  verifiedUsers: number
}

export function UserStats({ totalUsers, admins, verifiedUsers, newUsers }: Props) {
  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
    },
    {
      title: 'Administrators',
      value: admins,
      icon: ShieldUser,
    },
    {
      title: 'Verified Users',
      value: verifiedUsers,
      icon: UserCheck,
    },
    {
      title: 'New This Month',
      value: newUsers,
      icon: LayersPlus,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>{stat.title}</span>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardDescription>
          </CardHeader>
          <CardTitle className="text-3xl">{stat.value}</CardTitle>
        </Card>
      ))}
    </div>
  )
}
