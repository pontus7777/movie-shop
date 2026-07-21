'use client'

import { Pie, PieChart } from 'recharts'

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

type Props = {
  data: {
    name: string
    count: number
  }[]
}

const chartConfig = {
  movies: {
    label: 'Movies',
  },
} satisfies ChartConfig

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

export function MovieCategoryChart({ data }: Props) {
  const chartData = data.map((item, index) => ({
    genre: item.name,
    movies: item.count,
    fill: COLORS[index % COLORS.length],
  }))

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-75">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />

        <Pie data={chartData} dataKey="movies" nameKey="genre" innerRadius={60} strokeWidth={2} />
      </PieChart>
    </ChartContainer>
  )
}
