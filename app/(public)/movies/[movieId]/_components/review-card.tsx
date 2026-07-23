import { Card, CardContent, CardHeader } from '@/components/ui/card'

type ReviewCardProps = {
  review: {
    id: string
    rating: number
    comment: string | null
    user: {
      name: string
    }
  }
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <p className="font-semibold">{review.user.name}</p>

          <p>{review.rating}/5 ⭐</p>
        </div>
      </CardHeader>

      <CardContent>
        <p>{review.comment}</p>
      </CardContent>
    </Card>
  )
}
