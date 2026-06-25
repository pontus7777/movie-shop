"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

type Props = {
  action: () => Promise<void> //deletePost: (postId: string) => Promise<void>
}

function DeleteMovieBtn({ action }: Props) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleClick() {
   

    try {
      setIsLoading(true)

      await action()

      toast.success("Movie deleted successfully!")

      router.replace("/admin/movies")
    } catch {
      toast.error("Failed to delete movie")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className="border-red-500 bg-red-100 text-red-900 hover:bg-red-700 hover:text-white"
          >
            Delete
          </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Movie?</AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove the
              movie from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              variant="destructive"
              onClick={handleClick}
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
export { DeleteMovieBtn }