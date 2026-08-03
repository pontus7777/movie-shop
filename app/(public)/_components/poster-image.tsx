'use client'

import { useState } from 'react'
import Image from 'next/image'
import placeHolder from '@/public/file.svg'

type Props = {
  src: string
  alt: string
  sizes: string
  className?: string
}

export function PosterImage({ src, alt, sizes, className }: Props) {
  const [imgSrc, setImgSrc] = useState(src)

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => setImgSrc(placeHolder.src)}
    />
  )
}
