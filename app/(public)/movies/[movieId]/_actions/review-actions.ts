'use server'

import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

type CreateReviewInput = {
  movieId: string
  rating: number
  comment?: string
}

type ReviewActionResult = {
  success: boolean
  message: string
}

export async function createReview({
  movieId,
  rating,
  comment,
}: CreateReviewInput): Promise<ReviewActionResult> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return {
      success: false,
      message: 'You must be logged in to review this movie.',
    }
  }

  if (rating < 1 || rating > 5) {
    return {
      success: false,
      message: 'Rating must be between 1 and 5.',
    }
  }

  const purchase = await prisma.orderItem.findFirst({
    where: {
      movieId,
      order: {
        userId: session.user.id,
        status: 'PAID',
      },
    },
  })

  if (!purchase) {
    return {
      success: false,
      message: 'You must purchase this movie before reviewing it.',
    }
  }

  const existingReview = await prisma.review.findUnique({
    where: {
      userId_movieId: {
        userId: session.user.id,
        movieId,
      },
    },
  })

  await prisma.review.upsert({
    where: {
      userId_movieId: {
        userId: session.user.id,
        movieId,
      },
    },
    update: {
      rating,
      comment,
    },
    create: {
      movieId,
      userId: session.user.id,
      rating,
      comment,
    },
  })

  const aggregate = await prisma.review.aggregate({
    where: {
      movieId,
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  })

  await prisma.movie.update({
    where: {
      id: movieId,
    },
    data: {
      userRating: aggregate._avg.rating ?? 0,
      userReviewCount: aggregate._count.rating,
    },
  })

  revalidatePath(`/movies/${movieId}`)

  return {
    success: true,
    message: existingReview ? 'Your review was updated!' : 'Review submitted successfully!',
  }
}
