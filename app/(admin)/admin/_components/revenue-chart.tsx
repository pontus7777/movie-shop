'use client'

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

type Props = {
  data: {
    month: string
    revenue: number
  }[]
}

const chartConfig = {
  revenue: {
    label: 'Revenue',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function RevenueChart({ data }: Props) {
  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <LineChart
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
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)}
        />

        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          domain={[0, 'auto']}
          tickFormatter={(value) => `$${value}`}
        />

        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />

        <Line
          dataKey="revenue"
          type="monotone"
          strokeWidth={2}
          stroke="var(--chart-1)"
          dot={false}
        />
      </LineChart>
    </ChartContainer>
  )
}
