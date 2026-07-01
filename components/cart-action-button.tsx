'use client'

import { useState } from 'react'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type Props = React.ComponentProps<typeof Button> & {
  movieId: string
  toastMessage: string
  action: (movieId: string) => Promise<unknown>
}

function CartActionButton({ movieId, toastMessage, action, ...props }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    setLoading(true)
    await action(movieId)
    setLoading(false)

    toast.success(toastMessage)
    router.refresh()
  }

  return <Button {...props} onClick={handleClick} disabled={loading} />
}

export { CartActionButton }
