import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

type Props = {
  title: string
  value: string | number
  icon: LucideIcon
  iconClassName?: string
}

export function StatCard({ title, value, icon: Icon, iconClassName }: Props) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>

        <Icon className={cn('size-5 text-muted-foreground', iconClassName)} />
      </CardHeader>

      <CardContent>
        <p className="text-3xl font-bold tracking-tight">{value}</p>
      </CardContent>
    </Card>
  )
}
