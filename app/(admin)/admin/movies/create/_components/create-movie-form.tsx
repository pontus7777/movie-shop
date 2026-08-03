'use client'

import { GenreSelector } from '@/app/(admin)/admin/movies/_components/genre-selector'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Crew, Genre } from '@/generated/prisma/client'
import { useForm } from '@tanstack/react-form'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { CrewCommandSelector } from '../../_components/crew-command-selector'
import { createMovie } from '../../_actions/create-movie-action'
import { createMovieSchema } from '@/lib/validations/movie'

type Props = {
  crewMembers: Crew[]
  genres: Omit<Genre, 'description'>[]
}

function CreateMovieForm({ crewMembers, genres }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      price: '10',
      releaseYear: 1920,
      stock: false,
      runtime: 90,
      imageUrl: '',
      crew: [] as { id: string; role: 'ACTOR' | 'DIRECTOR' }[],
      genreIds: [] as number[],

      salePrice: '',
      saleStartsAt: '',
      saleEndsAt: '',
    },
    validators: {
      onSubmit: createMovieSchema,
      onBlur: createMovieSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true)
      try {
        const newMovie = await createMovie(value)

        toast.success('Movie created successfully')
        router.push(`/admin/movies/${newMovie.id}`)
      } catch (err) {
        console.log(err)
        toast.error('Failed to submit form', {
          position: 'bottom-center',
        })
      } finally {
        setLoading(false)
      }
    },
  })

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
            const isInvalid = !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  id={field.name}
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
            const isInvalid = !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="h-35"
                  aria-invalid={isInvalid}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>
        <form.Field name="imageUrl">
          {(field) => {
            const isInvalid = !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Image URL</FieldLabel>
                <Input
                  id={field.name}
                  placeholder="https://picsum.photos/300/450"
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
        <form.Field name="price">
          {(field) => {
            const isInvalid = !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                <Input
                  id={field.name}
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
        <form.Field name="salePrice">
          {(field) => {
            const isInvalid = !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Sale price (optional)</FieldLabel>
                <Input
                  id={field.name}
                  type="text"
                  placeholder="e.g. 4.99"
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
        <form.Field name="saleStartsAt">
          {(field) => {
            const isInvalid = !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Sale starts</FieldLabel>
                <Input
                  id={field.name}
                  type="datetime-local"
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
        <form.Field name="saleEndsAt">
          {(field) => {
            const isInvalid = !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Sale ends</FieldLabel>
                <Input
                  id={field.name}
                  type="datetime-local"
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
            const isInvalid = !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Release year</FieldLabel>
                <Input
                  id={field.name}
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
        <form.Field name="stock">
          {(field) => (
            <Field orientation="horizontal">
              <Switch
                id={field.name}
                checked={field.state.value}
                onCheckedChange={(checked) => field.handleChange(checked)}
                onBlur={field.handleBlur}
              />
              <FieldLabel htmlFor={field.name}>In stock</FieldLabel>
            </Field>
          )}
        </form.Field>
        <form.Field name="runtime">
          {(field) => {
            const isInvalid = !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Runtime</FieldLabel>
                <Input
                  id={field.name}
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
        <form.Field name="crew">
          {(field) => {
            const isInvalid = !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <CrewCommandSelector
                  crew={crewMembers}
                  value={field.state.value}
                  onChange={field.handleChange}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>
        <form.Field name="genreIds">
          {(field) => {
            const isInvalid = !field.state.meta.isValid
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
      </FieldGroup>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {loading ? 'Creating...' : 'Create Movie'}
        </Button>
      </div>
    </form>
  )
}

export { CreateMovieForm }
