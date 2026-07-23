'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

type Props = {
  value: number
  onChange: (rating: number) => void
}

export function StarRating({ value, onChange }: Props) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button key={star} type="button" onClick={() => onChange(star)}>
          <Star
            className={cn(
              'size-7 transition-colors',
              value >= star ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground',
            )}
          />
        </button>
      ))}
    </div>
  )
}
