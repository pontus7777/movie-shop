import { unstable_cache } from 'next/cache'

export function cached<T>(fn: () => Promise<T>, key: string[], tags: string[], revalidate = 3600) {
  return unstable_cache(fn, key, {
    tags,
    revalidate,
  })
}

// Sorts object keys at every nesting level so structurally different values
// never collide into the same cache key. Passing Object.keys(obj).sort() as
// JSON.stringify's replacer only allowlists property names by name at every
// depth, silently dropping nested keys not present at the top level.
export function stableStringify(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a.localeCompare(b),
    )

    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${stableStringify(v)}`).join(',')}}`
  }

  return JSON.stringify(value)
}
