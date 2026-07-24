import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

type Props = {
  title: string
  children: React.ReactNode
  icon?: LucideIcon
  iconClassName?: string
  className?: string
}

export function DashboardCard({ title, children, icon: Icon, iconClassName, className }: Props) {
  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>

        {Icon && <Icon className={cn('size-5 text-muted-foreground', iconClassName)} />}
      </CardHeader>

      <CardContent>
        <div className="h-87.5 w-full">{children}</div>
      </CardContent>
    </Card>
  )
}
