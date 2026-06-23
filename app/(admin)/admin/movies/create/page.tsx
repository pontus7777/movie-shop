import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import { CreateMovieForm } from './_components/create-movie-form'

export default function CreateMoviePage() {
  return (
    <div className="mx-auto mt-10 flex w-full justify-center px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Create Movie</CardTitle>
          <CardDescription>Add a new movie </CardDescription>
        </CardHeader>

        <CardContent>
          <CreateMovieForm />
        </CardContent>
      </Card>
    </div>
  )
}
