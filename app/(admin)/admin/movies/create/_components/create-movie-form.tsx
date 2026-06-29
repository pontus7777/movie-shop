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
import { CrewSelector } from '@/components/movies/crew-selector'
import { GenreSelector } from '@/components/movies/genre-selector'

type Props = {
  crewMembers: Crew[]
  genres: { id: number; name: string }[]
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(32, 'Title must be less than 32 characters'),
  description: z.string().min(1, 'Description is required').max(1000),
  price: z.number(),
  releaseYear: z.number().min(0).max(9999),
  stock: z.boolean(),
  runtime: z.number().min(10),
  imageUrl: z.string(),
  crewMemberIds: z.array(z.string()).min(1),
  genreIds: z.array(z.number()).min(1),
})

function CreateMovieForm({ crewMembers, genres }: Props) {
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
      crewMemberIds: [] as string[],
      genreIds: [] as number[],
    },
    validators: {
      onSubmit: formSchema,
      onBlur: formSchema,
    },
    onSubmit: async ({ value }) => {
      setLoading(true)
      try {
        const newMovie = await createMovie(value)

        toast.success('Movie created successfully')

        router.push(`/admin/movies/${newMovie.id}`) //need and issue to work on that!!!
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

  // const actors = crewMembers.filter((member) => member.role === 'ACTOR')

  // const directors = crewMembers.filter((member) => member.role === 'DIRECTOR')

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
        {/* ======= Crew checkbox field ========= */}
        {/* 
        <form.Field name="crewMemberIds">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

            return (
              <Field data-invalid={isInvalid}>
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

                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            )
          }}
        </form.Field> */}

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

        {/* <form.Field name="genreIds">
            {(field) => {

              const value = field.state.value as number[]
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid

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
          </form.Field> */}
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
