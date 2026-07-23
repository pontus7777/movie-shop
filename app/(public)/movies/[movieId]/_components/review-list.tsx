import { ReviewCard } from './review-card'

type ReviewListProps = {
  reviews: {
    id: string
    rating: number
    comment: string | null
    user: {
      name: string
    }
  }[]
}

export function ReviewList({ reviews }: ReviewListProps) {
  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}
