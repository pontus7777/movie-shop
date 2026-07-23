import { ReviewForm } from './review-form'
import { ReviewList } from './review-list'
import { ReviewSummary } from './review-summary'
import { Separator } from '@/components/ui/separator'

type ReviewSectionProps = {
  movieId: string
  userRating: number | null
  userReviewCount: number
  userReview: {
    rating: number
    comment: string | null
  } | null
  reviews: {
    id: string
    rating: number
    comment: string | null
    user: {
      name: string
    }
  }[]
}

export function ReviewSection({
  movieId,
  userRating,
  userReviewCount,
  reviews,
}: ReviewSectionProps) {
  return (
    <section className="mx-auto mt-16 max-w-5xl px-6">
      <Separator className="mb-8" />

      <h2 className="mb-6 text-3xl font-bold">Community Reviews</h2>

      <ReviewSummary rating={userRating} reviewCount={userReviewCount} />

      <ReviewForm movieId={movieId} />

      <ReviewList reviews={reviews} />
    </section>
  )
}
