import { Star } from 'lucide-react'

type Props = {
  rating: number | null
  reviewCount: number
}

export function ReviewSummary({ rating, reviewCount }: Props) {
  return (
    <div className="mb-10 flex items-center gap-4 rounded-xl border p-6">
      <Star className="fill-yellow-400 text-yellow-400" />

      <div>
        <p className="text-3xl font-bold">{rating?.toFixed(1) ?? '0.0'}</p>

        <p className="text-muted-foreground">{reviewCount} reviews</p>
      </div>
    </div>
  )
}
