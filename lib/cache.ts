import { unstable_cache } from 'next/cache'

export function cached<T>(fn: () => Promise<T>, key: string[], tags: string[], revalidate = 3600) {
  return unstable_cache(fn, key, {
    tags,
    revalidate,
  })
}
