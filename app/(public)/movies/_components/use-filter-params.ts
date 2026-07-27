'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

export function useFilterParams() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

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

  function updateSingleParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams)

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    params.delete('page')

    push(params)
  }

  function updateRangeParam(minKey: string, maxKey: string, value: [number, number]) {
    const params = new URLSearchParams(searchParams)

    params.set(minKey, String(value[0]))
    params.set(maxKey, String(value[1]))

    params.delete('page')

    push(params)
  }

  function clearParams(keys: string[]) {
    const params = new URLSearchParams(searchParams)

    keys.forEach((key) => params.delete(key))
    params.delete('page')

    push(params)
  }

  function push(params: URLSearchParams) {
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`)
    })
  }

  return {
    searchParams,
    isPending,
    updateParam,
    updateSingleParam,
    updateRangeParam,
    clearParams,
  }
}
