'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

type Props = {
  data: {
    month: string
    users: number
  }[]
}

const chartConfig = {
  users: {
    label: 'Users',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function UserRegistrationChart({ data }: Props) {
  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
          top: 12,
          bottom: 12,
        }}
      >
        <CartesianGrid vertical={false} />

        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          tickFormatter={(value) => value.slice(0, 3)}
        />

        <YAxis tickLine={false} axisLine={false} />

        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />

        <Bar dataKey="users" fill="var(--color-users)" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
