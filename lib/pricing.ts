type SalePricingFields = {
  priceInCents: number
  salePriceInCents: number | null
  saleStartsAt: Date | null
  saleEndsAt: Date | null
}

export function isMovieOnSale(movie: SalePricingFields, now: Date = new Date()): boolean {
  if (movie.salePriceInCents == null) return false
  if (movie.saleStartsAt && now < movie.saleStartsAt) return false
  if (movie.saleEndsAt && now > movie.saleEndsAt) return false
  return true
}

export function getEffectivePriceInCents(movie: SalePricingFields, now: Date = new Date()): number {
  return isMovieOnSale(movie, now) ? movie.salePriceInCents! : movie.priceInCents
}
