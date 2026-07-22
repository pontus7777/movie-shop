'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Copy, Check, Globe, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { shareWishlist, unshareWishlist } from '../_actions/wishlist-action'

type Props = {
  initialIsPublic: boolean
  initialShareId: string | null
}

export function ShareWishlistButton({ initialIsPublic, initialShareId }: Props) {
  const [isPublic, setIsPublic] = useState(initialIsPublic)
  const [shareId, setShareId] = useState(initialShareId)
  const [copied, setCopied] = useState(false)
  const [isPending, startTransition] = useTransition()

  const shareUrl = shareId ? `${process.env.BETTER_AUTH_URL}/wishlist/share/${shareId}` : null

  function handleToggle() {
    startTransition(async () => {
      if (isPublic) {
        const result = await unshareWishlist()
        if (result.success) {
          setIsPublic(false)
          toast.success('Wishlist is now private')
        }
      } else {
        const result = await shareWishlist()
        if (result.success) {
          setIsPublic(true)
          setShareId(result.shareId)
          toast.success('Wishlist is now public')
        }
      }
    })
  }

  function handleCopy() {
    if (!shareUrl) return
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success('Link copied')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mx-5 mt-5 flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-white/3 p-3">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            'flex size-9 items-center justify-center rounded-full border transition-colors',
            isPublic
              ? 'border-purple-500/40 bg-purple-950/40 text-purple-300'
              : 'border-white/10 bg-white/5 text-muted-foreground',
          )}
        >
          {isPublic ? <Globe className="size-4" /> : <Lock className="size-4" />}
        </div>

        <div className="flex flex-col">
          <span className="text-sm font-medium">
            {isPublic ? 'Public wishlist' : 'Private wishlist'}
          </span>
          <span className="text-muted-foreground text-xs">
            {isPublic ? 'Anyone with the link can view this' : 'Only you can see this'}
          </span>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {isPublic && shareUrl && (
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="text-purple-300 hover:bg-purple-950/40 hover:text-purple-200"
          >
            {copied ? <Check className="mr-1 size-4" /> : <Copy className="mr-1 size-4" />}
            {copied ? 'Copied' : 'Copy link'}
          </Button>
        )}

        <Button
          size="sm"
          variant={isPublic ? 'outline' : 'default'}
          onClick={handleToggle}
          disabled={isPending}
          className={cn(
            !isPublic && 'bg-purple-600 text-white hover:bg-purple-700',
            isPublic && 'border-purple-500/40',
          )}
        >
          <Share2 className="mr-1 size-4" />
          {isPublic ? 'Make private' : 'Share wishlist'}
        </Button>
      </div>
    </div>
  )
}
