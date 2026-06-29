'use client'

import { useForm } from '@tanstack/react-form'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { createMovie } from '../../_actions/create-movie-action'
import { Crew } from '@/generated/prisma/client'
import { GenreSelector } from '@/components/movies/genre-selector'
import { CrewEditor } from '@/components/movies/CrewEditor'

type Props = {
  crew: Crew[]
  genres: { id: number; name: string }[]
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(32, 'Title must be less than 32 characters'),
  description: z.string().min(1, 'Description is required').max(1000),
  price: z.number().positive('Price must be greater than 0'),
  releaseYear: z
    .number()
    .int()
    .min(1888)
    .max(new Date().getFullYear() + 5),
  stock: z.boolean(),
  runtime: z.number().int().positive(),
  imageUrl: z.string().url('Invalid image URL').or(z.literal('')),

  //==== Crew members =====

  crewMembers: z
    .array(
      z.object({
        name: z.string().trim().min(1, 'Crew member name is required'),
        actor: z.boolean(),
        director: z.boolean(),
      }),
    )
    .min(1, 'Add at least one crew member')
    .refine((crew) => crew.every((member) => member.actor || member.director), {
      //The .refine() call checks every crew member.
      message: 'Each crew member must have at least one role.',
    }),
  genreIds: z.array(z.number()).min(1),
})

function CreateMovieForm({ genres }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      price: 1,
      releaseYear: 1920,
      stock: false,
      runtime: 10,
      imageUrl: '',
      genreIds: [] as number[],
      crewMembers: [
        {
          name: '',
          actor: false,
          director: false,
        },
      ],
    },
    validators: {
      onSubmit: formSchema,
      onBlur: formSchema,
    },
    onSubmit: async ({ value }) => {
      console.log('🔥 SUBMIT FIRED', value)
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

    onSubmitInvalid: ({ value }) => {
      console.log('INVALID SUBMIT')
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

        <form.Field name="imageUrl">
          {(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>Image URL</FieldLabel>
                <Input
                  id={field.name}
                  placeholder="https://picsum.photos/300/450"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
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
                  type={'number'}
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

        <form.Field name="releaseYear">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Release year</FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
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
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid} orientation="horizontal">
                <Switch
                  id={field.name}
                  name={field.name}
                  checked={field.state.value}
                  onCheckedChange={(checked) => {
                    field.handleChange(checked)
                  }}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                />

                <FieldLabel htmlFor={field.name}>In stock</FieldLabel>
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
        {/* ======= CrewMembers checkbox field ========= */}
        <form.Field name="crewMembers">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid}>
                <CrewEditor value={field.state.value} onChange={field.handleChange} />

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field>

        {/* ======= Genre checkbox field ========= */}

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
