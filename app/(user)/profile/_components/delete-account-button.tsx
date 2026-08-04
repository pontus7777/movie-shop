'use client'

import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { authClient } from '@/lib/auth-client'

type Props = React.ComponentProps<typeof Button>

export function DeleteUserAccountButton({ ...buttonProps }: Props) {
  async function handleClick() {
    const confirmed = confirm(
      'Are you sure you want to delete your account? This action cannot be undone.',
    )

    if (!confirmed) return

    await authClient.deleteUser()
    window.location.href = '/goodbye'
    // router.push() dont work here because the router instance is gone after deleteUser()
  }

  return (
    <Button {...buttonProps} onClick={handleClick}>
      <Trash2 className="h-4 w-4" />
      Delete Account
    </Button>
  )
}

