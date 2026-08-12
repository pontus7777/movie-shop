import { describe, expect, test } from 'vitest'

import { getEffectivePriceInCents, isMovieOnSale } from './pricing'

function movie(overrides: Partial<Parameters<typeof isMovieOnSale>[0]> = {}) {
  return {
    priceInCents: 1999,
    salePriceInCents: null,
    saleStartsAt: null,
    saleEndsAt: null,
    ...overrides,
  }
}

const JUNE = new Date('2026-06-15T12:00:00Z')

describe('isMovieOnSale', () => {
  test('a movie with no sale price is not on sale', () => {
    expect(isMovieOnSale(movie(), JUNE)).toBe(false)
  })

  test('a sale price with no window is always on sale', () => {
    expect(isMovieOnSale(movie({ salePriceInCents: 999 }), JUNE)).toBe(true)
  })

  test('a sale that has not started yet is not on sale', () => {
    const m = movie({ salePriceInCents: 999, saleStartsAt: new Date('2026-07-01T00:00:00Z') })
    expect(isMovieOnSale(m, JUNE)).toBe(false)
  })

  // Decisions nobody has written down yet — see the audit, finding C2.
  test.todo('is a sale live at exactly saleStartsAt?')
  test.todo('is a sale live at exactly saleEndsAt?')
  test.todo('what happens when saleEndsAt is before saleStartsAt?')
})

describe('getEffectivePriceInCents', () => {
  test('falls back to list price when not on sale', () => {
    expect(getEffectivePriceInCents(movie(), JUNE)).toBe(1999)
  })

  test('uses the sale price when on sale', () => {
    expect(getEffectivePriceInCents(movie({ salePriceInCents: 999 }), JUNE)).toBe(999)
  })

  test.todo('what if salePriceInCents is higher than priceInCents?')
})
