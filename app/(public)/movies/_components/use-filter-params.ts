'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useRef, useTransition } from 'react'

export function useFilterParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [isPending, startTransition] = useTransition()

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  function push(params: URLSearchParams) {
    const url = `${pathname}?${params.toString()}`

    startTransition(() => {
      router.replace(url, {
        scroll: false,
      })
    })
  }

  function debouncedPush(params: URLSearchParams) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      push(params)
    }, 300)
  }

  function updateParam(key: string, value: string, checked: boolean) {
    const params = new URLSearchParams(searchParams)

    const current = params.getAll(key)

    if (checked) {
      if (!current.includes(value)) {
        params.append(key, value)
      }
    } else {
      params.delete(key)

      current.filter((item) => item !== value).forEach((item) => params.append(key, item))
    }

    params.delete('page')

    push(params)
  }

  function updateRangeParam(minKey: string, maxKey: string, value: [number, number]) {
    const params = new URLSearchParams(searchParams)

    params.set(minKey, String(value[0]))
    params.set(maxKey, String(value[1]))

    params.delete('page')

    debouncedPush(params)
  }

  function clearParams(keys: string[]) {
    const params = new URLSearchParams(searchParams)

    keys.forEach((key) => params.delete(key))

    params.delete('page')

    push(params)
  }

  return {
    searchParams,
    isPending,
    updateParam,
    updateRangeParam,
    clearParams,
  }
}
