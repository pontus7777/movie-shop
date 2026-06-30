'use client'

import { useForm } from '@tanstack/react-form'
import { Save } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

import { editMovie } from '../../../_actions/edit-movie-action'
import { convertToEuro } from '@/lib/priceUtils'
import { Crew, Genre } from '@/generated/prisma/client'
import { CrewSelector } from '@/components/movies/crew-selector'
import { GenreSelector } from '@/components/movies/genre-selector'

const editFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(32, 'Title must be less than 32 characters'),
  description: z.string().min(1, 'Description is required').max(1000),
  price: z.number().min(1).max(1000000),
  releaseYear: z.number().min(0).max(9999),
  stock: z.boolean(),
  runtime: z.number().min(10),
  imageUrl: z.string(),
  crewMemberIds: z.array(z.string()),
  genreIds: z.array(z.number()),
})

type EditMovieProps = {
  movie: {
    id: string
    title: string
    description: string
    price: number
    releaseYear: number
    stock: boolean
    runtime: number
    imageUrl: string | null

    crewMembers: Crew[]
    genres: Genre[]
  }

  crewMembers: Crew[]
  genres: Genre[]
}

function EditMovieForm({ movie, crewMembers, genres }: EditMovieProps) {
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      title: movie.title,
      description: movie.description,
      price: convertToEuro(movie.price),
      releaseYear: movie.releaseYear,
      stock: movie.stock,
      runtime: movie.runtime,
      imageUrl: movie.imageUrl ?? '',

      crewMemberIds: movie.crewMembers.map((member) => member.id),
      genreIds: movie.genres.map((genre) => genre.id),
    },
    validators: {
      onSubmit: editFormSchema,
      onBlur: editFormSchema,
    },

    onSubmit: async ({ value, formApi }) => {
      const updatedMovie = await editMovie({
        ...value,
        id: movie.id,
      })

      formApi.reset({
        title: updatedMovie.title,
        description: movie.description,
        price: Number(movie.price),
        releaseYear: movie.releaseYear,
        stock: movie.stock,
        runtime: movie.runtime,
        imageUrl: updatedMovie.imageUrl ?? '',
        crewMemberIds: updatedMovie.crewMembers.map((member) => member.id),
        genreIds: updatedMovie.genres.map((genre) => genre.id),
      })

      toast.success('Form edited successfully', {})
      router.push(`/admin/movies/${updatedMovie.id}`)
      router.refresh()
    },
  })
  const actors = crewMembers.filter((member) => member.role === 'ACTOR')

  const directors = crewMembers.filter((member) => member.role === 'DIRECTOR')
  return (
    <form
      method="POST"
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <FieldGroup>
        <form.Field name="title">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="description">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                  className="h-35"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="price">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={field.state.value}
                  min={1}
                  max={1000000}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="imageUrl">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Image URL</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="releaseYear">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Release year</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        <form.Field name="runtime">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Runtime</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(Number(e.target.value))}
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>
        {/* ====Crew: CheckBox Component actors, derictors ====== */}
        <form.Field name="crewMemberIds">
          {(field) => (
            <div className="space-y-4">
              <CrewSelector
                title="Actors"
                crew={actors}
                value={field.state.value}
                onChange={field.handleChange}
              />

              <CrewSelector
                title="Directors"
                crew={directors}
                value={field.state.value}
                onChange={field.handleChange}
              />
            </div>
          )}
        </form.Field>

        <form.Field name="genreIds">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid}>
                <GenreSelector
                  title="Genres"
                  genres={genres}
                  value={field.state.value}
                  onChange={field.handleChange}
                />

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {/* ====Genre: CheckBox Component  ====== */}
        <form.Field name="stock">
          {(field) => (
            <Field orientation="horizontal">
              <Switch
                id={field.name}
                name={field.name}
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(checked)}
                onBlur={field.handleBlur}
              />

              <FieldLabel htmlFor={field.name}>In stock</FieldLabel>
            </Field>
          )}
        </form.Field>

        <FieldSeparator />

        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Field orientation="horizontal">
              <Button
                type="reset"
                disabled={isSubmitting}
                onClick={(e) => {
                  e.preventDefault()
                  form.reset()
                }}
                variant="outline"
              >
                Reset
              </Button>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <Spinner /> : <Save />}
                Save Movie
              </Button>
            </Field>
          )}
        </form.Subscribe>
      </FieldGroup>
    </form>
  )
}

export { EditMovieForm }
