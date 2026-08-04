import Link from 'next/link'
import { Hand, Home } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function GoodbyePage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <Hand className="h-7 w-7 text-primary" />
          </div>

          <CardTitle className="text-2xl">Sorry to see you go!</CardTitle>
          <CardDescription className="mt-2 text-base">
            Your account has been deleted. We´d love to have you back anytime.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button asChild className="w-full gap-2">
            <Link href="/">
              <Home className="h-4 w-4" />
              Back to home
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}