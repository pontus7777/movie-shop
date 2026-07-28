'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { StarRating } from './star-rating'
import { createReview } from '../_actions/review-actions'
import { toast } from 'sonner'

type ReviewFormProps = {
  movieId: string
}

export function ReviewForm({ movieId }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isPending, startTransition] = useTransition()

  function handleSubmit() {
    if (rating === 0) {
      return
    }

    startTransition(async () => {
      const result = await createReview({
        movieId,
        rating,
        comment,
      })

      if (result.success) {
        toast.success(result.message)

        setRating(0)
        setComment('')
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Card className="mb-10">
      <CardHeader>
        <CardTitle>Write a Review</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        <div>
          <p className="mb-2 text-sm text-muted-foreground">Your rating</p>

          <StarRating value={rating} onChange={setRating} />
        </div>

        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="What did you think about this movie?"
          rows={5}
        />

        <Button
          onClick={handleSubmit}
          disabled={isPending || rating === 0}
          className="bg-primary text-primary-foreground hover:opacity-90"
        >
          {isPending ? 'Submitting...' : 'Submit Review'}
        </Button>
      </CardContent>
    </Card>
  )
}
