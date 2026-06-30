export function convertToEuro(priceInCents: number) {
  return priceInCents / 100
}

export function convertFromEuro(priceInEuro: number) {
  return Math.round(priceInEuro * 100)
}
