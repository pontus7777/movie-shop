'use client'

import { useForm } from '@tanstack/react-form'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { z } from 'zod'

import { Crew, Genre } from '@/generated/prisma/client'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSeparator } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { GenreSelector } from '@/app/(admin)/admin/movies/_components/genre-selector'
import { Spinner } from '@/components/ui/spinner'
import { Save } from 'lucide-react'

import { editMovie } from '../../../_actions/edit-movie-action'
import { CrewCommandSelector } from '../../../_components/crew-command-selector'

const editFormSchema = z
  .object({
    title: z.string().min(1).max(50),
    description: z.string().min(1).max(1000),
    price: z
      .string()
      .refine((val) => /^\d+(\.\d{1,2})?$/.test(val), 'Price must be a valid number like 21.29'),

    salePrice: z
      .string()
      .refine(
        (val) => val === '' || /^\d+(\.\d{1,2})?$/.test(val),
        'Sale price must be a valid number like 4.99, or empty',
      ),
    saleStartsAt: z.string(),
    saleEndsAt: z.string(),

    releaseYear: z.number().min(0).max(9999),
    stock: z.boolean(),
    runtime: z.number().min(10),
    imageUrl: z.string(),

    // NEW: crew with roles
    crew: z.array(
      z.object({
        id: z.string(),
        role: z.enum(['ACTOR', 'DIRECTOR']),
      }),
    ),

    genreIds: z.array(z.number()),
  })
  .refine(
    (data) => {
      if (!data.saleStartsAt || !data.saleEndsAt) return true
      return new Date(data.saleEndsAt) > new Date(data.saleStartsAt)
    },
    { message: 'Sale end date must be after the start date', path: ['saleEndsAt'] },
  )

type EditMovieProps = {
  movie: {
    id: string
    title: string
    description: string
    priceInCents: number
    releaseYear: number
    stock: boolean
    runtime: number
    imageUrl: string | null

    salePriceInCents: number | null
    saleStartsAt: Date | null
    saleEndsAt: Date | null

    credits: {
      crew: Crew
      role: 'ACTOR' | 'DIRECTOR'
    }[]

    genres: Genre[]
  }

  crewMembers: Crew[]
  genres: Genre[]
}

function toDatetimeLocalValue(date: Date | null): string {
  if (!date) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function EditMovieForm({ movie, crewMembers, genres }: EditMovieProps) {
  const router = useRouter()

  const form = useForm({
    defaultValues: {
      title: movie.title,
      description: movie.description,
      price: (movie.priceInCents / 100).toFixed(2),
      releaseYear: movie.releaseYear,
      stock: movie.stock,
      runtime: movie.runtime,
      imageUrl: movie.imageUrl ?? '',

      salePrice: movie.salePriceInCents != null ? (movie.salePriceInCents / 100).toFixed(2) : '',
      saleStartsAt: toDatetimeLocalValue(movie.saleStartsAt),
      saleEndsAt: toDatetimeLocalValue(movie.saleEndsAt),

      crew: movie.credits.map((credit) => ({
        id: credit.crew.id,
        role: credit.role,
      })),

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
        description: updatedMovie.description,
        price: (updatedMovie.priceInCents / 100).toFixed(2),
        releaseYear: updatedMovie.releaseYear,
        stock: updatedMovie.stock,
        runtime: updatedMovie.runtime,
        imageUrl: updatedMovie.imageUrl ?? '',

        salePrice:
          updatedMovie.salePriceInCents != null
            ? (updatedMovie.salePriceInCents / 100).toFixed(2)
            : '',
        saleStartsAt: toDatetimeLocalValue(updatedMovie.saleStartsAt),
        saleEndsAt: toDatetimeLocalValue(updatedMovie.saleEndsAt),

        crew: updatedMovie.credits.map((credit) => ({
          id: credit.crew.id,
          role: credit.role,
        })),

        genreIds: updatedMovie.genres.map((genre) => genre.id),
      })

      toast.success('Movie updated successfully')
      router.push(`/admin/movies/${updatedMovie.id}`)
      router.refresh()
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
        {/* TITLE */}
        <form.Field name="title">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {/* DESCRIPTION */}
        <form.Field name="description">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                <Textarea
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="h-35"
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {/* PRICE */}
        <form.Field name="price">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Price (€)</FieldLabel>
                <Input
                  id={field.name}
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {/* SALE PRICE */}
        <form.Field name="salePrice">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Sale price (€, optional)</FieldLabel>
                <Input
                  id={field.name}
                  type="text"
                  placeholder="e.g. 4.99"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {/* SALE STARTS */}
        <form.Field name="saleStartsAt">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Sale starts</FieldLabel>
                <Input
                  id={field.name}
                  type="datetime-local"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {/* SALE ENDS */}
        <form.Field name="saleEndsAt">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Sale ends</FieldLabel>
                <Input
                  id={field.name}
                  type="datetime-local"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {/* IMAGE URL */}
        <form.Field name="imageUrl">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Image URL</FieldLabel>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </Field>
          )}
        </form.Field>

        {/* RELEASE YEAR */}
        <form.Field name="releaseYear">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Release Year</FieldLabel>
              <Input
                id={field.name}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
            </Field>
          )}
        </form.Field>

        {/* RUNTIME */}
        <form.Field name="runtime">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Runtime (minutes)</FieldLabel>
              <Input
                id={field.name}
                type="number"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
            </Field>
          )}
        </form.Field>

        {/* CREW — Command Palette */}
        <form.Field name="crew">
          {(field) => (
            <Field>
              <FieldLabel>Crew</FieldLabel>
              <CrewCommandSelector
                crew={crewMembers}
                value={field.state.value}
                onChange={field.handleChange}
              />
            </Field>
          )}
        </form.Field>

        {/* GENRES */}
        <form.Field name="genreIds">
          {(field) => (
            <Field>
              <GenreSelector
                title="Genres"
                genres={genres}
                value={field.state.value}
                onChange={field.handleChange}
              />
            </Field>
          )}
        </form.Field>

        {/* STOCK */}
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

        <FieldSeparator />

        {/* SUBMIT */}
        <form.Subscribe selector={(state) => state.isSubmitting}>
          {(isSubmitting) => (
            <Field orientation="horizontal">
              <Button
                type="reset"
                disabled={isSubmitting}
                variant="outline"
                onClick={(e) => {
                  e.preventDefault()
                  form.reset()
                }}
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
