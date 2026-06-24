export function convertToSek(priceInOre: number) {
  return priceInOre / 100
}

export function convertFromSek(priceInSek: number) {
  return priceInSek * 100
}
